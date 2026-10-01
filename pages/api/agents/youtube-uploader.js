import fs from 'fs';
import { google } from 'googleapis';
import {
  youtubeClient,
  youtubeAuthRefresh,
  uploadWithResume,
  checkYoutubeQuota
} from '../../../lib/youtube-client.js';

// Metadata validation
export function validateMetadata(rawMetadata = {}) {
  let title = rawMetadata.title ? String(rawMetadata.title).trim() : 'Automated Tutorial';
  if (!title || title.length === 0) {
    throw new Error('Title is required for YouTube upload');
  }
  if (title.length > 100) {
    title = title.substring(0, 97) + '...';
  }

  let description = rawMetadata.description ? String(rawMetadata.description) : 'Created with YouTube Multi-Agent Orchestrator';
  if (description.length > 5000) {
    description = description.substring(0, 5000);
  }

  let tags = Array.isArray(rawMetadata.tags) ? rawMetadata.tags : ['tutorial', 'coding', 'tech'];
  if (tags.length > 50) {
    tags = tags.slice(0, 50);
  }

  return {
    title,
    description,
    tags,
    categoryId: rawMetadata.categoryId || '27',
    privacyStatus: rawMetadata.privacyStatus || process.env.YOUTUBE_PRIVACY_STATUS || 'public'
  };
}

// Duplicate check
async function isDuplicateUpload(youtube, title) {
  try {
    const searchRes = await youtube.search.list({
      part: ['snippet'],
      q: title,
      maxResults: 3,
      type: ['video'],
      forMine: true
    });
    const items = searchRes.data?.items || [];
    return items.some(item => item.snippet?.title?.toLowerCase() === title.toLowerCase());
  } catch {
    return false;
  }
}

export async function uploadToYouTube(videoPath, metadata = {}) {
  // 1. File validation
  if (!videoPath || !fs.existsSync(videoPath)) {
    throw new Error(`Video file not found for upload: ${videoPath}`);
  }

  const stats = await fs.promises.stat(videoPath);
  if (stats.size === 0) {
    throw new Error(`Video file is empty: ${videoPath}`);
  }

  // 2. Validate metadata
  const validMeta = validateMetadata(metadata);
  const auth = youtubeClient.getAuth();

  if (auth) {
    try {
      // 3. Ensure valid OAuth2 token (refreshes if expiring within 5 minutes)
      await youtubeAuthRefresh.ensureValidToken(auth);
      const youtube = google.youtube({ version: 'v3', auth });
      await checkYoutubeQuota(youtube);

      // 4. Duplicate check
      const isDup = await isDuplicateUpload(youtube, validMeta.title);
      if (isDup) {
        console.warn(`[YouTube Uploader] Duplicate video detected with title "${validMeta.title}". Appending timestamp.`);
        validMeta.title = `${validMeta.title} (${new Date().toLocaleDateString()})`.substring(0, 100);
      }

      console.log(`[YouTube Uploader] Uploading "${validMeta.title}" (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);

      // 5. Resumable upload with progress reporting
      const videoId = await uploadWithResume(youtube, videoPath, validMeta);
      if (videoId) {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(`[YouTube Uploader] ✅ Upload successful! Video URL: ${videoUrl}`);
        return videoUrl;
      }
    } catch (err) {
      if (err.message && err.message.includes('quotaExceeded')) {
        console.error('[YouTube Uploader] ❌ YouTube API quota exceeded for today.');
      } else {
        console.warn('[YouTube Uploader] Live upload notice:', err.message);
      }
    }
  }

  // Graceful fallback to client upload method
  return await youtubeClient.uploadVideo(videoPath, validMeta);
}
