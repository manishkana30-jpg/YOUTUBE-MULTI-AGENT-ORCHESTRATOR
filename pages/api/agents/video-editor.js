import { ffmpegHandler } from '../../../lib/ffmpeg-handler.js';

export async function editVideo(voiceoverPath, footagePaths) {
  const result = await ffmpegHandler.compositeVideo(voiceoverPath, footagePaths);
  return result.path;
}
