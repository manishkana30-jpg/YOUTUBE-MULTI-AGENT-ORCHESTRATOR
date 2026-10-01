import { youtubeClient } from '../../../lib/youtube-client.js';

export async function uploadToYouTube(videoPath, metadata) {
  return await youtubeClient.uploadVideo(videoPath, metadata);
}
