import express, { Request, Response } from 'express';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { masterOrchestrator } from './agents/orchestrator.js';
import { db } from './db/client.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 9 * * *';

app.use(express.json());

// 1. Healthcheck Route
app.get('/health', async (req: Request, res: Response) => {
  const stats = await db.getSystemStats();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'youtube-auto-orchestrator',
    cronSchedule: CRON_SCHEDULE,
    stats
  });
});

// 2. Trigger Orchestrator Pipeline API
app.post('/api/orchestrate/run', async (req: Request, res: Response) => {
  try {
    const { channelId, brief } = req.body;
    console.log('[API] Manual orchestration trigger requested.');

    if (brief) {
      const channels = await db.fetchActiveChannels();
      const targetChannel = channelId || channels[0]?.id || 'c001-ai-engineering';
      await db.createBrief(targetChannel, brief);
    }

    // Run in background and return immediate response or await completion
    const results = await masterOrchestrator.runDailyPipeline(channelId);
    res.json({
      success: true,
      message: 'Pipeline executed successfully',
      count: results.length,
      results
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || 'Pipeline execution failed'
    });
  }
});

// 3. Query Logs API
app.get('/api/logs', async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 30;
  const logs = await db.getRecentLogs(limit);
  res.json({ count: logs.length, logs });
});

// 4. Query Content Calendar API
app.get('/api/calendar', async (req: Request, res: Response) => {
  const briefs = await db.fetchPendingBriefs();
  res.json({ briefs });
});

// 5. Visual Dashboard UI (Served at `/`)
app.get('/', async (req: Request, res: Response) => {
  const stats = await db.getSystemStats();
  const logs = await db.getRecentLogs(15);
  const channels = await db.fetchActiveChannels();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Antigravity YouTube Multi-Agent Orchestrator</title>
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
        <h1><span>Antigravity</span> YouTube Multi-Agent</h1>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.25rem;">
          Autonomous Production Pipeline &bull; Gemini 2.5 &bull; Supabase &bull; MCP SerpApi
        </p>
      </div>
      <div style="display: flex; gap: 1rem; align-items: center;">
        <div class="badge">
          <div class="badge-dot"></div>
          CRON 09:00 UTC Active
        </div>
        <button class="btn" onclick="triggerPipeline()">
          <span>⚡ Trigger Pipeline Now</span>
        </button>
      </div>
    </header>

    <div class="grid">
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
      <div class="card">
        <h3>Database Mode</h3>
        <div class="val" style="font-size: 1.25rem; color: ${stats.isSupabaseActive ? '#34D399' : '#818CF8'};">
          ${stats.isSupabaseActive ? 'Supabase Live' : 'Local Fallback'}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">PostgreSQL schema synced</div>
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
    async function triggerPipeline() {
      const btn = document.querySelector('.btn');
      btn.innerText = '⚡ Orchestrating Agents...';
      btn.disabled = true;
      try {
        const res = await fetch('/api/orchestrate/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
        const data = await res.json();
        alert('Pipeline completed successfully! Processed: ' + data.count + ' video(s).');
        window.location.reload();
      } catch (err) {
        alert('Error triggering pipeline: ' + err.message);
      } finally {
        btn.innerText = '⚡ Trigger Pipeline Now';
        btn.disabled = false;
      }
    }
  </script>
</body>
</html>`;

  res.send(html);
});

// Start CRON if enabled
if (process.env.ENABLE_CRON !== 'false') {
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

app.listen(PORT, () => {
  console.log(`[Server] YouTube Multi-Agent Orchestrator listening on http://localhost:${PORT}`);
});
