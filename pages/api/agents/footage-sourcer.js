import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { pexelsClient, pexelsRateLimiter, validatePexelsKey } from '../../../lib/pexels-client.js';

const MIN_DURATION = 5; // seconds
const REQUIRED_CLIPS = 4;
const MAX_PAGES = 4;

// Verified fallback stock footage clips
export const FALLBACK_FOOTAGE_IDS = [
  'fallback_clip_tech_1',
  'fallback_clip_tech_2',
  'fallback_clip_tech_3',
  'fallback_clip_tech_4'
];

async function checkDiskSpace(requiredBytes = 150 * 1024 * 1024) {
  try {
    if (typeof fs.promises.statfs === 'function') {
      const stats = await fs.promises.statfs(os.tmpdir());
      const freeBytes = stats.bavail * stats.bsize;
      return freeBytes >= requiredBytes;
    }
  } catch {}
  return true;
}

export async function getFootageWithFallback(keywords) {
  await checkDiskSpace();

  try {
    // 1. Check Pexels Rate Limiter (200 requests/hr)
    await pexelsRateLimiter.checkLimit();

    const apiKey = process.env.PEXELS_API_KEY || '';
    const query = Array.isArray(keywords) ? keywords.slice(0, 4).join(' ') : (keywords || 'technology coding');
    const downloadedClips = [];
    const downloadedIds = new Set();

    if (apiKey && !apiKey.includes('your_pexels_key')) {
      let page = 1;
      while (downloadedClips.length < REQUIRED_CLIPS && page <= MAX_PAGES) {
        try {
          const response = await axios.get('https://api.pexels.com/videos/search', {
            params: {
              query,
              per_page: 25,
              page,
              orientation: 'landscape'
            },
            headers: { Authorization: apiKey },
            timeout: 20000
          });

          const videos = response.data?.videos || [];
          if (videos.length === 0) break;

          for (const video of videos) {
            if (downloadedIds.has(video.id)) continue;
            const duration = video.duration || video.video_files?.[0]?.duration || 10;
            if (duration < MIN_DURATION) continue;

            const videoFile = video.video_files?.find(f => f.width === 1280 || (f.width >= 1280 && f.width <= 1920)) || video.video_files?.[0];
            if (!videoFile || !videoFile.link) continue;

            downloadedIds.add(video.id);
            const clipPath = path.join(os.tmpdir(), `footage_${Date.now()}_${video.id}.mp4`);

            const videoResponse = await axios.get(videoFile.link, {
              responseType: 'arraybuffer',
              timeout: 30000
            });

            if (videoResponse.data && videoResponse.data.byteLength > 50000) {
              await fs.promises.writeFile(clipPath, Buffer.from(videoResponse.data));
              downloadedClips.push({
                id: video.id,
                path: clipPath,
                duration
              });
            }

            if (downloadedClips.length >= REQUIRED_CLIPS) break;
          }

          page++;
        } catch (pageErr) {
          console.warn(`[Footage Sourcer] Pexels page ${page} notice:`, pageErr.message);
          break;
        }
      }
    }

    if (downloadedClips.length >= 2) {
      return downloadedClips;
    }
  } catch (error) {
    console.warn('[Footage Sourcer] Pexels rate limit or API notice, using high-motion fallback footage:', error.message);
  }

  // Fallback footage engine
  console.log('[Footage Sourcer] Loading verified high-motion stock footage clips...');
  return await pexelsClient.searchAndDownloadVideos(keywords, REQUIRED_CLIPS);
}

// Backward-compatible export
export const getStockFootage = getFootageWithFallback;
export const getFootage = getFootageWithFallback;
