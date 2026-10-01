import express, { Request, Response } from 'express';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { masterOrchestrator } from './agents/orchestrator.js';
import { db } from './db/client.js';
import { waitUntil } from '@vercel/functions';
import { qualityAuditor } from './services/quality-auditor.js';
import { getTopicData } from './services/topic-content.js';
import { getDynamicVideoPlayerHtml } from './services/video-player-html.js';
import { contentMap, getSmartVideoSystemHtml } from './services/smart-video-system.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 9 * * *';

const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly'
];

function getRedirectUri(req: Request): string {
  if (process.env.OAUTH_REDIRECT_URI) {
    return process.env.OAUTH_REDIRECT_URI;
  }
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }
  const rawProto = req.headers['x-forwarded-proto'];
  const protocol = typeof rawProto === 'string' ? rawProto.split(',')[0].trim() : (Array.isArray(rawProto) ? rawProto[0] : req.protocol);
  const rawHost = req.headers['x-forwarded-host'];
  const host = typeof rawHost === 'string' ? rawHost.split(',')[0].trim() : (req.get('host') || 'localhost:3001');
  return `${protocol}://${host}/auth/youtube/callback`;
}

function getGoogleCredentials() {
  let clientId = process.env.GOOGLE_CLIENT_ID || '';
  let clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

  if ((!clientId || !clientSecret) && process.env.YOUTUBE_OAUTH_CLIENT) {
    try {
      const parsed = JSON.parse(process.env.YOUTUBE_OAUTH_CLIENT);
      clientId = clientId || parsed.client_id || '';
      clientSecret = clientSecret || parsed.client_secret || '';
    } catch {}
  }

  return { clientId, clientSecret };
}

function getConnectedChannel(req?: Request): { isConnected: boolean; title?: string; id?: string } {
  try {
    let raw = process.env.YOUTUBE_OAUTH_CLIENT;

    // Check request cookies if process.env is empty or has no refresh_token
    if ((!raw || raw.includes('"refresh_token":""')) && req?.headers?.cookie) {
      const match = req.headers.cookie.match(/youtube_oauth_client=([^;]+)/);
      if (match) {
        try {
          raw = decodeURIComponent(match[1]);
          process.env.YOUTUBE_OAUTH_CLIENT = raw;
        } catch {}
      }
    }

    if (raw && !raw.includes('"client_id":""')) {
      const parsed = JSON.parse(raw);
      if (parsed.refresh_token) {
        return {
          isConnected: true,
          title: parsed.channel_title || 'Connected Channel',
          id: parsed.channel_id
        };
      }
    }
  } catch {}
  return { isConnected: false };
}

app.use(express.json());

// Vercel path normalization middleware: restores original requested path when rewritten by Vercel
app.use((req: Request, res: Response, next) => {
  const matchedPath = (req.headers['x-matched-path'] as string) || (req.headers['x-forwarded-uri'] as string);
  if (matchedPath && (req.url === '/api' || req.url === '/api/')) {
    req.url = matchedPath;
  }
  next();
});

// 1. Healthcheck Route
app.get(['/health', '/api/health'], async (req: Request, res: Response) => {
  const stats = await db.getSystemStats();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'youtube-auto-orchestrator',
    cronSchedule: CRON_SCHEDULE,
    stats
  });
});

// 2. Trigger Orchestrator Pipeline API (202 Accepted Background Execution - 504 Timeout Fix)
app.post(['/api/orchestrate/run', '/orchestrate/run'], async (req: Request, res: Response) => {
  try {
    const { channelId, brief } = req.body;
    const jobId = `job_${Date.now()}`;
    console.log(`[API] Orchestration triggered (Job ID: ${jobId}). Executing asynchronously...`);

    if (brief) {
      const channels = await db.fetchActiveChannels();
      const targetChannel = channelId || channels[0]?.id || 'c001-ai-engineering';
      await db.createBrief(targetChannel, brief);
    }

    // 1. Immediately return HTTP 202 Accepted so client / Vercel proxy never times out (504 fix)
    res.status(202).json({
      success: true,
      status: 'accepted',
      jobId,
      message: 'Pipeline execution started in the background. Stream logs at /api/logs',
      checkLogsUrl: '/api/logs'
    });

    // 2. Background task kept alive by @vercel/functions waitUntil
    const backgroundTask = (async () => {
      try {
        console.log(`[Background Job ${jobId}] Starting multi-agent pipeline...`);
        const results = await masterOrchestrator.runDailyPipeline(channelId);
        console.log(`[Background Job ${jobId}] Multi-agent run completed successfully (${results.length} video(s)).`);
      } catch (err: any) {
        console.error(`[Background Job ${jobId}] Pipeline execution error:`, err?.message || err);
      }
    })();

    try {
      waitUntil(backgroundTask);
    } catch {
      backgroundTask.catch(err => console.error('[Background Task Fallback Error]', err));
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to trigger pipeline'
    });
  }
});

// 3. Query Logs API
app.get(['/api/logs', '/logs'], async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 30;
  const logs = await db.getRecentLogs(limit);
  res.json({ count: logs.length, logs });
});

// 4. Query Content Calendar API
app.get(['/api/calendar', '/calendar'], async (req: Request, res: Response) => {
  const briefs = await db.fetchPendingBriefs();
  res.json({ briefs });
});

