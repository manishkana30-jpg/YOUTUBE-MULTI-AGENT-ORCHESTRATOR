import { OrchestrationEngine } from '../../lib/orchestration-engine.js';
import rateLimit from 'express-rate-limit';
import { sanitize, authenticateRequest } from '../../lib/sanitizer.js';

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

// 3. RATE LIMITING: 5 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
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
  // 6. RESPONSE HEADERS: Security & caching protection
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  // Rate Limiting check
  try {
    if (typeof limiter === 'function') {
      await runMiddleware(req, res, limiter);
    }
  } catch (rateErr) {
    return res.status(429).json({
      status: 'error',
      error: 'Too many requests. Rate limit exceeded.',
      code: 'RATE_LIMIT_EXCEEDED',
      timestamp: new Date().toISOString()
    });
  }

  // 4. AUTHENTICATION: Check API_SECRET_KEY if configured
  let isAuthorized = false;
  await runMiddleware(req, res, (rq, rs, next) => {
    isAuthorized = authenticateRequest(rq, rs, next);
  });
  if (!isAuthorized && process.env.API_SECRET_KEY) {
    return; // Response already handled with 401
  }

  // Method check
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({
      status: 'error',
      error: 'Method not allowed. Use GET (cron) or POST.',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  const isCron = req.method === 'GET';
  const body = req.body || {};
  let { topic, niche, uploadToYouTube, channelId } = body;

  if (isCron && !topic && req.query?.topic) {
    topic = req.query.topic;
  }

  // 2. INPUT VALIDATION & SANITIZATION
  if (!isCron) {
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        error: 'Topic is required and cannot be empty',
        code: 'INVALID_TOPIC'
      });
    }

    if (topic.trim().length > 300) {
      return res.status(400).json({
        status: 'error',
        error: 'Topic must be less than 300 characters',
        code: 'TOPIC_TOO_LONG'
      });
    }

    if (uploadToYouTube !== undefined && typeof uploadToYouTube !== 'boolean') {
      return res.status(400).json({
        status: 'error',
        error: 'uploadToYouTube must be boolean',
        code: 'INVALID_TYPE'
      });
    }
  }

  const cleanTopic = sanitize((topic && topic.trim()) ? topic.trim() : getRandomTrendingTopic());
  const cleanNiche = sanitize(niche || 'Technology');

  // 5. DETAILED SAFE LOGGING
  const requestStartTime = new Date().toISOString();
  console.log(`[${requestStartTime}] 🚀 Starting video generation`);
  console.log(`Topic: "${cleanTopic}"`);
  console.log(`Niche: "${cleanNiche}"`);
  console.log(`Trigger: ${isCron ? 'Vercel Cron (9 AM UTC)' : 'Manual API/Dashboard'}`);
  console.log(`UploadToYouTube: ${uploadToYouTube !== false}`);

  // 1 & 4. TIMEOUT & EXECUTION HANDLING (15-Minute Timeout)
  const TIMEOUT_MS = 15 * 60 * 1000;
  let timeoutHandle;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => {
      const err = new Error('Video generation timeout exceeded (15 minutes)');
      err.code = 'GENERATION_TIMEOUT';
      reject(err);
    }, TIMEOUT_MS);
  });

  try {
    const orchestrator = new OrchestrationEngine();
    const result = await Promise.race([
      orchestrator.generateFullVideo({
        topic: cleanTopic,
        niche: cleanNiche,
        uploadToYouTube: uploadToYouTube !== false,
        channelId
      }),
      timeoutPromise
    ]);

    clearTimeout(timeoutHandle);

    console.log(`[${new Date().toISOString()}] ✅ Pipeline successfully completed for "${cleanTopic}"`);

    return res.status(200).json({
      status: 'success',
      trigger: isCron ? 'vercel_cron' : 'manual_post',
      videoUrl: result.youtubeUrl,
      title: result.script?.title || cleanTopic,
      videoDuration: result.duration || 60,
      generationTime: result.timeTaken || 15,
      views: 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    clearTimeout(timeoutHandle);
    // Log complete stack internally without leaking details to public HTTP caller
    console.error(`[${new Date().toISOString()}] ❌ Orchestration internal error:`, error);

    return res.status(500).json({
      status: 'error',
      message: 'Video generation failed. Please try again.',
      code: error.code || 'GENERATION_FAILED',
      timestamp: new Date().toISOString()
    });
  }
}
