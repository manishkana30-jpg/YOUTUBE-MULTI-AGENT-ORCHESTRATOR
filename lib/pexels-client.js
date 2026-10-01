import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class PexelsClient {
  constructor() {
    this.apiKey = process.env.PEXELS_API_KEY || '';
  }

  async searchAndDownloadVideos(keywords, maxClips = 5) {
    const query = Array.isArray(keywords) ? keywords.slice(0, 4).join(' ') : (keywords || 'technology coding');
    const clips = [];

    // 1. Attempt Pexels API if key is set
    if (this.apiKey && !this.apiKey.includes('your_pexels_key')) {
      try {
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
