import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execAsync = util.promisify(exec);

export class VideoGeneratorService {
  private outputDir: string;

  constructor() {
    const isServerless = process.env.VERCEL === '1' || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
    this.outputDir = isServerless 
      ? path.join(os.tmpdir(), 'renders') 
      : path.resolve(process.cwd(), 'data', 'renders');

    try {
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }
    } catch (err: any) {
      console.warn('[Video Generator] Output directory init warning:', err?.message || err);
    }
  }

  /**
   * Generates a sleek 1080p MP4 test video with visual motion and audio tone using FFmpeg.
   */
  public async generateRender(title: string, durationSeconds = 5): Promise<string> {
    const filename = `video_${Date.now()}.mp4`;
    const outputPath = path.join(this.outputDir, filename);

    console.log(`[Video Generator] Rendering video asset via FFmpeg: "${title.substring(0, 40)}..."`);

    // Clean title for safe ffmpeg text rendering
    const safeTitle = title.replace(/['":\\]/g, '').substring(0, 60);

    // FFmpeg command to generate 1080x1920 or 1920x1080 video with animated gradient background, text, and test tone
    const ffmpegCmd = `ffmpeg -y -f lavfi -i testsrc=size=1920x1080:rate=30 -f lavfi -i sine=frequency=440:sample_rate=48000 -t ${durationSeconds} -filter_complex "[0:v]drawbox=x=0:y=0:w=1920:h=1080:color=black@0.6:t=fill,drawtext=text='${safeTitle}':fontcolor=white:fontsize=52:x=(w-text_w)/2:y=(h-text_h)/2-50,drawtext=text='Antigravity Autonomous Multi-Agent Orchestrator':fontcolor=0xFF2A55:fontsize=32:x=(w-text_w)/2:y=(h-text_h)/2+60[v]" -map "[v]" -map 1:a -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 192k "${outputPath}"`;

    try {
      await execAsync(ffmpegCmd);
      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        console.log(`[Video Generator] Rendered video successfully: ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
        return outputPath;
      }
    } catch (err: any) {
      console.warn(`[Video Generator] FFmpeg render warning: ${err.message}. Generating silent fallback stream.`);
      // Minimal test stream fallback
      const fallbackCmd = `ffmpeg -y -f lavfi -i color=c=black:s=1280x720:d=${durationSeconds} -f lavfi -i anullsrc=r=44100:cl=stereo -t ${durationSeconds} -c:v libx264 -c:a aac "${outputPath}"`;
      await execAsync(fallbackCmd);
      return outputPath;
    }

    return outputPath;
  }
}

export const videoGeneratorService = new VideoGeneratorService();
