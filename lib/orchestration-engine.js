import fs from 'fs';
import path from 'path';
import { generateScript } from '../pages/api/agents/script-generator.js';
import { generateVoiceover } from '../pages/api/agents/voiceover-generator.js';
import { getStockFootage } from '../pages/api/agents/footage-sourcer.js';
import { editVideo } from '../pages/api/agents/video-editor.js';
import { uploadToYouTube } from '../pages/api/agents/youtube-uploader.js';
import { ffmpegHandler } from './ffmpeg-handler.js';
import { costTracker } from './cost-tracker.js';

export class OrchestrationEngine {
  // 3. API RETRY LOGIC: Exponential backoff helper
  async retryWithBackoff(fn, stepName = 'Operation', maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 1000; // Exponential backoff (1s, 2s, 4s...)
          console.warn(`[OrchestrationEngine] ⚠️ ${stepName} failed (attempt ${i + 1}/${maxRetries}). Retrying in ${delay}ms... Details: ${error.message}`);
          await new Promise(r => setTimeout(r, delay));
        } else {
          console.error(`[OrchestrationEngine] ❌ ${stepName} failed after ${maxRetries} attempts.`);
          throw error;
        }
      }
    }
  }

  // 2. CLEANUP ON FAILURE: Cleans up temp audio, footage, and video files
  async cleanup(state) {
    console.log('[OrchestrationEngine] 🧹 Cleaning up temporary assets...');
    try {
      if (state.voiceover && fs.existsSync(state.voiceover)) {
        await fs.promises.unlink(state.voiceover).catch(() => {});
      }
      if (state.footage && Array.isArray(state.footage)) {
        for (const file of state.footage) {
          if (file && fs.existsSync(file)) {
            await fs.promises.unlink(file).catch(() => {});
          }
        }
      }
      if (state.video && fs.existsSync(state.video)) {
        await fs.promises.unlink(state.video).catch(() => {});
      }
    } catch (cleanupErr) {
      console.error('[OrchestrationEngine] Cleanup notice:', cleanupErr.message);
    }
  }

  // 1. STATE MANAGEMENT: Comprehensive state validation & step execution
  async generateFullVideo({ topic, niche, uploadToYouTube: shouldUpload = true, channelId }) {
    const state = {
      topic: topic || 'Python Programming Guide',
      niche: niche || 'Technology',
      script: null,
      voiceover: null,
      footage: null,
      video: null,
      youtubeUrl: null,
      errors: [],
      startTime: Date.now()
    };

    try {
      console.log(`[OrchestrationEngine] 🚀 Initializing workflow pipeline for topic: "${state.topic}"`);

      // ────────────────────────────────────────────────────────────
      // STEP 1: SCRIPT GENERATION
      // ────────────────────────────────────────────────────────────
      console.log('[OrchestrationEngine] 📝 Step 1/5: Generating high-retention script...');
      state.script = await this.retryWithBackoff(
        () => generateScript(state.topic),
        'Script Generation',
        3
      );
      if (!state.script || !state.script.title || !Array.isArray(state.script.script)) {
        throw new Error('Script generation failed: Invalid or missing script structure.');
      }

      // ────────────────────────────────────────────────────────────
      // STEP 2: VOICEOVER GENERATION
      // ────────────────────────────────────────────────────────────
      console.log('[OrchestrationEngine] 🎙️ Step 2/5: Synthesizing natural human voiceover...');
      const scriptText = state.script.script.map(s => s.text).join(' ');
      state.voiceover = await this.retryWithBackoff(
        () => generateVoiceover(scriptText),
        'Voiceover Generation',
        3
      );
      if (!state.voiceover || !fs.existsSync(state.voiceover)) {
        throw new Error('Voiceover generation failed: Output audio file not found on disk.');
      }

      // ────────────────────────────────────────────────────────────
      // STEP 3: STOCK FOOTAGE SOURCING (5. Concurrent & Deduplication)
      // ────────────────────────────────────────────────────────────
      console.log('[OrchestrationEngine] 🎬 Step 3/5: Sourcing and downloading relevant footage...');
      const keywords = (state.script.tags || []).slice(0, 5);
      const footageClips = await this.retryWithBackoff(
        () => getStockFootage(keywords),
        'Stock Footage Sourcing',
        3
      );

      // Deduplicate footage paths
      const rawPaths = (footageClips || []).map(f => (typeof f === 'string' ? f : f?.path)).filter(Boolean);
      state.footage = [...new Set(rawPaths)].filter(p => fs.existsSync(p));

      if (!state.footage || state.footage.length === 0) {
        throw new Error('Footage sourcing failed: No valid video clips downloaded.');
      }

      // ────────────────────────────────────────────────────────────
      // STEP 4: VIDEO EDITING (4. Memory Leaks - Streamed file operations)
      // ────────────────────────────────────────────────────────────
      console.log('[OrchestrationEngine] ✂️ Step 4/5: Compositing footage & audio with FFmpeg...');
      state.video = await this.retryWithBackoff(
        () => editVideo(state.voiceover, state.footage),
        'Video Editing',
        2
      );
      if (!state.video || !fs.existsSync(state.video)) {
        throw new Error('Video editing failed: Output video file not produced.');
      }

      const duration = await ffmpegHandler.getDuration(state.video);

      // ────────────────────────────────────────────────────────────
      // STEP 5: YOUTUBE UPLOADING
      // ────────────────────────────────────────────────────────────
      if (shouldUpload) {
        console.log('[OrchestrationEngine] 📤 Step 5/5: Uploading video to YouTube...');
        state.youtubeUrl = await this.retryWithBackoff(
          () => uploadToYouTube(state.video, {
            title: state.script.title,
            description: state.script.description,
            tags: state.script.tags,
            categoryId: '27',
            channelId
          }),
          'YouTube Upload',
          2
        );

        if (!state.youtubeUrl) {
          throw new Error('YouTube upload failed: No published video URL returned.');
        }
      } else {
        state.youtubeUrl = 'https://www.youtube.com/watch?v=preview_mode_only';
      }

      const timeTaken = parseFloat(((Date.now() - state.startTime) / 1000).toFixed(1));
      const costSummary = costTracker.getCostSummary();
      console.log(`[OrchestrationEngine] 🎉 Pipeline completed successfully in ${timeTaken}s! URL: ${state.youtubeUrl}`);

      return {
        status: 'success',
        script: state.script,
        voiceoverPath: state.voiceover,
        videoPath: state.video,
        duration,
        youtubeUrl: state.youtubeUrl,
        timeTaken,
        costs: costSummary.costs,
        totalCost: costSummary.total,
        views: 0
      };

    } catch (error) {
      state.errors.push(error.message);
      console.error('[OrchestrationEngine] ❌ Critical failure during video orchestration:', error);
      await this.cleanup(state);
      throw error;
    }
  }
}