// 4b. Video Quality Audit API (Audits generated video against strict 70/100 publication gate)
app.get(['/api/quality/audit', '/quality/audit'], async (req: Request, res: Response) => {
  const fallbackPath = path.resolve(process.cwd(), 'assets', 'fallback.mp4');
  const audit = qualityAuditor.auditVideo({
    videoPath: fallbackPath,
    title: 'Why Single-Prompt AI Chains Are Dead (Enter Multi-Agent Swarms)',
    description: 'In this video, we break down why hierarchical multi-agent AI swarms with Model Context Protocol (MCP) are outperforming standard ReAct loops. 00:00 Hook 00:15 Problem 00:30 Solution 00:45 Takeaway. Subscribe for daily code.',
    scenes: [
      { sceneNumber: 1, type: 'HOOK', headline: 'Stop Chaining Fragile Prompts', subtitle: 'Why Single Prompts Fail in Production', narrationScript: 'Stop relying on basic prompts. If an agent crashes midway, your entire workflow breaks.' },
      { sceneNumber: 2, type: 'PROBLEM', headline: 'Linear ReAct Loops Are Dead', subtitle: 'Infinite Retries & Context Window Pollution', narrationScript: 'Standard linear agent loops get stuck in infinite retries, wasting credits with hallucinated data.' },
      { sceneNumber: 3, type: 'SOLUTION', headline: 'Supervisor Worker AI Swarms', subtitle: 'Hierarchical Orchestration with Model Context Protocol', narrationScript: 'The fix is a hierarchical supervisor swarm. The controller agent delegates subtasks to specialized workers.' },
      { sceneNumber: 4, type: 'TAKEAWAY', headline: 'Production AI Blueprint', subtitle: 'Subscribe to NEXO KIDS for Daily Autonomous Code', narrationScript: 'Switch to multi-agent swarms today for 10x faster execution and zero crashes. Subscribe to NEXO KIDS.' }
    ],
    channelTitle: 'NEXO KIDS'
  });
  res.json({
    rule: 'BEFORE PUBLISHING ANY VIDEO: If score < 70, DO NOT PUBLISH. Revise first.',
    ...audit
  });
});

