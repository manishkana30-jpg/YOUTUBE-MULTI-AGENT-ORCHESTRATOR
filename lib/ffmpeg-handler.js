import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export class FfmpegHandler {
  constructor() {
    this.ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
  }

  async getDuration(filePath) {
    try {
      const { stdout } = await execAsync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath.replace(/\\/g, '/')}"`);
      const dur = parseFloat(stdout.trim());
      return isNaN(dur) ? 60 : dur;
    } catch {
      return 60;
    }
  }

  async compositeVideo(voiceoverPath, footagePaths, outputPath) {
    const finalPath = outputPath || path.join(os.tmpdir(), `final_video_${Date.now()}.mp4`);
    const duration = await this.getDuration(voiceoverPath);

    // Royalty-free background music
    let musicPath = path.resolve(process.cwd(), 'music', 'background_royalty_free.mp3');
    if (!fs.existsSync(musicPath)) {
      musicPath = path.join(os.tmpdir(), 'background_music.mp3');
      try {
        await execAsync(`ffmpeg -y -f lavfi -i "sine=frequency=220:duration=120" -af "volume=0.08,lowpass=f=400,afade=t=in:ss=0:d=3,afade=t=out:st=115:d=5" -c:a libmp3lame "${musicPath.replace(/\\/g, '/')}"`);
      } catch {}
    }

    // Prepare concat list
    const tempDir = path.join(os.tmpdir(), `edit_temp_${Date.now()}`);
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const listFile = path.join(tempDir, 'footage_list.txt');
    const validFootage = (footagePaths || []).filter(p => fs.existsSync(p));

    if (validFootage.length === 0) {
      throw new Error('No valid footage clips available for video editing.');
    }

    const lines = [];
    let acc = 0;
    let idx = 0;
    while (acc < duration + 5) {
      const clip = validFootage[idx % validFootage.length];
      lines.push(`file '${clip.replace(/\\/g, '/')}'`);
      acc += 10;
      idx++;
      if (idx > 50) break;
    }
    fs.writeFileSync(listFile, lines.join('\n'));

    const filterComplex = '[0:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,fps=24[v0];[1:a]volume=1.0[a_voice];[2:a]volume=0.22[a_music];[a_voice][a_music]amix=inputs=2:duration=first:dropout_transition=2[aout]';

    const cmd = `${this.ffmpegPath} -y -f concat -safe 0 -i "${listFile.replace(/\\/g, '/')}" -i "${voiceoverPath.replace(/\\/g, '/')}" -stream_loop -1 -i "${musicPath.replace(/\\/g, '/')}" -filter_complex "${filterComplex}" -map "[v0]" -map "[aout]" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 192k -pix_fmt yuv420p -shortest -t ${duration.toFixed(2)} "${finalPath.replace(/\\/g, '/')}"`;

    await execAsync(cmd);
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}

    return {
      path: finalPath,
      duration
    };
  }
}

export const ffmpegHandler = new FfmpegHandler();
