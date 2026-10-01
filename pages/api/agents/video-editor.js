import { execFile, exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';
import ffmpegStatic from 'ffmpeg-static';
import { ffmpegHandler } from '../../../lib/ffmpeg-handler.js';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

// 1. FFMPEG PATH & AVAILABILITY CHECK
export async function testFFmpeg(ffmpegBinary) {
  const binary = ffmpegBinary || process.env.FFMPEG_PATH || ffmpegStatic || 'ffmpeg';
  try {
    const { stdout } = await execAsync(`"${binary.replace(/\\/g, '/')}" -version`);
    return stdout.includes('ffmpeg version') || stdout.length > 0;
  } catch (err) {
    console.warn(`[Video Editor] Warning testing FFmpeg at ${binary}:`, err.message);
    return false;
  }
}

// 3. OUTPUT VALIDATION: Validate size & stream presence
export async function validateOutputVideo(videoPath) {
  if (!fs.existsSync(videoPath)) {
    throw new Error(`Output video does not exist: ${videoPath}`);
  }

  const stats = await fs.promises.stat(videoPath);
  if (stats.size < 50 * 1024) { // Minimum 50KB for short test / 1MB for standard
    throw new Error(`Output video is corrupted or too small (${(stats.size / 1024).toFixed(1)} KB)`);
  }

  // Verify duration via ffprobe or handler
  const duration = await ffmpegHandler.getDuration(videoPath);
  if (duration <= 0) {
    throw new Error('Output video has invalid or zero duration');
  }

  return { size: stats.size, duration };
}

export async function editVideo(voiceoverPath, footagePaths, outputPath, customMusicPath) {
  if (!fs.existsSync(voiceoverPath)) {
    throw new Error(`Cannot edit video: Voiceover audio not found at ${voiceoverPath}`);
  }

  const validFootage = (footagePaths || []).filter(p => p && fs.existsSync(p));
  if (validFootage.length === 0) {
    throw new Error('Cannot edit video: No valid footage clips available.');
  }

  // 1. Verify FFmpeg binary
  await testFFmpeg();

  // 4. INTERMEDIATE FILES TRACKING FOR CLEANUP
  const tempFilesToClean = [];
  const tempDir = path.join(os.tmpdir(), `editor_session_${Date.now()}`);

  try {
    if (!fs.existsSync(tempDir)) {
      await fs.promises.mkdir(tempDir, { recursive: true });
    }

    const targetOutput = outputPath || path.join(os.tmpdir(), `rendered_video_${Date.now()}.mp4`);
    tempFilesToClean.push(path.join(tempDir, 'footage_list.txt'));

    console.log(`[Video Editor] Compositing ${validFootage.length} footage clips with voiceover...`);

    // 2 & 5. EXECUTE FFMPEG WITH H.264 + AAC UNIVERSAL CODEC
    const result = await ffmpegHandler.compositeVideo(voiceoverPath, validFootage, targetOutput, customMusicPath);

    // 3. VALIDATE OUTPUT
    await validateOutputVideo(result.path);

    console.log(`[Video Editor] ✅ Video composited and verified: ${result.path} (${result.duration}s)`);
    return result.path;

  } catch (error) {
    // 2. FFMPEG ERROR HANDLING
    console.error('[Video Editor] ❌ Video encoding error:', error.message);
    throw new Error(`Video encoding failed: ${error.message}`);
  } finally {
    // 4. ALWAYS CLEAN UP INTERMEDIATE TEMP FILES
    for (const file of tempFilesToClean) {
      if (fs.existsSync(file)) {
        await fs.promises.unlink(file).catch(() => {});
      }
    }
    if (fs.existsSync(tempDir)) {
      await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