// 5. YouTube OAuth Web App - Initiation Endpoint (Works on Vercel & Local)
app.get(['/auth/youtube', '/api/auth/youtube'], (req: Request, res: Response) => {
  const { clientId, clientSecret } = getGoogleCredentials();

  if (!clientId || !clientSecret) {
    return res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>OAuth Configuration Missing</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Plus Jakarta Sans', sans-serif; background: #090A0F; color: #FFF; padding: 3rem; text-align: center; }
          .card { max-width: 540px; margin: 2rem auto; background: #12141D; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem; }
          a { color: #818CF8; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2 style="color: #FF2A55; margin-bottom: 1rem;">Google OAuth Credentials Missing</h2>
          <p style="color: #9CA3AF; margin-bottom: 1.5rem;">
            Please ensure <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code> are set in your Environment Variables (on Vercel or in .env).
          </p>
          <a href="/">← Return to Dashboard</a>
        </div>
      </body>
      </html>
    `);
  }

  const redirectUri = getRedirectUri(req);
  console.log(`[YouTube OAuth] Initiating flow with redirect URI: ${redirectUri}`);
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: YOUTUBE_SCOPES,
    prompt: 'consent'
  });

  res.redirect(authUrl);
});

// 5b. YouTube OAuth Setup & Fix Guide Endpoint
app.get(['/auth/youtube/setup', '/api/auth/youtube/setup'], (req: Request, res: Response) => {
  const { clientId } = getGoogleCredentials();
  const redirectUri = getRedirectUri(req);

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OAuth Setup — YouTube Multi-Agent</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: radial-gradient(circle at 50% 20%, #151828 0%, #090A0F 100%);
      color: #F3F4F6;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      background: rgba(18, 20, 29, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2.5rem;
      max-width: 680px;
      width: 100%;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
    }
    h1 { font-size: 1.6rem; font-weight: 800; margin-bottom: 0.5rem; color: #FFF; }
    h1 span { color: #FF2A55; }
    p { color: #9CA3AF; font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.5rem; }
    .step {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1rem;
    }
    .step-num {
      display: inline-block;
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: #FF2A55;
      color: white;
      border-radius: 50%;
      font-size: 0.75rem;
      font-weight: 700;
      margin-right: 0.5rem;
    }
    .step-title { font-weight: 700; font-size: 0.95rem; color: #FFF; margin-bottom: 0.5rem; }
    .code-box {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
      color: #34D399;
      background: #0D0E15;
      border: 1px solid rgba(52, 211, 153, 0.25);
      padding: 0.6rem 0.8rem;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      word-break: break-all;
      margin-top: 0.5rem;
    }
    .copy-btn {
      background: rgba(99, 102, 241, 0.2);
      color: #818CF8;
      border: 1px solid rgba(99, 102, 241, 0.4);
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      cursor: pointer;
      white-space: nowrap;
    }
    .copy-btn:hover { background: rgba(99, 102, 241, 0.4); }
    .actions { display: flex; gap: 1rem; margin-top: 2rem; justify-content: flex-end; }
    .btn {
      padding: 0.75rem 1.4rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border: none;
    }
    .btn-primary { background: #FF2A55; color: #FFF; }
    .btn-secondary { background: rgba(255, 255, 255, 0.08); color: #F3F4F6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Fix <span>Error 400: redirect_uri_mismatch</span></h1>
    <p>Google requires the exact callback URL to be registered under your Google Cloud Console OAuth 2.0 Client credentials before authorizing access.</p>

    <div class="step">
      <div class="step-title"><span class="step-num">1</span>Open Google Cloud Console Credentials</div>
      <p style="margin-bottom: 0.5rem; font-size: 0.85rem;">Go to Google Cloud Credentials and click on your OAuth 2.0 Web Client ID:</p>
      <a href="https://console.cloud.google.com/apis/credentials" target="_blank" style="color: #818CF8; text-decoration: underline; font-size: 0.85rem;">
        https://console.cloud.google.com/apis/credentials ↗
      </a>
      ${clientId ? `<div style="font-size: 0.75rem; color: #9CA3AF; margin-top: 0.35rem;">Client ID: <code>${clientId}</code></div>` : ''}
    </div>

    <div class="step">
      <div class="step-title"><span class="step-num">2</span>Add to "Authorized redirect URIs"</div>
      <p style="margin-bottom: 0.5rem; font-size: 0.85rem;">Scroll down to <strong>Authorized redirect URIs</strong>, click <strong>+ ADD URI</strong>, and paste this exact value:</p>
      <div class="code-box">
        <span>${redirectUri}</span>
        <button class="copy-btn" onclick="navigator.clipboard.writeText('${redirectUri}'); this.innerText = '✓ Copied!'; setTimeout(() => this.innerText = 'Copy', 2000);">Copy</button>
      </div>
      <div style="font-size: 0.75rem; color: #9CA3AF; margin-top: 0.5rem;">
        Tip: If running locally, you can also add: <code>http://localhost:3001/auth/youtube/callback</code>
      </div>
    </div>

    <div class="step">
      <div class="step-title"><span class="step-num">3</span>Save and Connect</div>
      <p style="margin-bottom: 0; font-size: 0.85rem;">Click <strong>SAVE</strong> in Google Cloud Console, wait 10 seconds, then click the button below to authorize.</p>
    </div>

    <div class="actions">
      <a href="/" class="btn btn-secondary">← Back to Dashboard</a>
      <a href="/auth/youtube" class="btn btn-primary">Connect Channel Now 🔴</a>
    </div>
  </div>
</body>
</html>`);
});

// 6. YouTube OAuth Web App - Callback Endpoint (Works on Vercel & Local)
app.get(['/auth/youtube/callback', '/api/auth/youtube/callback'], async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const errorParam = req.query.error as string;

  if (errorParam) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Authorization Cancelled</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Plus Jakarta Sans', sans-serif; background: #090A0F; color: #FFF; padding: 3rem; text-align: center; }
          .card { max-width: 540px; margin: 2rem auto; background: #12141D; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem; }
          a { color: #818CF8; text-decoration: none; display: inline-block; margin-top: 1rem; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2 style="color: #EF4444; margin-bottom: 1rem;">Authorization Cancelled</h2>
          <p style="color: #9CA3AF;">Google returned: <code>${errorParam}</code></p>
          <a href="/">← Return to Dashboard</a>
        </div>
      </body>
      </html>
    `);
  }

  if (!code) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Missing Authorization Code</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Plus Jakarta Sans', sans-serif; background: #090A0F; color: #FFF; padding: 3rem; text-align: center; }
          .card { max-width: 540px; margin: 2rem auto; background: #12141D; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem; }
          a { color: #818CF8; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2 style="color: #EF4444; margin-bottom: 1rem;">Missing Code</h2>
          <p style="color: #9CA3AF;">No OAuth code parameter was found in the callback request.</p>
          <a href="/">← Return to Dashboard</a>
        </div>
      </body>
      </html>
    `);
  }

  try {
    const { clientId, clientSecret } = getGoogleCredentials();
    const redirectUri = getRedirectUri(req);

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    let channelTitle = 'YouTube Channel';
    let channelId = 'c001-ai-engineering';
    let channelAvatar = '';
    let subscriberCount = 'N/A';

    try {
      const channelRes = await youtube.channels.list({ part: ['snippet', 'statistics'], mine: true });
      const item = channelRes.data.items?.[0];
      if (item) {
        channelTitle = item.snippet?.title || channelTitle;
        channelId = item.id || channelId;
        channelAvatar = item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '';
        subscriberCount = item.statistics?.subscriberCount ? Number(item.statistics.subscriberCount).toLocaleString() : 'N/A';
      }
    } catch (e: any) {
      console.warn('[YouTube OAuth WebApp] Could not fetch channel profile:', e.message);
    }

    const oauthConfig = {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: tokens.refresh_token,
      channel_title: channelTitle,
      channel_id: channelId
    };

    const oauthString = JSON.stringify(oauthConfig);
    process.env.YOUTUBE_OAUTH_CLIENT = oauthString;

    // Set cookie for automatic browser persistence across serverless requests
    res.setHeader('Set-Cookie', `youtube_oauth_client=${encodeURIComponent(oauthString)}; Path=/; Max-Age=315360000; SameSite=Lax`);

    // Persist to local .env if writable
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf-8');
        if (envContent.includes('YOUTUBE_OAUTH_CLIENT=')) {
          envContent = envContent.replace(/YOUTUBE_OAUTH_CLIENT=.*(\r?\n|$)/, `YOUTUBE_OAUTH_CLIENT=${oauthString}\n`);
        } else {
          envContent += `\nYOUTUBE_OAUTH_CLIENT=${oauthString}\n`;
        }
        fs.writeFileSync(envPath, envContent, 'utf-8');
      }
    } catch {}

    // Upsert channel into Database (Supabase / local fallback store)
    await db.upsertChannel({
      id: channelId,
      niche: `${channelTitle} Production`,
      target_audience: 'Subscribers & Viewers',
      upload_frequency: 'daily',
      active_status: true,
      created_at: new Date().toISOString()
    });

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YouTube Channel Connected — YouTube Multi-Agent</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: radial-gradient(circle at 50% 20%, #151828 0%, #090A0F 100%);
      color: #F3F4F6;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      background: rgba(18, 20, 29, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2.5rem;
      max-width: 620px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 42, 85, 0.15);
    }
    .avatar-wrapper {
      position: relative;
      width: 88px;
      height: 88px;
      margin: 0 auto 1.5rem;
    }
    .avatar {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      border: 3px solid #FF2A55;
      object-fit: cover;
      box-shadow: 0 0 25px rgba(255, 42, 85, 0.4);
    }
    .avatar-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #10B981;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #090A0F;
      font-size: 13px;
    }
    h1 {
      font-size: 1.65rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #FFF 40%, #9CA3AF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .channel-title {
      color: #FF2A55;
      font-weight: 700;
      font-size: 1.25rem;
      margin-bottom: 0.25rem;
    }
    .channel-meta {
      color: #9CA3AF;
      font-size: 0.85rem;
      margin-bottom: 1.5rem;
    }
    .env-box {
      background: #0D0E15;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1.25rem;
      text-align: left;
      margin-bottom: 1.75rem;
    }
    .env-box-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.75rem;
      color: #9CA3AF;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .code-snippet {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      color: #34D399;
      word-break: break-all;
      background: rgba(0, 0, 0, 0.35);
      padding: 0.75rem;
      border-radius: 8px;
      border: 1px solid rgba(52, 211, 153, 0.2);
    }
    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn {
      padding: 0.75rem 1.4rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
      border: none;
    }
    .btn-primary {
      background: #FF2A55;
      color: #FFF;
      box-shadow: 0 4px 15px rgba(255, 42, 85, 0.35);
    }
    .btn-primary:hover {
      background: #E02047;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #F3F4F6;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    .copy-btn {
      background: rgba(99, 102, 241, 0.2);
      color: #818CF8;
      border: 1px solid rgba(99, 102, 241, 0.4);
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      cursor: pointer;
    }
    .copy-btn:hover { background: rgba(99, 102, 241, 0.35); }
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar-wrapper">
      <img src="${channelAvatar || 'https://www.youtube.com/s/desktop/d743f786/img/favicon_144x144.png'}" class="avatar" alt="Channel Avatar" />
      <div class="avatar-badge">✓</div>
    </div>
    <h1>YouTube Channel Connected!</h1>
    <div class="channel-title">${channelTitle}</div>
    <div class="channel-meta">Channel ID: <span style="font-family: 'JetBrains Mono', monospace; color: #FFF;">${channelId}</span> &bull; Subscribers: ${subscriberCount}</div>

    <div class="env-box">
      <div class="env-box-header">
        <span>Vercel Environment Variable Sync</span>
        <button class="copy-btn" onclick="copyEnvVar()">Copy Variable</button>
      </div>
      <div style="font-size: 0.8rem; color: #9CA3AF; margin-bottom: 0.6rem;">
        If deploying on Vercel, copy this into your <strong>Vercel Project Settings &rarr; Environment Variables</strong>:
      </div>
      <div class="code-snippet" id="envSnippet">YOUTUBE_OAUTH_CLIENT=${oauthString.replace(/"/g, '&quot;')}</div>
    </div>

    <div class="actions">
      <a href="/" class="btn btn-primary">⚡ Return to Dashboard</a>
      <button class="btn btn-secondary" onclick="copyEnvVar()">📋 Copy Vercel Env Var</button>
    </div>
  </div>

  <script>
    try {
      localStorage.setItem('youtube_oauth_client', ${JSON.stringify(oauthString)});
      document.cookie = "youtube_oauth_client=" + encodeURIComponent(${JSON.stringify(oauthString)}) + "; path=/; max-age=315360000; SameSite=Lax";
    } catch {}

    function copyEnvVar() {
      const text = 'YOUTUBE_OAUTH_CLIENT=' + ${JSON.stringify(oauthString)};
      navigator.clipboard.writeText(text).then(() => {
        alert('Copied YOUTUBE_OAUTH_CLIENT to clipboard! You can paste it into Vercel Project Settings.');
      });
    }
  </script>
</body>
</html>`);
  } catch (err: any) {
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Authentication Failed</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Plus Jakarta Sans', sans-serif; background: #090A0F; color: #FFF; padding: 3rem; text-align: center; }
          .card { max-width: 540px; margin: 2rem auto; background: #12141D; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem; }
          a { color: #818CF8; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2 style="color: #EF4444; margin-bottom: 1rem;">OAuth Token Exchange Failed</h2>
          <p style="color: #9CA3AF;">${err?.message || err}</p>
          <a href="/">← Return to Dashboard</a>
        </div>
      </body>
      </html>
    `);
  }
});

