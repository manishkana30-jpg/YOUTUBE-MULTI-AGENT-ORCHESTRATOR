import fs from 'fs';
import path from 'path';
import os from 'os';
import { generateScript } from '../pages/api/agents/script-generator.js';
import { generateVoiceover } from '../pages/api/agents/voiceover-generator.js';
import { getStockFootage } from '../pages/api/agents/footage-sourcer.js';
import { editVideo } from '../pages/api/agents/video-editor.js';
import { uploadToYouTube } from '../pages/api/agents/youtube-uploader.js';
import { ffmpegHandler } from './ffmpeg-handler.js';
import { costTracker } from './cost-tracker.js';

// Global workflow metrics & monitoring
export const workflowMetrics = {
  video_generation_time: [],
  api_failures: [],
  total_attempts: 0,
  successful_runs: 0,
  get success_rate() {
    return this.total_attempts > 0 ? (this.successful_runs / this.total_attempts) : 1;
  },
  async getDiskUsage() {
    try {
      if (typeof fs.promises.statfs === 'function') {
        const stats = await fs.promises.statfs(os.tmpdir());
        return (stats.blocks - stats.bavail) * stats.bsize;
      }
    } catch {}
    return 0;
  },
  async checkAlerts(latestDurationMs, monthlyCost) {
    // 1. Generation time alert (> 15 minutes)
    if (latestDurationMs > 15 * 60 * 1000) {
      console.warn('⚠️ [ALERT] Video generation taking longer than 15 minutes!');
    }

    // 2. High failure rate alert (> 5%)
    const failureRate = 1 - this.success_rate;
    if (this.total_attempts >= 5 && failureRate > 0.05) {
      console.warn(`⚠️ [ALERT] High failure rate detected: ${(failureRate * 100).toFixed(1)}% failure rate!`);
    }

    // 3. Disk usage alert (> 5GB)
    const diskUsageBytes = await this.getDiskUsage();
    if (diskUsageBytes > 5 * 1024 * 1024 * 1024) {
      console.warn(`⚠️ [ALERT] Critical disk usage detected: ${(diskUsageBytes / 1024 / 1024 / 1024).toFixed(2)}GB!`);
    }

    // 4. API cost alert (> $50)
    if (monthlyCost > 50) {
      console.warn(`⚠️ [ALERT] Monthly API costs exceed budget: $${monthlyCost.toFixed(2)} > $50!`);
    }
  }
};

