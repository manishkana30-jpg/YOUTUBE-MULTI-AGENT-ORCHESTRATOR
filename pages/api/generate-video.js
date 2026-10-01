import { OrchestrationEngine } from '../../lib/orchestration-engine.js';

const TRENDING_TOPICS = [
  'Learn Python in 10 Minutes (Complete Beginner Guide)',
  'Modern JavaScript Async Mastery: Event Loop & Promises',
  'Building Autonomous Multi-Agent AI Swarms with MCP',
  'Full Stack Web Development in 2026: Roadmap & Architecture',
  'FastAPI vs Next.js: High Performance Backend Showdown',
  'Mastering Docker Containers & Microservices in 10 Minutes'
];

export function getRandomTrendingTopic() {
  return TRENDING_TOPICS[Math.floor(Math.random() * TRENDING_TOPICS.length)];
}

export default async function handler(req, res) {
  // Support both GET (Vercel Cron triggers) and POST (Dashboard & Webhook triggers)
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, niche, uploadToYouTube, channelId } = req.body || {};
  const queryTopic = req.query?.topic;
  const targetTopic = topic || queryTopic || getRandomTrendingTopic();

  try {
    const isCron = req.method === 'GET';
    console.log(`🚀 Starting video generation: "${targetTopic}" ${isCron ? '[Vercel Cron Trigger 9 AM UTC]' : '[User Trigger]'}`);

    const orchestrator = new OrchestrationEngine();
    const result = await orchestrator.generateFullVideo({
      topic: targetTopic,
      niche: niche || 'Programming',
      uploadToYouTube: uploadToYouTube !== false,
      channelId
    });

    return res.status(200).json({
      status: 'success',
      trigger: isCron ? 'vercel_cron' : 'manual_post',
      videoUrl: result.youtubeUrl,
      title: result.script.title,
      videoDuration: result.duration,
      generationTime: result.timeTaken,
      views: 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in video generation:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
