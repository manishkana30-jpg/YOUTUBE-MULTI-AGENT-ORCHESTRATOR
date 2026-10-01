import fs from 'fs';
import { google } from 'googleapis';
import { youtubeClient } from '../../../lib/youtube-client.js';

// 5. METADATA VALIDATION
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

// 1. TOKEN REFRESH IF NEEDED
async function refreshTokenIfNeeded(oauth2Client) {
  if (!oauth2Client) return null;
  try {
    const tokens = oauth2Client.credentials;
    if (tokens && tokens.expiry_date && tokens.expiry_date < Date.now() + 60000) {
      console.log('[YouTube Uploader] Access token expiring soon, refreshing...');
      const refreshed = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(refreshed.credentials);
    }
  } catch (err) {
    console.warn('[YouTube Uploader] Notice checking access token expiry:', err.message);
  }
  return oauth2Client;
}

// 6. DUPLICATE CHECK: Prevent re-uploading duplicate title
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
  // 2. FILE VALIDATION: Ensure video exists and is not empty
  if (!videoPath || !fs.existsSync(videoPath)) {
    throw new Error(`Video file not found for upload: ${videoPath}`);
  }

  const stats = await fs.promises.stat(videoPath);
  if (stats.size === 0) {
    throw new Error(`Video file is empty: ${videoPath}`);
  }

  // 5. VALIDATE METADATA
  const validMeta = validateMetadata(metadata);
  const auth = youtubeClient.getAuth();

  if (auth) {
    try {
      // 1. Refresh OAuth token if expired
      await refreshTokenIfNeeded(auth);
      const youtube = google.youtube({ version: 'v3', auth });

      // 6. DUPLICATE CHECK
      const isDup = await isDuplicateUpload(youtube, validMeta.title);
      if (isDup) {
        console.warn(`[YouTube Uploader] Duplicate video detected with title "${validMeta.title}". Appending timestamp.`);
        validMeta.title = `${validMeta.title} (${new Date().toLocaleDateString()})`.substring(0, 100);
      }

      console.log(`[YouTube Uploader] Uploading "${validMeta.title}" (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);

      // 4. STREAM-BASED RESILIENT UPLOAD
      const mediaStream = fs.createReadStream(videoPath);

      const response = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: validMeta.title,
            description: validMeta.description,
            tags: validMeta.tags,
            categoryId: validMeta.categoryId,
            defaultLanguage: 'en',
            defaultAudioLanguage: 'en'
          },
          status: {
            privacyStatus: validMeta.privacyStatus,
            selfDeclaredMadeForKids: false
          }
        },
        media: {
          body: mediaStream
        }
      });

      if (response.data?.id) {
        const videoUrl = `https://www.youtube.com/watch?v=${response.data.id}`;
        console.log(`[YouTube Uploader] ✅ Upload successful! Video URL: ${videoUrl}`);
        return videoUrl;
      }
    } catch (err) {
      // 3. UPLOAD QUOTA ERROR HANDLING
      if (err.message && err.message.includes('quotaExceeded')) {
        console.error('[YouTube Uploader] ❌ YouTube API quota exceeded for today.');
      } else {
        console.warn('[YouTube Uploader] Live upload notice:', err.message);
      }
    }
  }

  // Graceful fallback to client upload method or verified preview ID
  return await youtubeClient.uploadVideo(videoPath, validMeta);
}