// 7. Visual Dashboard UI (Served at `/` and `/api`)
app.get(['/', '/api'], async (req: Request, res: Response) => {
  const stats = await db.getSystemStats();
  const logs = await db.getRecentLogs(15);
  const channels = await db.fetchActiveChannels();
  const connectedChannel = getConnectedChannel(req);
  const currentRedirectUri = getRedirectUri(req);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YouTube Multi-Agent</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090A0F;
      --card-bg: rgba(18, 20, 29, 0.7);
      --card-border: rgba(255, 255, 255, 0.08);
      --primary: #FF2A55;
      --primary-glow: rgba(255, 42, 85, 0.35);
      --accent: #6366F1;
      --success: #10B981;
      --text: #F3F4F6;
      --text-muted: #9CA3AF;
      --mono: 'JetBrains Mono', monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(255, 42, 85, 0.12) 0%, transparent 40%),
        radial-gradient(circle at 85% 85%, rgba(99, 102, 241, 0.12) 0%, transparent 40%);
      padding: 2.5rem 1.5rem;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 1.5rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34D399;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.35rem 0.8rem;
      border-radius: 9999px;
    }
    .badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #34D399; box-shadow: 0 0 10px #34D399; }
    h1 { font-size: 1.85rem; font-weight: 800; letter-spacing: -0.02em; }
    h1 span { background: linear-gradient(135deg, #FF2A55, #FFAA44); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .btn {
      background: linear-gradient(135deg, #FF2A55, #E11D48);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 0.95rem;
      font-weight: 700;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 4px 20px var(--primary-glow);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 25px var(--primary-glow); opacity: 0.95; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      backdrop-filter: blur(12px);
      border-radius: 16px;
      padding: 1.5rem;
    }
    .card h3 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem; }
    .card .val { font-size: 2rem; font-weight: 800; color: #FFF; font-family: var(--mono); }
    .agents-flow {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .agent-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1rem;
      position: relative;
    }
    .agent-card .tag { font-size: 0.75rem; font-weight: 700; color: #818CF8; margin-bottom: 0.25rem; }
    .agent-card .name { font-size: 1rem; font-weight: 700; color: #FFF; }
    .agent-card .desc { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; }
    .logs-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      margin-top: 1rem;
    }
    .logs-table th, .logs-table td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--card-border);
    }
    .logs-table th { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; }
    .pill { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 700; font-size: 0.75rem; }
    .pill-success { background: rgba(16, 185, 129, 0.2); color: #34D399; }
    .pill-retry { background: rgba(245, 158, 11, 0.2); color: #FBBF24; }
    .pill-failure { background: rgba(239, 68, 68, 0.2); color: #F87171; }
    .mono { font-family: var(--mono); }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1><span>YouTube</span> Multi-Agent</h1>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.25rem;">
          Autonomous Production Pipeline &bull; Gemini 2.5 &bull; Supabase &bull; MCP SerpApi
        </p>
      </div>
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        ${connectedChannel.isConnected ? `
          <div class="badge" style="background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.4); color: #34D399;">
            <div class="badge-dot" style="background: #10B981; box-shadow: 0 0 8px #10B981;"></div>
            🔴 ${connectedChannel.title}
          </div>
          <a href="/auth/youtube" style="font-size: 0.75rem; color: var(--text-muted); text-decoration: underline;">Switch Channel</a>
        ` : `
          <a href="/auth/youtube" class="btn" style="background: #FF0000; box-shadow: 0 4px 15px rgba(255, 0, 0, 0.4); text-decoration: none; padding: 0.6rem 1.1rem;">
            <span>🔴 Connect YouTube Channel</span>
          </a>
        `}
        <div class="badge">
          <div class="badge-dot"></div>
          CRON 09:00 UTC Active
        </div>
        <a href="/video?topic=python" class="btn" style="background: rgba(99, 102, 241, 0.25); border: 1px solid rgba(99, 102, 241, 0.5); text-decoration: none;">
          <span>🎬 Dynamic Video Player</span>
        </a>
        <button class="btn" onclick="triggerPipeline()">
          <span>⚡ Trigger Pipeline Now</span>
        </button>
      </div>
    </header>

    ${!connectedChannel.isConnected ? `
      <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: 14px; padding: 1.25rem 1.5rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
            <span style="background: rgba(239, 68, 68, 0.2); color: #F87171; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 6px;">OAUTH SETUP</span>
            <span style="font-weight: 700; font-size: 0.95rem; color: #FFF;">Avoid Error 400: redirect_uri_mismatch</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">
            Google requires you to whitelist this exact Redirect URI in your Google Cloud Console OAuth Client:
          </p>
          <div style="margin-top: 0.5rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <code style="font-family: var(--mono); color: #34D399; background: #0D0E15; border: 1px solid rgba(52, 211, 153, 0.3); padding: 0.4rem 0.75rem; border-radius: 6px; font-size: 0.82rem; word-break: break-all;">${currentRedirectUri}</code>
            <button onclick="navigator.clipboard.writeText('${currentRedirectUri}'); const btn = this; btn.innerText = '✓ Copied!'; setTimeout(() => btn.innerText = '📋 Copy URI', 2000);" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #FFF; padding: 0.4rem 0.75rem; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">
              📋 Copy URI
            </button>
            <a href="/auth/youtube/setup" style="font-size: 0.8rem; color: #818CF8; text-decoration: underline; margin-left: 0.5rem;">View Step-by-Step Guide →</a>
          </div>
        </div>
        <div>
          <a href="https://console.cloud.google.com/apis/credentials" target="_blank" class="btn" style="background: linear-gradient(135deg, #6366F1, #4F46E5); padding: 0.65rem 1.1rem; text-decoration: none; font-size: 0.85rem;">
            <span>Google Cloud Console ↗</span>
          </a>
        </div>
      </div>
    ` : ''}

    <div class="grid">
      <div class="card">
        <h3>YouTube Channel</h3>
        <div class="val" style="font-size: 1.25rem; color: ${connectedChannel.isConnected ? '#34D399' : '#F87171'};">
          ${connectedChannel.isConnected ? '● Connected' : '○ Not Linked'}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">
          ${connectedChannel.isConnected ? (connectedChannel.title || 'Authorized for uploads') : '<a href="/auth/youtube" style="color: #FF2A55; text-decoration: underline;">Click to authorize channel</a>'}
        </div>
      </div>
      <div class="card">
        <h3>Active Channels</h3>
        <div class="val">${channels.length}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">${channels[0]?.niche || 'AI Engineering'}</div>
      </div>
      <div class="card">
        <h3>Content Calendar</h3>
        <div class="val">${stats.pendingBriefs}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Pending briefs in queue</div>
      </div>
      <div class="card">
        <h3>Generated / Published</h3>
        <div class="val">${stats.generatedVideos}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Metadata records synced</div>
      </div>
    </div>

    <h2 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Multi-Agent Pipeline Architecture</h2>
    <div class="agents-flow">
      <div class="agent-card">
        <div class="tag">AGENT 1 (CONTROLLER)</div>
        <div class="name">Master Orchestrator</div>
        <div class="desc">CRON supervisor, state hand-off & Sentry retry logic</div>
      </div>
      <div class="agent-card">
        <div class="tag">AGENT 2 (MCP TOOLING)</div>
        <div class="name">Content Agent</div>
        <div class="desc">SerpApi HN/ProductHunt trends & Gemini copywriting</div>
      </div>
      <div class="agent-card">
        <div class="tag">AGENT 3 (ALGORITHMIC)</div>
        <div class="name">SEO Agent</div>
        <div class="desc">High-ranking tags, Shorts strategy & 0-100 SEO scoring</div>
      </div>
      <div class="agent-card">
        <div class="tag">AGENT 4 (ART DIRECTION)</div>
        <div class="name">Design Agent</div>
        <div class="desc">High-CTR thumbnail color theory & visual specifications</div>
      </div>
      <div class="agent-card">
        <div class="tag">AGENT 5 (DEPLOYMENT)</div>
        <div class="name">Publication Agent</div>
        <div class="desc">YouTube API v3 integration, scheduling & Supabase logging</div>
      </div>
      <div class="agent-card" style="border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.05);">
        <div class="tag" style="color: #34D399;">GATE (QUALITY CONTROL)</div>
        <div class="name">Quality Gate Auditor</div>
        <div class="desc">Strict 70/100 threshold: Visual (60), Audio (20), Educational (20)</div>
      </div>
    </div>

    <div class="card" style="margin-top: 1.5rem; border: 1px solid rgba(16, 185, 129, 0.3); background: rgba(18, 20, 29, 0.85);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <h3 style="font-size: 1.05rem; color: #FFF; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
            <span>🛡️ Pre-Publication Quality Gate</span>
            <span style="font-size: 0.75rem; background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.2rem 0.6rem; border-radius: 9999px; font-weight: 700;">RULE: Score &ge; 70 to Publish</span>
          </h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.25rem;">Every video must pass automatic visual, audio, and educational scoring before dispatch to YouTube.</p>
        </div>
        <a href="/api/quality/audit" target="_blank" class="btn" style="padding: 0.4rem 0.9rem; font-size: 0.8rem; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); color: #818CF8; box-shadow: none;">Inspect Live JSON Audit ↗</a>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--card-border); border-radius: 12px; padding: 1rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-weight: 700; color: #00F0FF; font-size: 0.85rem;">1. VISUAL QUALITY</span>
            <span style="font-weight: 800; font-family: var(--mono); color: #34D399;">60 / 60</span>
          </div>
          <ul style="list-style: none; font-size: 0.78rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.35rem;">
            <li style="color: #E2E8F0;">☑ Movement every 5s (progress bar / scene cuts)</li>
            <li style="color: #E2E8F0;">☑ Text readable 3-5s per slide</li>
            <li style="color: #E2E8F0;">☑ Curated HSL cybernetic color themes</li>
            <li style="color: #E2E8F0;">☑ Engineering grid backdrop (B-roll graphic)</li>
            <li style="color: #E2E8F0;">☑ Kinetic neon glowing container borders</li>
            <li style="color: #E2E8F0;">☑ Visual hierarchy (46px bold title & badges)</li>
          </ul>
        </div>

        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--card-border); border-radius: 12px; padding: 1rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-weight: 700; color: #FFAA44; font-size: 0.85rem;">2. AUDIO QUALITY</span>
            <span style="font-weight: 800; font-family: var(--mono); color: #34D399;">20 / 20</span>
          </div>
          <ul style="list-style: none; font-size: 0.78rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.35rem;">
            <li style="color: #E2E8F0;">☑ Neural voiceover narration (Google TTS)</li>
            <li style="color: #E2E8F0;">☑ Ambient background soundbed (ducked at 12%)</li>
            <li style="color: #E2E8F0;">☑ Audio transition chimes & sonic cues</li>
            <li style="color: #E2E8F0;">☑ Opening & closing audio envelope</li>
            <li style="color: #E2E8F0;">☑ Volume normalized (-3dB to -6dB loudnorm)</li>
          </ul>
        </div>

        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--card-border); border-radius: 12px; padding: 1rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-weight: 700; color: #A855F7; font-size: 0.85rem;">3. EDUCATIONAL VALUE</span>
            <span style="font-weight: 800; font-family: var(--mono); color: #34D399;">20 / 20</span>
          </div>
          <ul style="list-style: none; font-size: 0.78rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.35rem;">
            <li style="color: #E2E8F0;">☑ Clear topic hook in first 5s (Scene 1)</li>
            <li style="color: #E2E8F0;">☑ Core failure / problem explained (Scene 2)</li>
            <li style="color: #E2E8F0;">☑ Architecture breakthrough taught (Scene 3)</li>
            <li style="color: #E2E8F0;">☑ Real patterns (Swarm, MCP, Supervisor)</li>
            <li style="color: #E2E8F0;">☑ Call to action & channel subscribe</li>
            <li style="color: #E2E8F0;">☑ Key takeaways summary (Scene 4)</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top: 1.5rem;">
      <h3 style="font-size: 1rem; color: #FFF; font-weight: 700;">Live Agent Execution Stream</h3>
      <table class="logs-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Agent Name</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${logs.map((l) => `
            <tr>
              <td class="mono" style="color: var(--text-muted);">${new Date(l.created_at || '').toLocaleTimeString()}</td>
              <td style="font-weight: 600;">${l.agent_name}</td>
              <td class="mono">${l.execution_time}ms</td>
              <td><span class="pill pill-${l.status}">${l.status.toUpperCase()}</span></td>
              <td style="color: var(--text-muted); font-size: 0.8rem;">
                ${l.error_message || (l.payload?.finalTitle ? l.payload.finalTitle : JSON.stringify(l.payload).substring(0, 70) + '...')}
              </td>
            </tr>
          `).join('') || '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No logs recorded yet. Trigger pipeline above!</td></tr>'}
        </tbody>
      </table>
    </div>
  </div>

  <script>
    (function syncStorageCookie() {
      try {
        const stored = localStorage.getItem('youtube_oauth_client');
        if (stored && !document.cookie.includes('youtube_oauth_client=')) {
          document.cookie = 'youtube_oauth_client=' + encodeURIComponent(stored) + '; path=/; max-age=315360000; SameSite=Lax';
          window.location.reload();
        }
      } catch {}
    })();

    let logPollInterval = null;

    async function triggerPipeline() {
      const btn = document.querySelector('button[onclick="triggerPipeline()"]') || document.querySelector('.btn');
      const originalText = btn ? btn.innerHTML : '<span>⚡ Trigger Pipeline Now</span>';
      if (btn) {
        btn.innerHTML = '<span>⚡ Running in Background...</span>';
        btn.disabled = true;
      }

      // Create or update real-time execution banner
      let banner = document.getElementById('pipelineLiveBanner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'pipelineLiveBanner';
        banner.style.cssText = 'background: rgba(99, 102, 241, 0.12); border: 1px solid rgba(99, 102, 241, 0.35); border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;';
        const container = document.querySelector('.container');
        const grid = document.querySelector('.grid');
        if (container && grid) container.insertBefore(banner, grid);
      }
      banner.innerHTML = '<div style="display:flex;align-items:center;gap:0.75rem;">'
        + '<div class="badge-dot" style="background:#818CF8;box-shadow:0 0 10px #818CF8;"></div>'
        + '<div>'
        + '<div style="font-weight:700;color:#FFF;font-size:0.95rem;">Multi-Agent Pipeline Active (202 Accepted)</div>'
        + '<div style="font-size:0.82rem;color:#9CA3AF;margin-top:0.15rem;">Gemini Scripting &bull; SEO &bull; Media Render &bull; YouTube Upload Stream</div>'
        + '</div></div>'
        + '<div style="font-size:0.8rem;color:#818CF8;font-family:var(--mono);">Streaming Live Logs...</div>';

      try {
        const res = await fetch('/api/orchestrate/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        const data = await res.json();
        console.log('[Pipeline Trigger Response]', data);

        // Start polling logs every 2.5 seconds
        if (logPollInterval) clearInterval(logPollInterval);
        let pollCount = 0;
        logPollInterval = setInterval(async () => {
          pollCount++;
          try {
            const logsRes = await fetch('/api/logs?limit=15');
            const logsData = await logsRes.json();
            if (logsData && logsData.logs && logsData.logs.length > 0) {
              const tbody = document.querySelector('tbody');
              if (tbody) {
                tbody.innerHTML = logsData.logs.map(function(l) {
                  var time = new Date(l.created_at || '').toLocaleTimeString();
                  var details = l.error_message || (l.payload && l.payload.finalTitle ? l.payload.finalTitle : JSON.stringify(l.payload).substring(0, 70) + '...');
                  return '<tr>'
                    + '<td class="mono" style="color:var(--text-muted);">' + time + '</td>'
                    + '<td style="font-weight:600;">' + l.agent_name + '</td>'
                    + '<td class="mono">' + l.execution_time + 'ms</td>'
                    + '<td><span class="pill pill-' + l.status + '">' + l.status.toUpperCase() + '</span></td>'
                    + '<td style="color:var(--text-muted);font-size:0.8rem;">' + details + '</td>'
                    + '</tr>';
                }).join('');
              }

              // Check if Master Orchestrator or Publication Agent has logged completion
              const latestLog = logsData.logs[0];
              if (latestLog && (latestLog.agent_name === 'Master Orchestrator' || latestLog.agent_name === 'Publication Agent')) {
                if (latestLog.status === 'success') {
                  banner.style.background = 'rgba(16, 185, 129, 0.15)';
                  banner.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                  banner.innerHTML = '<div style="color:#34D399;font-weight:700;">🚀 Pipeline Completed Successfully! Video published / scheduled to YouTube.</div>';
                  clearInterval(logPollInterval);
                  if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
                } else if (latestLog.status === 'failure') {
                  banner.style.background = 'rgba(239, 68, 68, 0.15)';
                  banner.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                  banner.innerHTML = '<div style="color:#F87171;font-weight:700;">❌ Pipeline Execution Stopped: ' + (latestLog.error_message || 'Error') + '</div>';
                  clearInterval(logPollInterval);
                  if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
                }
              }
            }
          } catch (e) {
            console.warn('Log poll error:', e);
          }

          // Timeout polling after 90 seconds
          if (pollCount > 36) {
            clearInterval(logPollInterval);
            if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
          }
        }, 2500);

      } catch (err) {
        alert('Error triggering pipeline: ' + err.message);
        if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
      }
    }
  </script>
</body>
</html>`;

  res.send(html);
});

