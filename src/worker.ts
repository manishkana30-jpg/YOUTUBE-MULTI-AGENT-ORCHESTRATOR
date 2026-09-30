import cron from 'node-cron';
import dotenv from 'dotenv';
import { masterOrchestrator } from './agents/orchestrator.js';
import { db } from './db/client.js';

dotenv.config();

const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 9 * * *'; // 09:00 UTC daily

console.log('========================================================================');
console.log('  🤖 ANTIGRAVITY YOUTUBE MULTI-AGENT CRON WORKER                        ');
console.log('========================================================================');
console.log(`[Worker] Initialized background worker process.`);
console.log(`[Worker] Target Schedule: "${CRON_SCHEDULE}" (09:00 UTC daily)`);
console.log(`[Worker] Supabase Connection: ${db.isConnectedToSupabase() ? 'ONLINE' : 'LOCAL FALLBACK ACTIVE'}`);

let isRunning = false;

async function executeScheduledTask() {
  if (isRunning) {
    console.warn('[Worker] Previous orchestrator pipeline is still running. Skipping trigger.');
    return;
  }

  isRunning = true;
  console.log(`\n[Worker] ⏰ CRON Trigger Fired at ${new Date().toISOString()}`);

  try {
    const results = await masterOrchestrator.runDailyPipeline();
    console.log(`[Worker] Completed scheduled pipeline run. Published/Scheduled: ${results.length} item(s).`);
  } catch (err: any) {
    console.error('[Worker] Fatal error during scheduled run:', err?.message || err);
  } finally {
    isRunning = false;
  }
}

// Register the CRON task
cron.schedule(CRON_SCHEDULE, executeScheduledTask, {
  timezone: 'UTC'
});

// Check if immediate execution requested via CLI arg or env
const shouldRunImmediately = process.argv.includes('--now') || process.env.RUN_ON_BOOT === 'true';
if (shouldRunImmediately) {
  console.log('[Worker] Immediate execution requested via flag (--now). Starting pipeline...');
  executeScheduledTask().catch(console.error);
} else {
  console.log('[Worker] Worker waiting for next scheduled trigger. (Pass --now to run immediately)');
}
