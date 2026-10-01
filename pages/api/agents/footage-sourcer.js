import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { pexelsClient } from '../../../lib/pexels-client.js';

// 3. MINIMUM DURATION CHECK (Skip clips < 5s)
const MIN_DURATION = 5; // seconds
const REQUIRED_CLIPS = 4;
const MAX_PAGES = 4;

// 5. DISK SPACE CHECK: Verify sufficient free space in temp directory
async function checkDiskSpace(requiredBytes = 150 * 1024 * 1024) {
  try {
    if (typeof fs.promises.statfs === 'function') {
      const stats = await fs.promises.statfs(os.tmpdir());
      const freeBytes = stats.bavail * stats.bsize;
      if (freeBytes < requiredBytes) {
        console.warn(`[Footage Sourcer] Low disk space warning: ${(freeBytes / 1024 / 1024).toFixed(1)}MB available.`);
      }
      return freeBytes >= requiredBytes;
    }
  } catch (err) {
    // Non-blocking if statfs is unavailable on older platform
  }
  return true;
}

export async function getStockFootage(keywords) {
  await checkDiskSpace();

  const apiKey = process.env.PEXELS_API_KEY || '';
  const query = Array.isArray(keywords) ? keywords.slice(0, 4).join(' ') : (keywords || 'technology coding');
  const downloadedClips = [];
  // 2. PREVENT DUPLICATES: Set tracking downloaded video IDs
  const downloadedIds = new Set();

  // 1. PAGINATION HANDLING (Query up to MAX_PAGES if needed)
  if (apiKey && !apiKey.includes('your_pexels_key')) {
    let page = 1;
    while (downloadedClips.length < REQUIRED_CLIPS && page <= MAX_PAGES) {
      try {
        console.log(`[Footage Sourcer] Fetching Pexels page ${page} for query: "${query}"`);
        const response = await axios.get('https://api.pexels.com/videos/search', {
          params: {
            query,
            per_page: 25,
            page,
            orientation: 'landscape'
          },
          headers: { Authorization: apiKey },
          timeout: 20000 // 20s network timeout
        });

        const videos = response.data?.videos || [];
        if (videos.length === 0) break;

        for (const video of videos) {
          // 2. Skip duplicate video IDs
          if (downloadedIds.has(video.id)) continue;

          // 3. VIDEO DURATION CHECK
          const duration = video.duration || video.video_files?.[0]?.duration || 10;
          if (duration < MIN_DURATION) {
            continue; // Skip short clips
          }

          // Pick 720p or 1080p stream
          const videoFile = video.video_files?.find(f => f.width === 1280 || (f.width >= 1280 && f.width <= 1920)) || video.video_files?.[0];
          if (!videoFile || !videoFile.link) continue;

          downloadedIds.add(video.id);

          // 4. NETWORK TIMEOUT: 30s timeout on download stream
          const clipPath = path.join(os.tmpdir(), `footage_${Date.now()}_${video.id}.mp4`);
          const videoResponse = await axios.get(videoFile.link, {
            responseType: 'arraybuffer',
            timeout: 30000 // 30 second timeout
          });

          if (videoResponse.data && videoResponse.data.byteLength > 50000) {
            await fs.promises.writeFile(clipPath, Buffer.from(videoResponse.data));
            downloadedClips.push({
              id: video.id,
              path: clipPath,
              duration
            });
            console.log(`[Footage Sourcer] Downloaded clip #${downloadedClips.length} (ID: ${video.id}, ${duration}s)`);
          }

          if (downloadedClips.length >= REQUIRED_CLIPS) break;
        }

        page++;
      } catch (err) {
        console.warn(`[Footage Sourcer] Page ${page} request notice:`, err.message);
        break;
      }
    }
  }

  // If clips were successfully downloaded from Pexels, return them
  if (downloadedClips.length >= 2) {
    return downloadedClips;
  }

  // Fallback to high-motion procedural engine (prevents slideshow fallback)
  console.log('[Footage Sourcer] Utilizing high-motion B-roll video engine...');
  return await pexelsClient.searchAndDownloadVideos(keywords, REQUIRED_CLIPS);
}