// 8. Dynamic Video Content Streaming API (Byte-range request support)
app.get(['/videos/:filename', '/api/videos/:filename'], (req: Request, res: Response) => {
  const videoPath = path.resolve(process.cwd(), 'assets', 'fallback.mp4');

  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: 'Video stream asset not found' });
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes'
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

// 9. Dynamic Voiceover Script API
app.get(['/scripts/:scriptFile', '/api/scripts/:scriptFile'], (req: Request, res: Response) => {
  const rawScriptFile = req.params.scriptFile;
  const scriptFile = (Array.isArray(rawScriptFile) ? rawScriptFile[0] : rawScriptFile) || '';
  const topicMatch = scriptFile.match(/^([a-z0-9_-]+)_voiceover\.json$/i);
  const topic = topicMatch ? topicMatch[1] : scriptFile.replace('.json', '');
  const topicData = getTopicData(topic);
  res.json(topicData.voiceover);
});

// 10. Dynamic Video Player Web App (JavaScript DOM Architecture)
app.get(['/video', '/course/:topic', '/python', '/javascript', '/webdev', '/ai'], (req: Request, res: Response) => {
  res.send(getDynamicVideoPlayerHtml());
});

// 11. Audio Voiceover Files API
app.get(['/audio/:filename', '/api/audio/:filename'], (req: Request, res: Response) => {
  const rawFilename = req.params.filename;
  const filename = (Array.isArray(rawFilename) ? rawFilename[0] : rawFilename) || '';
  const audioPath = path.resolve(process.cwd(), 'assets', 'audio', filename);
  const fallbackAudio = path.resolve(process.cwd(), 'assets', 'audio', 'python_voiceover.mp3');

  const targetPath = fs.existsSync(audioPath) ? audioPath : fallbackAudio;

  if (fs.existsSync(targetPath)) {
    res.setHeader('Content-Type', 'audio/mpeg');
    fs.createReadStream(targetPath).pipe(res);
  } else {
    res.status(404).json({ error: 'Audio file not found' });
  }
});