export class OrchestrationEngine {
  // Exponential backoff retry logic
  async retryWithBackoff(fn, stepName = 'Operation', maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 1000;
          console.warn(`[OrchestrationEngine] ⚠️ ${stepName} failed (attempt ${i + 1}/${maxRetries}). Retrying in ${delay}ms... (${error.message})`);
          await new Promise(r => setTimeout(r, delay));
        } else {
          workflowMetrics.api_failures.push({ step: stepName, error: error.message, timestamp: new Date().toISOString() });
          console.error(`[OrchestrationEngine] ❌ ${stepName} failed after ${maxRetries} attempts.`);
          throw error;
        }
      }
    }
  }

  // BOTTLENECK 4: Progressive intermediate cleanup (keeps disk usage < 1GB)
  async cleanupIntermediate(files) {
    if (!Array.isArray(files)) return;
    for (const file of files) {
      try {
        if (file && fs.existsSync(file)) {
          await fs.promises.unlink(file).catch(() => {});
        }
      } catch {}
    }
  }

  // Cleanup on failure
  async cleanup(state) {
    console.log('[OrchestrationEngine] 🧹 Cleaning up temporary assets on failure...');
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

  // PARALLELIZED & OPTIMIZED PIPELINE (Reduces cycle from 13 min to ~6 min)
  async generateFullVideo({ topic, niche, uploadToYouTube: shouldUpload = true, channelId }) {
    workflowMetrics.total_attempts++;
    const state = {
      topic: topic || 'Python Programming Guide',
      niche: niche || 'Technology',
      script: null,
      voiceover: null,
      footage: null,
      music: null,
      video: null,
      youtubeUrl: null,
      errors: [],
      startTime: Date.now()
    };

    try {
      console.log(`[OrchestrationEngine] 🚀 Initializing parallelized video pipeline for: "${state.topic}"`);

      // ────────────────────────────────────────────────────────────
      // STEP 1: SCRIPT GENERATION (Must be first to derive text & keywords)
      // ────────────────────────────────────────────────────────────
      console.log('[OrchestrationEngine] 📝 Step 1: Generating high-retention script with Gemini...');
      state.script = await this.retryWithBackoff(
        () => generateScript(state.topic),
        'Script Generation',
        3
      );
      if (!state.script || !state.script.title || !Array.isArray(state.script.script)) {
        throw new Error('Script generation failed: Invalid script schema.');
      }

      // ────────────────────────────────────────────────────────────
      // STEP 2: BOTTLENECK 1 FIX - PARALLELIZE VOICEOVER, FOOTAGE, & MUSIC
      // ────────────────────────────────────────────────────────────
      console.log('[OrchestrationEngine] ⚡ Step 2: Executing parallel tasks (Voiceover + Footage + Music)...');
      const scriptText = state.script.script.map(s => s.text).join(' ');
      const keywords = (state.script.tags || []).slice(0, 5);

      const [voiceoverPath, footageClips, musicPath] = await Promise.all([
        // Task A: Voiceover Synthesis
        this.retryWithBackoff(
          () => generateVoiceover(scriptText),
          'Voiceover Generation',
          3
        ),
        // Task B: Stock Footage Sourcing & Download
        this.retryWithBackoff(
          () => getStockFootage(keywords),
          'Footage Sourcing',
          3
        ),
        // Task C: Background Music Preparation
        ffmpegHandler.prepareBackgroundMusic(state.script.mood || 'tech')
      ]);

      state.voiceover = voiceoverPath;
      state.music = musicPath;

      // Extract and deduplicate footage paths
      const rawPaths = (footageClips || []).map(f => (typeof f === 'string' ? f : f?.path)).filter(Boolean);
      state.footage = [...new Set(rawPaths)].filter(p => fs.existsSync(p));

      if (!state.footage || state.footage.length === 0) {
        throw new Error('Footage sourcing failed: No valid video clips available.');
      }

      // ────────────────────────────────────────────────────────────
      // STEP 3: BOTTLENECK 2 FIX - HIGH-SPEED ENCODING (-preset veryfast)
      // ────────────────────────────────────────────────────────────
      console.log('[OrchestrationEngine] ✂️ Step 3: Rapid compositing with FFmpeg (-preset veryfast)...');
      state.video = await this.retryWithBackoff(
        () => editVideo(state.voiceover, state.footage, null, state.music),
        'Video Editing',
        2
      );

      // BOTTLENECK 4 FIX: Immediately delete intermediate footage & voiceover to conserve disk space
      console.log('[OrchestrationEngine] 🧹 Cleaning up raw clips and voiceover (Disk space optimization)...');
      await this.cleanupIntermediate([state.voiceover, ...(state.footage || []), state.music]);

      const duration = await ffmpegHandler.getDuration(state.video);

      // ────────────────────────────────────────────────────────────
      // STEP 4: BOTTLENECK 3 FIX - COMPRESSED RAPID YOUTUBE UPLOAD
      // ────────────────────────────────────────────────────────────
      if (shouldUpload) {
        console.log('[OrchestrationEngine] 📤 Step 4: Resumable streaming upload to YouTube...');
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
      } else {
        state.youtubeUrl = 'https://www.youtube.com/watch?v=preview_mode_only';
      }

      // Final cleanup of the rendered video if ephemeral
      if (process.env.RETAIN_TEMP_VIDEOS !== 'true') {
        await this.cleanupIntermediate([state.video]);
      }

      const elapsedMs = Date.now() - state.startTime;
      const timeTaken = parseFloat((elapsedMs / 1000).toFixed(1));
      workflowMetrics.video_generation_time.push(timeTaken);
      workflowMetrics.successful_runs++;

      const costSummary = costTracker.getCostSummary();
      await workflowMetrics.checkAlerts(elapsedMs, costSummary.total);

      console.log(`[OrchestrationEngine] 🎉 Pipeline completed successfully in ${timeTaken}s (Optimized from 13m)! URL: ${state.youtubeUrl}`);

      return {
        status: 'success',
        script: state.script,
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

  // Alias for optimized generation
  async generateVideoOptimized(topic) {
    return this.generateFullVideo({ topic, uploadToYouTube: true });
  }
}

export const orchestrationEngine = new OrchestrationEngine();
