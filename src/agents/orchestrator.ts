import { contentAgent, ContentAgentOutput } from './content.js';
import { seoAgent, SEOAgentOutput } from './seo.js';
import { designAgent, DesignAgentOutput } from './design.js';
import { publicationAgent, ConsolidatedPayload, PublicationResult } from './publication.js';
import { db } from '../db/client.js';
import { captureAgentError } from '../services/sentry.js';
import { ContentCalendarItem } from '../db/types.js';

export interface PipelineExecutionResult {
  calendarId: string;
  channelId: string;
  topicBrief: string;
  content: ContentAgentOutput;
  seo: SEOAgentOutput;
  design: DesignAgentOutput;
  publication: PublicationResult;
  retriesAttempted: number;
  totalDurationMs: number;
}

export class MasterOrchestrator {
  public readonly name = 'Master Orchestrator';

  public async runDailyPipeline(channelId?: string): Promise<PipelineExecutionResult[]> {
    const overallStart = Date.now();
    console.log('\n========================================================================');
    console.log('  🚀 ANTIGRAVITY MASTER ORCHESTRATOR — TRIGGERING DAILY PIPELINE       ');
    console.log('========================================================================');

    // 1. Fetch channel and briefs from Supabase
    const channels = await db.fetchActiveChannels();
    if (channels.length === 0) {
      console.warn(`[${this.name}] No active channels found in Supabase.`);
      return [];
    }

    const targetChannel = channelId
      ? channels.find((c) => c.id === channelId) || channels[0]
      : channels[0];

    console.log(`[${this.name}] Channel: "${targetChannel.niche}" (ID: ${targetChannel.id})`);

    let pendingBriefs = await db.fetchPendingBriefs(targetChannel.id);
    if (pendingBriefs.length === 0) {
      console.log(`[${this.name}] No pending briefs found. Generating an autonomous brief from channel niche...`);
      const autoBrief = `Deep-dive tutorial on cutting-edge techniques in ${targetChannel.niche} with real code and architectural benchmarks`;
      const created = await db.createBrief(targetChannel.id, autoBrief);
      pendingBriefs = [created];
    }

    const results: PipelineExecutionResult[] = [];

    for (const brief of pendingBriefs) {
      console.log(`\n------------------------------------------------------------------------`);
      console.log(`[${this.name}] Processing Brief (ID: ${brief.id}): "${brief.topic_brief}"`);
      console.log(`------------------------------------------------------------------------`);

      await db.updateBriefStatus(brief.id, 'generating');

      let attempt = 0;
      const maxRetries = 2;
      let currentTemp = 0.3;
      let success = false;
      let lastError: any = null;

      while (attempt <= maxRetries && !success) {
        try {
          attempt++;
          if (attempt > 1) {
            console.log(`[${this.name}] ⚠️ Retry Attempt #${attempt} with elevated temperature (${currentTemp})...`);
          }

          // Step 1: Content Agent
          const contentOutput = await contentAgent.execute(brief.topic_brief, currentTemp);

          // Step 2 & 3: Run SEO Agent and Design Agent in parallel to minimize latency
          console.log(`[${this.name}] Running SEO Agent & Design Agent concurrently in parallel...`);
          const [seoOutput, designOutput] = await Promise.all([
            seoAgent.execute(contentOutput, currentTemp),
            designAgent.execute(contentOutput, undefined, currentTemp)
          ]);

          // Step 4: Consolidate Payload
          const consolidated: ConsolidatedPayload = {
            contentCalendarId: brief.id,
            channelId: targetChannel.id,
            scheduledDate: brief.scheduled_date,
            content: contentOutput,
            seo: seoOutput,
            design: designOutput
          };

          // Step 5: Publication Agent
          const pubOutput = await publicationAgent.execute(consolidated);

          const durationMs = Date.now() - overallStart;

          // Log Master Orchestrator success
          await db.logAgentExecution({
            agent_name: this.name,
            execution_time: durationMs,
            payload: {
              briefId: brief.id,
              channelId: targetChannel.id,
              finalTitle: contentOutput.videoTitle,
              seoScore: seoOutput.seoScore,
              youtubeVideoId: pubOutput.youtubeVideoId,
              retriesAttempted: attempt - 1
            },
            status: attempt > 1 ? 'retry' : 'success'
          });

          results.push({
            calendarId: brief.id,
            channelId: targetChannel.id,
            topicBrief: brief.topic_brief,
            content: contentOutput,
            seo: seoOutput,
            design: designOutput,
            publication: pubOutput,
            retriesAttempted: attempt - 1,
            totalDurationMs: durationMs
          });

          success = true;
          console.log(`\n[${this.name}] ✅ Pipeline completed successfully for Brief ${brief.id}!`);
        } catch (err: any) {
          lastError = err;
          currentTemp = Math.min(0.9, currentTemp + 0.25); // elevate temperature for fallback retry
          console.error(`[${this.name}] Pipeline failed on attempt #${attempt}:`, err?.message || err);

          captureAgentError(this.name, err, {
            attempt,
            briefId: brief.id,
            fallbackTemperature: currentTemp
          });

          await db.logAgentExecution({
            agent_name: this.name,
            execution_time: Date.now() - overallStart,
            payload: {
              briefId: brief.id,
              attempt,
              nextTemperature: currentTemp
            },
            status: 'retry',
            error_message: err?.message || 'Unknown pipeline failure'
          });

          // Abort retry loop immediately on permanent unrecoverable errors like quota exhaustion or invalid auth
          const isNonRetryable = /quotaExceeded|quota|invalid_grant|uploadLimitExceeded|403|401/i.test(err?.message || '');
          if (isNonRetryable) {
            console.error(`[${this.name}] 🛑 Halting retries immediately: Non-retryable error detected (${err.message})`);
            break;
          }
        }
      }

      if (!success) {
        await db.updateBriefStatus(brief.id, 'failed');
        console.error(`[${this.name}] ❌ Pipeline permanently failed for Brief ${brief.id} after ${maxRetries + 1} attempts.`);
        captureAgentError(this.name, lastError, { fatal: true, briefId: brief.id });
      }
    }

    console.log('\n========================================================================');
    console.log(`  🎉 MASTER ORCHESTRATOR COMPLETE — Processed ${results.length} Video(s) `);
    console.log('========================================================================\n');

    return results;
  }
}

export const masterOrchestrator = new MasterOrchestrator();
