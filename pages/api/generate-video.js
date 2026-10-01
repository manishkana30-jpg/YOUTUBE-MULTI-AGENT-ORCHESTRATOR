import { OrchestrationEngine } from '../../lib/orchestration-engine.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, niche, uploadToYouTube, channelId } = req.body || {};
  const targetTopic = topic || 'Learn Python in 10 Minutes';

  try {
    console.log('🚀 Starting video generation:', targetTopic);

    const orchestrator = new OrchestrationEngine();
    const result = await orchestrator.generateFullVideo({
      topic: targetTopic,
      niche: niche || 'Programming',
      uploadToYouTube: uploadToYouTube !== false,
      channelId
    });

    return res.status(200).json({
      status: 'success',
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
