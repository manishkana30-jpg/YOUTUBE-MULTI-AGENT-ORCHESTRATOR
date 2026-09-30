import dotenv from 'dotenv';
import { masterOrchestrator } from './agents/orchestrator.js';
import { db } from './db/client.js';

dotenv.config();

async function runTest() {
  console.log('========================================================================');
  console.log('  🧪 ANTIGRAVITY YOUTUBE MULTI-AGENT ORCHESTRATOR — END-TO-END TEST    ');
  console.log('========================================================================\n');

  console.log('[Test] Step 1: Checking Database & Active Channels...');
  const channels = await db.fetchActiveChannels();
  console.log(`[Test] Active Channels Found: ${channels.length}`);
  for (const c of channels) {
    console.log(`       - [${c.id}] ${c.niche} (Audience: ${c.target_audience})`);
  }

  console.log('\n[Test] Step 2: Triggering Master Orchestrator Pipeline...');
  const results = await masterOrchestrator.runDailyPipeline();

  console.log('\n========================================================================');
  console.log('  📊 END-TO-END PIPELINE EXECUTION SUMMARY                              ');
  console.log('========================================================================');
  console.log(`Total Videos Processed: ${results.length}`);

  for (const res of results) {
    console.log(`\n🎬 Video Result:`);
    console.log(`   - Final Title:       ${res.content.videoTitle}`);
    console.log(`   - Alternative Titles:${res.content.alternativeTitles.map((t) => '\n       • ' + t).join('')}`);
    console.log(`   - SEO Score:         ${res.seo.seoScore}/100 (${res.seo.tags.length} YouTube Tags)`);
    console.log(`   - Shorts Hook:       "${res.seo.shortFormStrategy.hook}"`);
    console.log(`   - Thumbnail Hook:    "${res.design.text_overlay}" (${res.design.primary_color})`);
    console.log(`   - Reaction Face:     ${res.design.reaction_face}`);
    console.log(`   - YouTube Video ID:  ${res.publication.youtubeVideoId}`);
    console.log(`   - Scheduled Window:  ${res.publication.scheduledTime}`);
    console.log(`   - Total Latency:     ${res.totalDurationMs}ms`);
  }

  const logs = await db.getRecentLogs(10);
  console.log(`\n📝 Verified Database Audit Trail: ${logs.length} agent logs recorded in Supabase / Local DB.`);
  console.log('========================================================================\n');
}

runTest().catch((err) => {
  console.error('[Test Failed]', err);
  process.exit(1);
});
