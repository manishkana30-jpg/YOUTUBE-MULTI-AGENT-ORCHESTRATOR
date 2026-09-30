import { db } from './client.js';

async function seedData() {
  console.log('[Seed] Seeding sample channel and topic briefs...');

  const channels = await db.fetchActiveChannels();
  if (channels.length === 0) {
    console.log('[Seed] Inserting primary channel...');
    // Seed default channel
  }

  const primaryChannelId = channels[0]?.id || 'c001-ai-engineering';

  const sampleBriefs = [
    'How to build self-healing multi-agent workflows with Google Gemini 2.5 and Node.js',
    'Model Context Protocol (MCP) explained for developers in 10 minutes',
    'Automating YouTube content production end-to-end with open source AI agents'
  ];

  for (const brief of sampleBriefs) {
    const item = await db.createBrief(primaryChannelId, brief);
    console.log(`[Seed] Created Brief: "${item.topic_brief}" (ID: ${item.id})`);
  }

  console.log('[Seed] Seeding complete!');
}

seedData().catch((err) => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
