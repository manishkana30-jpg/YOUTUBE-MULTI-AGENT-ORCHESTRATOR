export function getOrchestratorUiHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YouTube Multi-Agent Video Generator — Orchestrator Mission Control</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090A0F;
      --card-bg: rgba(18, 20, 29, 0.75);
      --card-border: rgba(255, 255, 255, 0.08);
      --primary: #FF2A55;
      --primary-glow: rgba(255, 42, 85, 0.35);
      --accent: #3B82F6;
      --accent-glow: rgba(59, 130, 246, 0.35);
      --emerald: #10B981;
      --amber: #F59E0B;
      --purple: #8B5CF6;
      --cyan: #06B6D4;
      --text: #F3F4F6;
      --text-muted: #9CA3AF;
      --mono: 'JetBrains Mono', monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: radial-gradient(circle at 50% 0%, #171A29 0%, #090A0F 100%);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      padding-bottom: 4rem;
    }

    /* Top Navigation */
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 2.5rem;
      border-bottom: 1px solid var(--card-border);
      background: rgba(9, 10, 15, 0.85);
      backdrop-filter: blur(15px);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: #FFF;
    }

    .brand-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #FF2A55, #E02047);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.2rem;
      box-shadow: 0 0 15px var(--primary-glow);
    }

    .brand-text h1 {
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .brand-text span {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-family: var(--mono);
    }

    .nav-links {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .nav-btn {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--card-border);
      transition: all 0.2s ease;
    }

    .nav-btn:hover, .nav-btn.active {
      color: #FFF;
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
    }

    /* Container */
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 2.5rem;
    }

    /* Header Banner */
    .hero-banner {
      background: linear-gradient(135deg, rgba(255, 42, 85, 0.1) 0%, rgba(59, 130, 246, 0.08) 100%);
      border: 1px solid rgba(255, 42, 85, 0.25);
      border-radius: 20px;
      padding: 2.25rem;
      margin-bottom: 2rem;
      position: relative;
      overflow: hidden;
    }

    .hero-banner::before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(255, 42, 85, 0.2), transparent 70%);
      pointer-events: none;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 42, 85, 0.15);
      border: 1px solid rgba(255, 42, 85, 0.3);
      padding: 0.35rem 0.85rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #FF6584;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 1rem;
    }

    .hero-title {
      font-size: 2.25rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 0.75rem;
      background: linear-gradient(135deg, #FFF 40%, #9CA3AF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 1.05rem;
      color: var(--text-muted);
      max-width: 800px;
      line-height: 1.6;
    }

    /* Architecture Visualizer */
    .arch-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.75rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }

    .arch-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .arch-header h3 {
      font-size: 1.15rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .arch-pipeline {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1rem;
      position: relative;
    }

    @media (max-width: 1024px) {
      .arch-pipeline {
        grid-template-columns: 1fr;
      }
    }

    .agent-node {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 1.25rem;
      position: relative;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .agent-node.active {
      border-color: var(--primary);
      background: rgba(255, 42, 85, 0.08);
      box-shadow: 0 0 25px var(--primary-glow);
      transform: translateY(-2px);
    }

    .agent-node.completed {
      border-color: var(--emerald);
      background: rgba(16, 185, 129, 0.06);
    }

    .agent-step-badge {
      font-size: 0.7rem;
      font-weight: 800;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .agent-icon {
      font-size: 1.75rem;
      margin-bottom: 0.75rem;
    }

    .agent-title {
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 0.35rem;
      color: #FFF;
    }

    .agent-engine {
      font-size: 0.75rem;
      font-family: var(--mono);
      color: #60A5FA;
      margin-bottom: 0.75rem;
    }

    .agent-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.4;
      margin-bottom: 1rem;
    }

    .agent-status-pill {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-muted);
      width: fit-content;
    }

    .agent-node.active .agent-status-pill {
      background: rgba(255, 42, 85, 0.2);
      color: #FF4D73;
    }

    .agent-node.completed .agent-status-pill {
      background: rgba(16, 185, 129, 0.2);
      color: #34D399;
    }

    /* Orchestration Control Panel */
    .control-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.75rem;
      margin-bottom: 2rem;
    }

    .input-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    @media (max-width: 768px) {
      .input-row {
        flex-direction: column;
      }
    }

    .topic-input {
      flex: 1;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1rem 1.25rem;
      color: #FFF;
      font-size: 1.05rem;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
    }

    .topic-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 15px var(--primary-glow);
    }

    .launch-btn {
      background: linear-gradient(135deg, #FF2A55, #E02047);
      color: #FFF;
      border: none;
      border-radius: 12px;
      padding: 1rem 2rem;
      font-size: 1.05rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      transition: all 0.2s ease;
      box-shadow: 0 4px 20px var(--primary-glow);
      white-space: nowrap;
    }

    .launch-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(255, 42, 85, 0.5);
    }

    .launch-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .presets-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .preset-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
      margin-right: 0.25rem;
    }

    .preset-chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 0.35rem 0.85rem;
      font-size: 0.8rem;
      color: #D1D5DB;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .preset-chip:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      color: #FFF;
    }

    /* Terminal & Workspace Grid */
    .workspace-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.75rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 1024px) {
      .workspace-grid {
        grid-template-columns: 1fr;
      }
    }

    .terminal-card {
      background: #0B0D14;
      border: 1px solid var(--card-border);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 480px;
    }

    .terminal-header {
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid var(--card-border);
      padding: 0.75rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .terminal-dots {
      display: flex;
      gap: 6px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .dot.red { background: #EF4444; }
    .dot.yellow { background: #F59E0B; }
    .dot.green { background: #10B981; }

    .terminal-title {
      font-family: var(--mono);
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .terminal-body {
      padding: 1.25rem;
      font-family: var(--mono);
      font-size: 0.8rem;
      line-height: 1.6;
      color: #34D399;
      overflow-y: auto;
      flex: 1;
      white-space: pre-wrap;
      word-break: break-word;
    }

    /* Artifact Workspace */
    .artifact-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 480px;
    }

    .tab-header {
      display: flex;
      border-bottom: 1px solid var(--card-border);
      background: rgba(0, 0, 0, 0.25);
    }

    .tab-btn {
      padding: 0.85rem 1.25rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      background: none;
      border: none;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .tab-btn:hover {
      color: #FFF;
    }

    .tab-btn.active {
      color: #FFF;
      border-bottom-color: var(--primary);
      background: rgba(255, 42, 85, 0.05);
    }

    .tab-content {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    /* Video Player Preview */
    .video-preview-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      align-items: center;
    }

    video.master-player {
      width: 100%;
      max-height: 280px;
      border-radius: 10px;
      border: 1px solid var(--card-border);
      background: #000;
    }

    /* Script Inspector */
    .script-section-item {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 1rem;
      margin-bottom: 0.75rem;
    }

    .section-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.75rem;
      font-family: var(--mono);
    }

    .section-tag {
      color: #60A5FA;
      font-weight: 700;
    }

    .section-emotion {
      color: #F59E0B;
    }

    .section-text {
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 0.4rem;
    }

    .section-visual {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-style: italic;
    }

    /* Footage Gallery */
    .footage-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .footage-clip-item {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      overflow: hidden;
      padding: 0.5rem;
    }

    .footage-clip-item video {
      width: 100%;
      border-radius: 6px;
      max-height: 120px;
      object-fit: cover;
    }

    .footage-meta {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.4rem;
      display: flex;
      justify-content: space-between;
    }

    /* YouTube Card */
    .yt-publish-card {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(18, 20, 29, 0.9));
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 14px;
      padding: 1.5rem;
      text-align: center;
    }

    .yt-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #EF4444;
      color: #FFF;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-weight: 700;
      text-decoration: none;
      margin-top: 1rem;
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
    }
  </style>
</head>
<body>

  <!-- Top Navigation -->
  <nav class="navbar">
    <a href="/generator" class="brand">
      <div class="brand-icon">▶</div>
      <div class="brand-text">
        <h1>YouTube Multi-Agent Generator</h1>
        <span>youtube-multi-agent-orchestrator.vercel.app</span>
      </div>
    </a>
    <div class="nav-links">
      <a href="/generator" class="nav-btn active">⚡ 5-Agent Orchestrator</a>
      <a href="/smart-video" class="nav-btn">IDE Studio Player</a>
      <a href="/hybrid-studio" class="nav-btn">OBS Hybrid Studio</a>
      <a href="/voiceover-studio" class="nav-btn">Voiceover Studio</a>
      <a href="/workflow" class="nav-btn">4-Day Roadmap</a>
      <a href="/" class="nav-btn">Dashboard</a>
    </div>
  </nav>

  <div class="container">

    <!-- Hero Banner -->
    <div class="hero-banner">
      <div class="hero-badge">⚡ Production Swarm Architecture</div>
      <h2 class="hero-title">Automated 5-Agent YouTube Video Factory</h2>
      <p class="hero-subtitle">
        Coordinate Gemini AI scriptwriting, ElevenLabs natural neural voiceover, Pexels B-roll footage sourcing, and FFmpeg video compositing with YouTube Data API v3 publishing. Zero static slideshows. Continuous high-retention video production.
      </p>
    </div>

    <!-- Architecture Visualizer -->
    <div class="arch-card">
      <div class="arch-header">
        <h3><span>🤖</span> Master Orchestrator Architecture</h3>
        <span style="font-family: var(--mono); font-size: 0.8rem; color: #60A5FA;">5 Specialized Sub-Agents</span>
      </div>
      <div class="arch-pipeline">
        <div class="agent-node" id="node-agent1">
          <div>
            <div class="agent-step-badge"><span>Agent 1</span><span>~30s</span></div>
            <div class="agent-icon">📝</div>
            <div class="agent-title">Script Gen</div>
            <div class="agent-engine">Gemini API / Anthropic</div>
            <div class="agent-desc">10-min structured script with emotions, timestamps, and short sentences (&le;10 words).</div>
          </div>
          <div class="agent-status-pill" id="status-agent1">⚪ Waiting</div>
        </div>

        <div class="agent-node" id="node-agent2">
          <div>
            <div class="agent-step-badge"><span>Agent 2</span><span>~2m</span></div>
            <div class="agent-icon">🎙️</div>
            <div class="agent-title">Voiceover Gen</div>
            <div class="agent-engine">ElevenLabs / Neural TTS</div>
            <div class="agent-desc">Natural human-like voice synthesis across all sections without truncation.</div>
          </div>
          <div class="agent-status-pill" id="status-agent2">⚪ Waiting</div>
        </div>

        <div class="agent-node" id="node-agent3">
          <div>
            <div class="agent-step-badge"><span>Agent 3</span><span>~1m</span></div>
            <div class="agent-icon">🎬</div>
            <div class="agent-title">Footage Sourcer</div>
            <div class="agent-engine">Pexels API / B-Roll Engine</div>
            <div class="agent-desc">Queries stock footage matching script keywords and downloads HD MP4 clips.</div>
          </div>
          <div class="agent-status-pill" id="status-agent3">⚪ Waiting</div>
        </div>

        <div class="agent-node" id="node-agent4">
          <div>
            <div class="agent-step-badge"><span>Agent 4</span><span>~3m</span></div>
            <div class="agent-icon">✂️</div>
            <div class="agent-title">Video Editor</div>
            <div class="agent-engine">FFmpeg Audio/Video Sync</div>
            <div class="agent-desc">Combines voiceover + B-roll footage + royalty-free music into 1280x720 24fps master MP4.</div>
          </div>
          <div class="agent-status-pill" id="status-agent4">⚪ Waiting</div>
        </div>

        <div class="agent-node" id="node-agent5">
          <div>
            <div class="agent-step-badge"><span>Agent 5</span><span>~1m</span></div>
            <div class="agent-icon">📤</div>
            <div class="agent-title">YouTube Uploader</div>
            <div class="agent-engine">YouTube Data API v3</div>
            <div class="agent-desc">Uploads video with high-CTR tags, description, and returns live YouTube watch URL.</div>
          </div>
          <div class="agent-status-pill" id="status-agent5">⚪ Waiting</div>
        </div>
      </div>
    </div>

    <!-- Orchestration Control Panel -->
    <div class="control-card">
      <div class="input-row">
        <input type="text" id="topicInput" class="topic-input" placeholder="Enter topic, keyword, or niche (e.g. Master Python in 10 Minutes)..." value="Master Python in 10 Minutes" />
        <button id="launchBtn" class="launch-btn" onclick="startGeneration()">
          <span>🚀 Launch 5-Agent Automation</span>
        </button>
      </div>

      <div class="presets-row">
        <span class="preset-label">Quick Presets:</span>
        <button class="preset-chip" onclick="setTopic('Master Python in 10 Minutes')">🐍 Master Python in 10 Minutes</button>
        <button class="preset-chip" onclick="setTopic('Modern JavaScript Async Mastery')">⚡ Modern JavaScript Async</button>
        <button class="preset-chip" onclick="setTopic('Multi-Agent AI Swarms with MCP')">🤖 Multi-Agent AI Swarms</button>
        <button class="preset-chip" onclick="setTopic('Full Stack Web Development 2026')">🌐 Full Stack Web Dev</button>
      </div>
    </div>

    <!-- Workspace: Terminal & Artifacts -->
    <div class="workspace-grid">

      <!-- Live Terminal Output -->
      <div class="terminal-card">
        <div class="terminal-header">
          <div class="terminal-dots">
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
          </div>
          <div class="terminal-title">master-orchestrator.log — bash</div>
          <button style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:0.75rem;" onclick="clearLogs()">Clear</button>
        </div>
        <div class="terminal-body" id="terminalOutput">
[00:00:00] [Master Orchestrator] Ready for execution.
[00:00:00] [Master Orchestrator] Enter topic and click "Launch 5-Agent Automation" to begin.
        </div>
      </div>

      <!-- Artifact Workspace -->
      <div class="artifact-card">
        <div class="tab-header">
          <button class="tab-btn active" onclick="switchTab('tab-video')">🎬 Master Video</button>
          <button class="tab-btn" onclick="switchTab('tab-script')">📝 Script</button>
          <button class="tab-btn" onclick="switchTab('tab-voiceover')">🎙️ Voiceover</button>
          <button class="tab-btn" onclick="switchTab('tab-footage')">📹 B-Roll Footage</button>
          <button class="tab-btn" onclick="switchTab('tab-youtube')">🚀 Published URL</button>
        </div>

        <!-- Tab 1: Video Player -->
        <div class="tab-content active" id="tab-video">
          <div class="video-preview-wrapper" id="videoPreviewArea">
            <video id="finalVideoPlayer" class="master-player" controls preload="metadata" src="/assets/fallback.mp4"></video>
            <div style="margin-top: 1rem; display: flex; gap: 1rem; width: 100%; justify-content: space-between; align-items: center;">
              <div>
                <strong id="videoCardTitle">Master Video Preview</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted);" id="videoCardMeta">1280x720 • 24 FPS • Audio Synced</div>
              </div>
              <a id="downloadVideoBtn" href="/assets/fallback.mp4" download="master_video.mp4" class="nav-btn" style="color: #FFF;">⬇️ Download MP4</a>
            </div>
          </div>
        </div>

        <!-- Tab 2: Script Inspector -->
        <div class="tab-content" id="tab-script">
          <div id="scriptContentArea">
            <h4 id="scriptTitleDisplay" style="margin-bottom: 0.5rem; color: #FFF;">No script loaded yet</h4>
            <div id="scriptTagsDisplay" style="margin-bottom: 1rem; font-size: 0.75rem; color: #60A5FA;"></div>
            <div id="scriptSectionsContainer">
              <p style="color: var(--text-muted); font-size: 0.85rem;">Click "Launch 5-Agent Automation" to generate structured script with Gemini API.</p>
            </div>
          </div>
        </div>

        <!-- Tab 3: Voiceover Audio Player -->
        <div class="tab-content" id="tab-voiceover">
          <div style="text-align: center; padding: 2rem 0;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎙️</div>
            <h4 id="voiceoverTitle">Voiceover Audio Track</h4>
            <p id="voiceoverMeta" style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;">Continuous full-script audio synthesis (Zero dropoff)</p>
            <audio id="voiceoverAudioPlayer" controls style="width: 100%; max-width: 450px;" src="/assets/audio/python_voiceover.mp3"></audio>
          </div>
        </div>

        <!-- Tab 4: Footage Gallery -->
        <div class="tab-content" id="tab-footage">
          <div class="footage-grid" id="footageGridContainer">
            <div class="footage-clip-item">
              <video src="/assets/fallback.mp4" muted autoplay loop></video>
              <div class="footage-meta">
                <span>Clip 1: Master B-Roll</span>
                <span>10.0s</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 5: Published YouTube Card -->
        <div class="tab-content" id="tab-youtube">
          <div class="yt-publish-card" id="ytCardArea">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔴</div>
            <h3 style="color: #FFF; margin-bottom: 0.5rem;">YouTube Video Published</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">Published to YouTube channel via Data API v3</p>
            <div style="background: rgba(0,0,0,0.4); padding: 0.75rem; border-radius: 8px; font-family: var(--mono); font-size: 0.85rem; color: #34D399; margin-bottom: 1rem;" id="ytUrlBox">
              https://www.youtube.com/watch?v=preview
            </div>
            <a id="ytWatchLink" href="https://www.youtube.com" target="_blank" class="yt-btn">
              Watch on YouTube ↗
            </a>
          </div>
        </div>

      </div>

    </div>

  </div>

  <script>
    let isRunning = false;
    let pollInterval = null;

    function setTopic(text) {
      document.getElementById('topicInput').value = text;
    }

    function clearLogs() {
      document.getElementById('terminalOutput').textContent = '';
    }

    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      event.currentTarget.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    }

    function appendLog(text) {
      const el = document.getElementById('terminalOutput');
      el.textContent += text + '\\n';
      el.scrollTop = el.scrollHeight;
    }

    function updateAgentNode(step, status) {
      const node = document.getElementById('node-agent' + step);
      const pill = document.getElementById('status-agent' + step);
      if (!node || !pill) return;

      node.classList.remove('active', 'completed');

      if (status === 'running') {
        node.classList.add('active');
        pill.innerHTML = '⚡ Working...';
      } else if (status === 'completed') {
        node.classList.add('completed');
        pill.innerHTML = '✅ Done';
      } else if (status === 'error') {
        pill.innerHTML = '❌ Failed';
      } else {
        pill.innerHTML = '⚪ Waiting';
      }
    }

    async function startGeneration() {
      const topic = document.getElementById('topicInput').value.trim();
      if (!topic) {
        alert('Please enter a topic or select a preset.');
        return;
      }

      const launchBtn = document.getElementById('launchBtn');
      launchBtn.disabled = true;
      launchBtn.innerHTML = '<span>⏳ Agents Executing...</span>';
      isRunning = true;

      // Reset node states
      for (let i = 1; i <= 5; i++) {
        updateAgentNode(i, 'waiting');
      }

      appendLog('[START] Triggering 5-Agent YouTube Video Generation for: "' + topic + '"');

      try {
        // Start polling status
        pollInterval = setInterval(pollStatus, 1500);

        const response = await fetch('/api/orchestrator/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic })
        });

        const data = await response.json();
        clearInterval(pollInterval);
        isRunning = false;

        launchBtn.disabled = false;
        launchBtn.innerHTML = '<span>🚀 Launch 5-Agent Automation</span>';

        if (data.success) {
          appendLog('[SUCCESS] 🎉 Video published successfully: ' + data.youtubeUrl);
          renderOrchestrationResult(data);
        } else {
          appendLog('[ERROR] ' + (data.error || 'Failed to complete video pipeline'));
        }
      } catch (err) {
        clearInterval(pollInterval);
        isRunning = false;
        launchBtn.disabled = false;
        launchBtn.innerHTML = '<span>🚀 Launch 5-Agent Automation</span>';
        appendLog('[CRITICAL ERROR] ' + err.message);
      }
    }

    async function pollStatus() {
      try {
        const resp = await fetch('/api/orchestrator/status');
        const state = await resp.json();

        if (state.logs && state.logs.length > 0) {
          const terminal = document.getElementById('terminalOutput');
          terminal.textContent = state.logs.join('\\n');
          terminal.scrollTop = terminal.scrollHeight;
        }

        // Update step nodes
        for (let i = 1; i <= 5; i++) {
          if (i < state.currentStep) {
            updateAgentNode(i, 'completed');
          } else if (i === state.currentStep) {
            updateAgentNode(i, state.status === 'error' ? 'error' : 'running');
          } else {
            updateAgentNode(i, 'waiting');
          }
        }

        if (state.status === 'completed') {
          for (let i = 1; i <= 5; i++) updateAgentNode(i, 'completed');
          renderOrchestrationResult(state);
        }
      } catch {}
    }

    function renderOrchestrationResult(data) {
      // 1. Script Tab
      if (data.script) {
        document.getElementById('scriptTitleDisplay').textContent = data.script.title;
        document.getElementById('scriptTagsDisplay').textContent = (data.script.tags || []).map(t => '#' + t).join(' ');
        
        const secContainer = document.getElementById('scriptSectionsContainer');
        secContainer.innerHTML = '';
        (data.script.script || []).forEach((sec, idx) => {
          const div = document.createElement('div');
          div.className = 'script-section-item';
          div.innerHTML = \`
            <div class="section-meta">
              <span class="section-tag">[\${sec.section}]</span>
              <span class="section-emotion">\${sec.emotion || '[EXCITED]'} &bull; \${sec.duration || 15}s</span>
            </div>
            <div class="section-text">\${sec.text}</div>
            <div class="section-visual">Visual: \${sec.visual}</div>
          \`;
          secContainer.appendChild(div);
        });
      }

      // 2. Voiceover Tab
      if (data.voiceover) {
        const voPlayer = document.getElementById('voiceoverAudioPlayer');
        const voUrl = '/audio/' + data.voiceover.filename;
        voPlayer.src = voUrl;
        document.getElementById('voiceoverTitle').textContent = data.voiceover.filename;
        document.getElementById('voiceoverMeta').textContent = 'Duration: ' + (data.voiceover.duration || 0).toFixed(1) + 's • Source: ' + data.voiceover.source;
      }

      // 3. Footage Tab
      if (data.footage && data.footage.length > 0) {
        const grid = document.getElementById('footageGridContainer');
        grid.innerHTML = '';
        data.footage.forEach(clip => {
          const item = document.createElement('div');
          item.className = 'footage-clip-item';
          item.innerHTML = \`
            <video src="/footage/\${clip.filename}" muted controls preload="metadata"></video>
            <div class="footage-meta">
              <span>\${clip.description || clip.filename}</span>
              <span>\${clip.duration}s</span>
            </div>
          \`;
          grid.appendChild(item);
        });
      }

      // 4. Video Player Tab
      if (data.video) {
        const vPlayer = document.getElementById('finalVideoPlayer');
        const vUrl = '/videos/' + data.video.filename;
        vPlayer.src = vUrl;
        document.getElementById('videoCardTitle').textContent = data.script ? data.script.title : 'Final Rendered Video';
        document.getElementById('videoCardMeta').textContent = data.video.resolution + ' • ' + (data.video.duration || 0).toFixed(1) + 's • ' + ((data.video.fileSizeBytes || 0) / (1024 * 1024)).toFixed(2) + ' MB';
        document.getElementById('downloadVideoBtn').href = vUrl;
      }

      // 5. YouTube Tab
      if (data.youtubeUrl) {
        document.getElementById('ytUrlBox').textContent = data.youtubeUrl;
        document.getElementById('ytWatchLink').href = data.youtubeUrl;
      }
    }
  </script>
</body>
</html>`;
}