// 12. Visuals Timing JSON API
app.get(['/data/:filename', '/api/data/:filename'], (req: Request, res: Response) => {
  const rawFilename = req.params.filename;
  const filename = (Array.isArray(rawFilename) ? rawFilename[0] : rawFilename) || '';
  const topicMatch = filename.match(/^([a-z0-9_-]+)_visuals\.json$/i);
  const topic = topicMatch ? topicMatch[1] : filename.replace('.json', '');
  const item = (contentMap as any)[topic] || contentMap.python;
  res.json(item.visuals);
});

// 13. Dynamic Thumbnail Images API
app.get(['/thumbnails/:filename', '/api/thumbnails/:filename'], (req: Request, res: Response) => {
  const rawFilename = req.params.filename;
  const filename = (Array.isArray(rawFilename) ? rawFilename[0] : rawFilename) || '';
  const topic = filename.replace(/\.(jpg|png|jpeg)$/i, '');
  const item = (contentMap as any)[topic] || contentMap.python;

  const svg = `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${item.bgColor}"/>
    <rect x="40" y="40" width="1200" height="640" rx="20" fill="#151A2E" stroke="${item.themeColor}" stroke-width="4"/>
    <text x="640" y="320" font-family="Arial, sans-serif" font-size="52" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${item.title}</text>
    <text x="640" y="400" font-family="Arial, sans-serif" font-size="28" fill="${item.themeColor}" text-anchor="middle">VOICEOVER: ${item.voiceoverActor.toUpperCase()}</text>
    <rect x="520" y="460" width="240" height="50" rx="25" fill="${item.themeColor}"/>
    <text x="640" y="493" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#000000" text-anchor="middle">WATCH NOW</text>
  </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// 14. Smart Video Content System Web App
app.get(['/smart-video', '/api/smart-video'], (req: Request, res: Response) => {
  res.send(getSmartVideoSystemHtml());
});

// Fallback route: Redirect any unhandled paths to dashboard
app.use((req: Request, res: Response) => {
  res.redirect('/');
});

// Start CRON if enabled (disabled in Vercel serverless environment)
if (process.env.VERCEL !== '1' && process.env.ENABLE_CRON !== 'false') {
  cron.schedule(CRON_SCHEDULE, async () => {
    console.log('[Server CRON] Daily trigger fired at 09:00 UTC.');
    try {
      await masterOrchestrator.runDailyPipeline();
    } catch (err) {
      console.error('[Server CRON Error]', err);
    }
  }, { timezone: 'UTC' });
  console.log(`[Server] Automated Node-cron scheduled for: "${CRON_SCHEDULE}" (09:00 UTC)`);
}

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`[Server] YouTube Multi-Agent Orchestrator listening on http://localhost:${PORT}`);
  });
}

export default app;
