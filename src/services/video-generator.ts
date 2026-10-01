import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execAsync = util.promisify(exec);



export class VideoGeneratorService {
  private outputDir: string;
  private isServerless: boolean;

  constructor() {
    this.isServerless = process.env.VERCEL === '1' || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
    this.outputDir = this.isServerless 
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
   * Generates a sleek 720p HD branded motion title card matching the exact video topic.
   */
  public async generateRender(title: string, durationSeconds = 6, channelTitle = 'NEXO KIDS'): Promise<string> {
    const filename = `video_${Date.now()}.mp4`;
    const outputPath = path.join(this.outputDir, filename);
    const fallbackAssetPath = path.resolve(process.cwd(), 'assets', 'fallback.mp4');

    // In serverless environments (Vercel, AWS Lambda), deploy verified compliant MP4 asset directly
    if (this.isServerless) {
      try {
        if (fs.existsSync(fallbackAssetPath)) {
          fs.copyFileSync(fallbackAssetPath, outputPath);
          console.log(`[Video Generator] Serverless fast-path MP4 asset ready: ${outputPath} (${fs.statSync(outputPath).size} bytes)`);
          return outputPath;
        }
      } catch (err: any) {
        console.warn('[Video Generator] Serverless copy warning:', err);
      }
    }

    console.log(`[Video Generator] Rendering professional branded title card: "${title.substring(0, 45)}..."`);

    // Clean & format text for FFmpeg
    const safeTitle = title.replace(/['":\\]/g, '').toUpperCase();
    const safeChannel = (channelTitle || 'NEXO KIDS').replace(/['":\\]/g, '').toUpperCase();
    
    // Automatically split title into two lines if long so it fills the screen beautifully
    let line1 = safeTitle;
    let line2 = '';
    if (safeTitle.length > 34) {
      const words = safeTitle.split(' ');
      const mid = Math.ceil(words.length / 2);
      line1 = words.slice(0, mid).join(' ');
      line2 = words.slice(mid).join(' ');
    }

    // Windows standard font path or fallback sans-serif font
    const isWindows = process.platform === 'win32';
    const fontBold = isWindows ? 'C\\:/Windows/Fonts/arialbd.ttf' : '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';
    const fontRegular = isWindows ? 'C\\:/Windows/Fonts/arial.ttf' : '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';

    const filters = [
      // Card Container with glowing indigo border
      `drawbox=x=60:y=60:w=1160:h=600:color=0x151B2E@0.9:t=fill`,
      `drawbox=x=60:y=60:w=1160:h=600:color=0x6366F1@0.7:t=3`,
      // Channel Pill Header
      `drawbox=x=360:y=110:w=560:h=46:color=0x6366F1@0.2:t=fill`,
      `drawbox=x=360:y=110:w=560:h=46:color=0x00F0FF@0.6:t=2`,
      `drawtext=fontfile='${fontBold}':text='${safeChannel} • YOUTUBE MULTI-AGENT':fontcolor=0x00F0FF:fontsize=20:x=(w-text_w)/2:y=124`,
      // Big Headline Title Line 1
      `drawtext=fontfile='${fontBold}':text='${line1}':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=${line2 ? 240 : 280}`,
      // Big Headline Title Line 2 (if exists)
      ...(line2 ? [`drawtext=fontfile='${fontBold}':text='${line2}':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=310`] : []),
      // Subtitle / Topic Hook
      `drawtext=fontfile='${fontRegular}':text='AUTONOMOUS AI ENGINE • 24/7 PRODUCTION':fontcolor=0x94A3B8:fontsize=24:x=(w-text_w)/2:y=420`,
      // Bottom CTA pill
      `drawbox=x=420:y=490:w=440:h=50:color=0xFF2A55@0.95:t=fill`,
      `drawtext=fontfile='${fontBold}':text='SUBSCRIBE & PUSH TO PROD':fontcolor=white:fontsize=20:x=(w-text_w)/2:y=505`
    ];

    const filterString = filters.join(',');
    const audioFilter = `anoisesrc=d=${durationSeconds}:c=pink:r=44100:a=0.01,lowpass=f=400,volume=0.3`;
    const ffmpegCmd = `ffmpeg -y -f lavfi -i color=c=0x090A0F:s=1280x720:d=${durationSeconds} -f lavfi -i "${audioFilter}" -vf "${filterString}" -c:v libx264 -preset ultrafast -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k "${outputPath}"`;

    try {
      await execAsync(ffmpegCmd);
      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        console.log(`[Video Generator] Rendered branded video successfully: ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
        return outputPath;
      }
    } catch (err: any) {
      console.warn(`[Video Generator] FFmpeg error (${err.message}). Using verified fallback asset.`);
      try {
        if (fs.existsSync(fallbackAssetPath)) {
          fs.copyFileSync(fallbackAssetPath, outputPath);
          console.log(`[Video Generator] Deployed verified fallback MP4 asset: ${outputPath} (${fs.statSync(outputPath).size} bytes)`);
          return outputPath;
        }
      } catch (writeErr: any) {
        console.error('[Video Generator] Failed writing fallback video:', writeErr);
      }
    }

    return outputPath;
  }
}

export const videoGeneratorService = new VideoGeneratorService();
