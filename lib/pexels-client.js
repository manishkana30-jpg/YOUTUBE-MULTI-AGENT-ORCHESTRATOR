import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import { costTracker } from './cost-tracker.js';

const execAsync = promisify(exec);

// Rate limit tracking: 200 requests/hour limit for Pexels API
export const pexelsRateLimiter = {
  requestsPerHour: 0,
  resetTime: Date.now(),
  LIMIT_PER_HOUR: 200,

  async checkLimit() {
    const now = Date.now();
    if (now - this.resetTime > 60 * 60 * 1000) {
      this.requestsPerHour = 0;
      this.resetTime = now;
    }

    if (this.requestsPerHour >= this.LIMIT_PER_HOUR) {
      throw new Error(`Pexels rate limit exceeded (${this.requestsPerHour}/${this.LIMIT_PER_HOUR} req/hr)`);
    }

    this.requestsPerHour++;
    costTracker.trackPexelsRequest();
    return true;
  }
};

// API key validation
export const validatePexelsKey = async (apiKey) => {
  const key = apiKey || process.env.PEXELS_API_KEY;
  if (!key || key.includes('your_pexels_key')) return false;
  try {
    const response = await axios.get(
      'https://api.pexels.com/v1/collections',
      {
        headers: { Authorization: key },
        params: { per_page: 1 },
        timeout: 6000
      }
    );
    return response.status === 200;
  } catch (error) {
    console.warn('[Pexels Client] Key validation notice:', error.message);
    return false;
  }
};

export class PexelsClient {
  constructor() {
    this.apiKey = process.env.PEXELS_API_KEY || '';
  }

  async searchAndDownloadVideos(keywords, maxClips = 5) {
    const query = Array.isArray(keywords) ? keywords.slice(0, 4).join(' ') : (keywords || 'technology coding');
    const clips = [];

    // 1. Attempt Pexels API with rate limit check
    if (this.apiKey && !this.apiKey.includes('your_pexels_key')) {
      try {
        await pexelsRateLimiter.checkLimit();

        const response = await axios.get('https://api.pexels.com/videos/search', {
          params: { query, per_page: 8, orientation: 'landscape' },
          headers: { Authorization: this.apiKey },
          timeout: 20000
        });

        const videos = response.data?.videos || [];
        for (const v of videos) {
          const file = v.video_files?.find(f => f.width === 1280 || (f.width >= 1280 && f.width <= 1920)) || v.video_files?.[0];
          if (!file || !file.link) continue;

          const filename = path.join(os.tmpdir(), `footage_${Date.now()}_${v.id}.mp4`);
          const download = await axios.get(file.link, { responseType: 'arraybuffer', timeout: 30000 });
          fs.writeFileSync(filename, Buffer.from(download.data));

          if (fs.existsSync(filename) && fs.statSync(filename).size > 10000) {
            clips.push({
              id: v.id,
              path: filename,
              duration: file.duration || 10
            });
          }

          if (clips.length >= maxClips) break;
        }

        if (clips.length >= 2) return clips;
      } catch (err) {
        console.warn('[Pexels Client] API notice:', err.message);
      }
    }

    // 2. High-motion B-roll fallback (zero slideshows)
    const fallbackSource = path.resolve(process.cwd(), 'assets', 'fallback.mp4');
    if (fs.existsSync(fallbackSource)) {
      for (let i = 0; i < 4; i++) {
        const clipPath = path.join(os.tmpdir(), `footage_broll_${Date.now()}_${i + 1}.mp4`);
        const startSec = i * 10;
        try {
          await execAsync(`ffmpeg -y -ss ${startSec} -t 10 -i "${fallbackSource.replace(/\\/g, '/')}" -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,fps=24" -c:v libx264 -an "${clipPath.replace(/\\/g, '/')}"`);
          if (fs.existsSync(clipPath)) {
            clips.push({ id: `broll_${i + 1}`, path: clipPath, duration: 10 });
          }
        } catch {}
      }
    }

    // Safety generate dynamic test clip if needed
    if (clips.length === 0) {
      const clipPath = path.join(os.tmpdir(), `footage_gen_${Date.now()}.mp4`);
      try {
        await execAsync(`ffmpeg -y -f lavfi -i "testsrc2=size=1280x720:rate=24:duration=10" -c:v libx264 -an "${clipPath.replace(/\\/g, '/')}"`);
        if (fs.existsSync(clipPath)) clips.push({ id: 'gen_1', path: clipPath, duration: 10 });
      } catch {}
    }

    return clips;
  }
}

export const pexelsClient = new PexelsClient();
