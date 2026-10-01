import rateLimit from 'express-rate-limit';
import { sanitize, authenticateRequest } from '../../lib/sanitizer.js';
import { OrchestrationEngine } from '../../lib/orchestration-engine.js';

// 3. RATE LIMITING: 5 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Rate limit exceeded. Try again in 1 minute.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Security headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  // 1. Rate Limiting Check
  try {
    if (typeof limiter === 'function') {
      await runMiddleware(req, res, limiter);
    }
  } catch (rateErr) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  // 2. Authentication Check
  let isAuthorized = false;
  await runMiddleware(req, res, (rq, rs, next) => {
    isAuthorized = authenticateRequest(rq, rs, next);
  });
  if (!isAuthorized && process.env.API_SECRET_KEY) {
    return; // Already responded with 401
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, niche, uploadToYouTube, channelId } = req.body || {};

  // 3. Input Validation & Prompt Injection Defense
  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'Invalid topic' });
  }

  const sanitizedTopic = sanitize(topic);
  if (sanitizedTopic.length === 0) {
    return res.status(400).json({ error: 'Topic cannot be empty' });
  }

  const sanitizedNiche = sanitize(niche || 'Technology');

  try {
    const orchestrator = new OrchestrationEngine();
    const result = await orchestrator.generateFullVideo({
      topic: sanitizedTopic,
      niche: sanitizedNiche,
      uploadToYouTube: uploadToYouTube !== false,
      channelId
    });

    return res.status(200).json({
      status: 'success',
      videoUrl: result.youtubeUrl,
      title: result.script?.title || sanitizedTopic,
      duration: result.duration,
      generationTime: result.timeTaken
    });

  } catch (error) {
    // 5. Generic error response (prevents internal stack leaks)
    console.error('[Secure Generator] Internal execution error:', error.message);

    return res.status(500).json({
      error: 'Video generation failed'
    });
  }
}
