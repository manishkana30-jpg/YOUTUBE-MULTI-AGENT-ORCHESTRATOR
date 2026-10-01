import { generateScript } from '../pages/api/agents/script-generator.js';
import { generateVoiceover } from '../pages/api/agents/voiceover-generator.js';
import { getStockFootage } from '../pages/api/agents/footage-sourcer.js';
import { editVideo } from '../pages/api/agents/video-editor.js';
import { uploadToYouTube } from '../pages/api/agents/youtube-uploader.js';
import { ffmpegHandler } from './ffmpeg-handler.js';

export class OrchestrationEngine {
  async generateFullVideo({ topic, niche, uploadToYouTube: shouldUpload = true, channelId }) {
    const startTime = Date.now();
    console.log(`[OrchestrationEngine] 🚀 Triggered for topic: "${topic}" (Niche: ${niche || 'General'})`);

    // 1. SCRIPT GENERATION
    console.log('[OrchestrationEngine] 📝 Agent 1: Generating script with Gemini...');
    const script = await generateScript(topic);

    // 2. VOICEOVER GENERATION
    console.log('[OrchestrationEngine] 🎙️ Agent 2: Creating natural voiceover...');
    const scriptText = script.script.map(s => s.text).join(' ');
    const voiceoverPath = await generateVoiceover(scriptText);

    // 3. FOOTAGE SOURCING
    console.log('[OrchestrationEngine] 🎬 Agent 3: Sourcing stock footage...');
    const keywords = (script.tags || []).slice(0, 5);
    const footageClips = await getStockFootage(keywords);
    const footagePaths = footageClips.map(f => f.path);

    // 4. VIDEO EDITING
    console.log('[OrchestrationEngine] ✂️ Agent 4: Editing video with FFmpeg...');
    const videoPath = await editVideo(voiceoverPath, footagePaths);
    const duration = await ffmpegHandler.getDuration(videoPath);

    // 5. YOUTUBE UPLOADING
    let youtubeUrl = null;
    if (shouldUpload) {
      console.log('[OrchestrationEngine] 📤 Agent 5: Uploading to YouTube...');
      youtubeUrl = await uploadToYouTube(videoPath, {
        title: script.title,
        description: script.description,
        tags: script.tags,
        categoryId: '27'
      });
    }

    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[OrchestrationEngine] ✅ Video complete in ${timeTaken}s:`, youtubeUrl);

    return {
      status: 'success',
      script,
      voiceoverPath,
      videoPath,
      duration,
      youtubeUrl,
      timeTaken: parseFloat(timeTaken),
      views: 0
    };
  }
}
