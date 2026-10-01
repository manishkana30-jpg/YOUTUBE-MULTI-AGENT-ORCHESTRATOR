import { TOPIC_DATA } from './topic-content.js';

export function getDynamicVideoPlayerHtml(): string {
  const topicsJson = JSON.stringify(TOPIC_DATA);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dynamic Video Player — JavaScript DOM Architecture</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --theme-color: #FF2A55;
      --theme-secondary: #6366F1;
      --theme-bg: #140A10;
      --theme-card: #24121C;
      --theme-glow: rgba(255, 42, 85, 0.35);
      --font-primary: 'Plus Jakarta Sans', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
      --border-subtle: rgba(255, 255, 255, 0.1);
      --surface-glass: rgba(18, 20, 30, 0.75);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
    }

    body {
      background-color: var(--theme-bg);
      font-family: var(--font-primary);
      color: var(--text-main);
      min-height: 100vh;
      overflow-x: hidden;
      line-height: 1.6;
    }

    /* Ambient animated grid background */
    .bg-grid {
      position: fixed;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: 0;
    }

    .glow-orb {
      position: fixed;
      top: -150px;
      right: 10%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, var(--theme-glow) 0%, transparent 70%);
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
      opacity: 0.6;
      transition: background 0.5s ease;
    }

    /* Top Navigation Header */
    header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(10, 12, 18, 0.85);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-subtle);
      padding: 0.85rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--text-main);
    }

    .brand-badge {
      background: var(--theme-color);
      color: #000;
      font-weight: 800;
      font-size: 0.75rem;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }

    .brand-title {
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: -0.3px;
    }

    /* Interactive Live URL Simulator Bar */
    .url-bar-container {
      flex: 1;
      max-width: 620px;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 0.35rem 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-family: var(--font-mono);
      font-size: 0.85rem;
    }

    .url-protocol {
      color: var(--theme-color);
      font-weight: 600;
    }

    .url-input {
      flex: 1;
      background: transparent;
      border: none;
      color: #E2E8F0;
      font-family: inherit;
      font-size: 0.85rem;
      outline: none;
    }

    .url-go-btn {
      background: var(--theme-color);
      color: #000;
      border: none;
      border-radius: 6px;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
    }

    .header-links {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .nav-btn {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.85rem;
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      border: 1px solid transparent;
      transition: all 0.2s;
    }

    .nav-btn:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--border-subtle);
    }

    /* Main Container */
    main {
      position: relative;
      z-index: 10;
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      display: grid;
      grid-template-columns: 1.8fr 1.2fr;
      gap: 2rem;
    }

    @media (max-width: 1024px) {
      main {
        grid-template-columns: 1fr;
        padding: 1.25rem;
      }
    }

    /* Left Column: Player & Active Content */
    .player-column {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* Topic Quick-Switch Pills Bar */
    .topic-switcher-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    .topic-pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      border-radius: 30px;
      padding: 0.45rem 1.1rem;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      white-space: nowrap;
      transition: all 0.25s ease;
    }

    .topic-pill:hover {
      color: var(--text-main);
      border-color: var(--theme-color);
      transform: translateY(-1px);
    }

    .topic-pill.active {
      background: var(--theme-color);
      color: #000;
      border-color: var(--theme-color);
      box-shadow: 0 4px 15px var(--theme-glow);
    }

    /* Video Player Frame Card */
    .video-card {
      background: var(--theme-card);
      border: 2px solid var(--theme-color);
      border-radius: 20px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px var(--theme-glow);
    }

    .video-container {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #000;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #video-player {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* Subtitle / Dialogue Caption Overlay */
    .caption-overlay {
      position: absolute;
      bottom: 24px;
      left: 5%;
      right: 5%;
      background: rgba(0, 0, 0, 0.85);
      border: 1px solid var(--theme-color);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 0.75rem 1.25rem;
      text-align: center;
      color: #FFF;
      font-size: 1.05rem;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: none;
      z-index: 20;
    }

    .caption-overlay.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Top Video HUD Info Badge */
    .video-hud {
      position: absolute;
      top: 16px;
      left: 16px;
      right: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      pointer-events: none;
      z-index: 15;
    }

    .hud-badge {
      background: rgba(0, 0, 0, 0.75);
      border: 1px solid var(--theme-color);
      color: var(--theme-color);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.3rem 0.7rem;
      border-radius: 6px;
      backdrop-filter: blur(8px);
    }

    .hud-sync-indicator {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(0, 0, 0, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #34D399;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      padding: 0.3rem 0.7rem;
      border-radius: 6px;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 10px #10B981;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    /* Player Controls & Timeline */
    .player-controls {
      background: rgba(14, 16, 25, 0.95);
      padding: 1rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      border-top: 1px solid var(--border-subtle);
    }

    .timeline-container {
      position: relative;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      cursor: pointer;
      overflow: hidden;
    }

    .timeline-fill {
      height: 100%;
      background: var(--theme-color);
      width: 0%;
      border-radius: 4px;
      transition: width 0.1s linear;
      box-shadow: 0 0 8px var(--theme-color);
    }

    .controls-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .playback-buttons {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .ctrl-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      padding: 0.45rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s;
    }

    .ctrl-btn:hover {
      background: var(--theme-color);
      color: #000;
      border-color: var(--theme-color);
    }

    .time-display {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    /* Hidden or custom voiceover audio element */
    #voiceover-audio {
      width: 100%;
      margin-top: 0.5rem;
      display: none;
    }

    /* Video Metadata Card */
    .metadata-card {
      background: var(--theme-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 1.75rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    #video-title {
      font-size: 1.75rem;
      font-weight: 800;
      line-height: 1.3;
      margin-bottom: 0.75rem;
      color: #FFF;
      letter-spacing: -0.5px;
    }

    #description {
      color: #CBD5E1;
      font-size: 0.95rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    #description ul {
      margin-top: 0.75rem;
      padding-left: 1.5rem;
    }

    #description li {
      margin-bottom: 0.4rem;
    }

    #description code {
      background: rgba(0, 0, 0, 0.4);
      color: var(--theme-color);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 0.85em;
    }

    /* Topic-specific Content Sections (.content-section) */
    .content-section {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 1.25rem;
      margin-top: 1rem;
      display: none;
    }

    .section-badge {
      display: inline-block;
      font-size: 0.72rem;
      font-family: var(--font-mono);
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.08);
      color: var(--theme-color);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }

    /* Right Column: Dynamic B-Roll & Visual Synchronizer */
    .sidebar-column {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .broll-card {
      background: var(--theme-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .broll-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .broll-title {
      font-weight: 700;
      font-size: 1rem;
      color: #FFF;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* Dynamic Code Canvas / Graphic Canvas */
    .code-canvas {
      background: #090B10;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      overflow: hidden;
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.7);
    }

    .code-header {
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding: 0.5rem 0.85rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      font-family: var(--font-mono);
      color: var(--text-muted);
    }

    .window-dots {
      display: flex;
      gap: 6px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .dot-red { background: #EF4444; }
    .dot-yellow { background: #F59E0B; }
    .dot-green { background: #10B981; }

    pre.code-content {
      padding: 1rem;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      color: #38BDF8;
      overflow-x: auto;
      line-height: 1.5;
    }

    /* Animated Diagram Architecture */
    .diagram-box {
      background: rgba(0, 0, 0, 0.35);
      border: 1px dashed var(--border-subtle);
      border-radius: 10px;
      padding: 1rem;
    }

    .diagram-title {
      font-size: 0.78rem;
      font-family: var(--font-mono);
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }

    .diagram-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.6rem;
    }

    .diagram-item {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 0.6rem;
      font-size: 0.78rem;
      text-align: center;
      color: #E2E8F0;
      transition: all 0.3s;
    }

    .diagram-item.active {
      border-color: var(--theme-color);
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0 0 12px var(--theme-glow);
      color: #FFF;
      font-weight: 700;
    }

    /* Metrics Callout */
    .metric-badge-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      padding: 0.85rem 1.25rem;
    }

    .metric-num {
      font-size: 1.4rem;
      font-weight: 800;
      font-family: var(--font-mono);
      color: var(--theme-color);
    }

    .metric-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
      text-align: right;
    }

    /* Voiceover Timed Segments Telemetry */
    .telemetry-card {
      background: var(--theme-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 1.5rem;
    }

    .telemetry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .telemetry-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #FFF;
    }

    .segment-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 250px;
      overflow-y: auto;
    }

    .segment-item {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 0.6rem 0.85rem;
      font-size: 0.8rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s;
    }

    .segment-item:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .segment-item.active {
      border-color: var(--theme-color);
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 10px var(--theme-glow);
    }

    .segment-badge {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--theme-color);
      font-weight: 700;
    }

    .segment-text {
      color: #E2E8F0;
      margin-left: 0.5rem;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .segment-time {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-muted);
      margin-left: 0.5rem;
    }

    /* Animation effects applied by syncVoiceoverWithVisuals */
    .anim-pulse-blue {
      animation: pulseBlue 1.2s infinite alternate;
    }
    @keyframes pulseBlue {
      from { box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }
      to { box-shadow: 0 0 30px rgba(59, 130, 246, 0.9); }
    }

    .anim-neon-flash {
      animation: neonFlash 0.8s ease-in-out;
    }
    @keyframes neonFlash {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.6); }
    }

    .anim-smooth-transition {
      animation: smoothMorph 1s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes smoothMorph {
      from { transform: scale(0.96); opacity: 0.7; }
      to { transform: scale(1); opacity: 1; }
    }

    .anim-neural-pulse {
      animation: neuralPulse 1s ease infinite alternate;
    }
    @keyframes neuralPulse {
      from { border-color: #10B981; }
      to { border-color: #00F0FF; }
    }

    .anim-glow-subscribe {
      animation: glowSub 1.5s infinite alternate;
    }
    @keyframes glowSub {
      from { box-shadow: 0 0 10px rgba(255, 42, 85, 0.4); }
      to { box-shadow: 0 0 25px rgba(255, 42, 85, 0.9); }
    }
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="glow-orb" id="glowOrb"></div>

  <!-- Header & Live URL Inspector -->
  <header>
    <a href="/" class="brand">
      <span class="brand-badge">DOM EXPERT</span>
      <span class="brand-title">Dynamic Video Content Engine</span>
    </a>

    <!-- Interactive URL Simulator -->
    <div class="url-bar-container">
      <span class="url-protocol">GET</span>
      <input type="text" class="url-input" id="currentUrlInput" value="/video?topic=python" aria-label="Current Navigation URL" />
      <button class="url-go-btn" id="navigateBtn" onclick="onUrlBarSubmit()">Navigate</button>
    </div>

    <div class="header-links">
      <a href="/" class="nav-btn">← Master Dashboard</a>
      <a href="https://github.com/manishkana30-jpg/YOUTUBE-MULTI-AGENT-ORCHESTRATOR" target="_blank" class="nav-btn">GitHub</a>
    </div>
  </header>

  <!-- Main View Grid -->
  <main>
    <!-- Left Column: Video Player & Description -->
    <div class="player-column">
      <!-- Topic Switcher Pills -->
      <div class="topic-switcher-bar" role="tablist" aria-label="Select Video Topic">
        <button class="topic-pill" data-topic-target="python" onclick="navigateToTopic('python')">
          🐍 Python 3.12
        </button>
        <button class="topic-pill" data-topic-target="javascript" onclick="navigateToTopic('javascript')">
          ⚡ JavaScript V8
        </button>
        <button class="topic-pill" data-topic-target="webdev" onclick="navigateToTopic('webdev')">
          🌐 Full-Stack WebDev
        </button>
        <button class="topic-pill" data-topic-target="ai" onclick="navigateToTopic('ai')">
          🤖 AI Multi-Agents
        </button>
        <button class="topic-pill" data-topic-target="general" onclick="navigateToTopic('general')">
          🎯 Content Masterclass
        </button>
      </div>

      <!-- Video Player Frame -->
      <div class="video-card" id="videoCard">
        <div class="video-container">
          <!-- Top HUD Badges -->
          <div class="video-hud">
            <span class="hud-badge" id="hudTopicBadge">TOPIC: PYTHON</span>
            <div class="hud-sync-indicator">
              <div class="pulse-dot"></div>
              <span id="hudSyncStatus">SYNC: FRAME LOCKED</span>
            </div>
          </div>

          <!-- Video Element Required by Task -->
          <video id="video-player" playsinline preload="metadata">
            <source src="/videos/python_full_course.mp4" type="video/mp4">
            Your browser does not support HTML5 video.
          </video>

          <!-- Voiceover Audio Element Required by Task -->
          <audio id="voiceover-audio" preload="auto">
            <source src="" type="audio/mp3">
          </audio>

          <!-- Synchronized Caption Pill Overlay -->
          <div class="caption-overlay" id="captionOverlay">
            <span id="captionText">Initializing dynamic video engine...</span>
          </div>
        </div>

        <!-- Custom Player Controls & Scrubbing Bar -->
        <div class="player-controls">
          <div class="timeline-container" id="timelineContainer" onclick="onTimelineClick(event)">
            <div class="timeline-fill" id="timelineFill"></div>
          </div>
          <div class="controls-row">
            <div class="playback-buttons">
              <button class="ctrl-btn" id="playBtn" onclick="togglePlayPause()">
                <span id="playIcon">▶</span> <span id="playLabel">Play Full Presentation</span>
              </button>
              <button class="ctrl-btn" onclick="restartPresentation()">
                ↺ Restart
              </button>
              <button class="ctrl-btn" id="speechToggleBtn" onclick="toggleSpeechSynthesis()">
                🔊 Web Speech Voice: ON
              </button>
            </div>
            <div class="time-display">
              <span id="currentTime">00:00</span> / <span id="totalDuration">00:20</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Metadata & Description -->
      <div class="metadata-card">
        <!-- Title Required by Task -->
        <h1 id="video-title">Loading Dynamic Topic...</h1>

        <!-- Description Required by Task -->
        <div id="description">
          <p>Loading topic syllabus and curriculum...</p>
        </div>

        <!-- Dynamic Content Sections Required by Task (.content-section) -->
        <div class="content-section" data-topic="python">
          <span class="section-badge">PYTHON SYLLABUS</span>
          <p><strong>Core Modules:</strong> Coroutines &bull; Async Generators &bull; Multiprocessing &bull; PyTorch &bull; FastAPI Performance</p>
        </div>

        <div class="content-section" data-topic="javascript">
          <span class="section-badge">JAVASCRIPT SYLLABUS</span>
          <p><strong>Core Modules:</strong> V8 Heap &bull; Microtask Loop &bull; Web Workers &bull; WebSockets &bull; Garbage Collector</p>
        </div>

        <div class="content-section" data-topic="webdev">
          <span class="section-badge">WEB DEV SYLLABUS</span>
          <p><strong>Core Modules:</strong> View Transitions API &bull; Subgrid &bull; Container Queries &bull; Edge SSR &bull; Core Web Vitals</p>
        </div>

        <div class="content-section" data-topic="ai">
          <span class="section-badge">AI MULTI-AGENT SYLLABUS</span>
          <p><strong>Core Modules:</strong> Supervisor Swarms &bull; Model Context Protocol &bull; Tool Calling &bull; Context Drift Recovery</p>
        </div>

        <div class="content-section" data-topic="general">
          <span class="section-badge">CONTENT CREATION SYLLABUS</span>
          <p><strong>Core Modules:</strong> 3-Second Hooks &bull; Problem Articulation &bull; 10-15 Min Templates &bull; YouTube SEO Algorithms</p>
        </div>
      </div>
    </div>

    <!-- Right Column: Dynamic B-Roll & Visual Synchronizer -->
    <div class="sidebar-column">
      <!-- Dynamic B-Roll Graphic Card -->
      <div class="broll-card" id="brollCard">
        <div class="broll-header">
          <div class="broll-title">
            <span>🎬 Dynamic B-Roll Graphics</span>
          </div>
          <span class="section-badge" id="brollBadge">RUNNING SNIPPET</span>
        </div>

        <!-- Live Syntax Highlighting Canvas -->
        <div class="code-canvas">
          <div class="code-header">
            <div class="window-dots">
              <div class="dot dot-red"></div>
              <div class="dot dot-yellow"></div>
              <div class="dot dot-green"></div>
            </div>
            <span id="codeFilename">snippet.py</span>
            <span id="codeLanguage">PYTHON</span>
          </div>
          <pre class="code-content"><code id="codeSnippet">// Loading real-time B-roll snippet...</code></pre>
        </div>

        <!-- Dynamic Architecture Diagram -->
        <div class="diagram-box">
          <div class="diagram-title" id="diagramTitle">ARCHITECTURE TOPOLOGY</div>
          <div class="diagram-grid" id="diagramGrid">
            <div class="diagram-item">Node 1</div>
            <div class="diagram-item">Node 2</div>
            <div class="diagram-item">Node 3</div>
            <div class="diagram-item">Node 4</div>
          </div>
        </div>

        <!-- Dynamic Metric Value -->
        <div class="metric-badge-box">
          <div>
            <div class="metric-num" id="metricNum">10x Speed</div>
            <div class="metric-desc" id="metricDesc">Throughput Boost</div>
          </div>
          <span class="section-badge" style="background: rgba(16, 185, 129, 0.15); color: #34D399;">VERIFIED BENCHMARK</span>
        </div>
      </div>

      <!-- Telemetry & Voiceover Timeline Inspector -->
      <div class="telemetry-card">
        <div class="telemetry-header">
          <div class="telemetry-title">🎙️ Voiceover Timed Segments</div>
          <span class="hud-badge" id="currentSegmentBadge">SEGMENT 1/5</span>
        </div>
        <div class="segment-list" id="segmentList">
          <!-- Populated dynamically by loadContentByURL -->
        </div>
      </div>
    </div>
  </main>

  <!-- Embed Full Structured Topic Content Repository -->
  <script>
    const TOPIC_REGISTRY = ${topicsJson};
    let activeVoiceoverData = [];
    let scheduledTimers = [];
    let isSpeechEnabled = true;
    let currentSegmentIndex = -1;
    let presentationDuration = 20; // 20s educational preview loop

    // Helper functions required by user's framework
    const getTitleByTopic = (topic) => {
      const data = TOPIC_REGISTRY[topic] || TOPIC_REGISTRY.general;
      return data.title;
    };

    const getDescriptionByTopic = (topic) => {
      const data = TOPIC_REGISTRY[topic] || TOPIC_REGISTRY.general;
      return data.descriptionHtml;
    };

    const getColorByTopic = (topic) => {
      const data = TOPIC_REGISTRY[topic] || TOPIC_REGISTRY.general;
      return data.bgColor;
    };

    const getFontByTopic = (topic) => {
      const data = TOPIC_REGISTRY[topic] || TOPIC_REGISTRY.general;
      return data.fontFamily;
    };

    const getThemeColor = (topic) => {
      const data = TOPIC_REGISTRY[topic] || TOPIC_REGISTRY.general;
      return data.color;
    };

    // =========================================================================
    // 1. CHECK CURRENT URL (Exact Framework Implementation)
    // =========================================================================
    const getCurrentTopic = () => {
      const url = window.location.href;
      const urlParams = new URLSearchParams(window.location.search);
      
      if (url.includes('/python')) return 'python';
      if (url.includes('/javascript')) return 'javascript';
      if (url.includes('/webdev')) return 'webdev';
      if (urlParams.get('topic') === 'ai') return 'ai';
      if (urlParams.get('topic') === 'python') return 'python';
      if (urlParams.get('topic') === 'javascript') return 'javascript';
      if (urlParams.get('topic') === 'webdev') return 'webdev';
      if (urlParams.get('topic') === 'general') return 'general';
      
      return 'general';
    };

    // =========================================================================
    // 2. LOAD APPROPRIATE CONTENT (Exact Framework Implementation)
    // =========================================================================
    const loadContentByURL = async () => {
      const topic = getCurrentTopic();
      console.log('[Dynamic Content Engine] Loading topic from URL:', topic);
      
      // Update interactive URL bar display
      const currentUrlInput = document.getElementById('currentUrlInput');
      if (currentUrlInput) {
        currentUrlInput.value = window.location.pathname + window.location.search;
      }

      // 1. Change video title
      const titleEl = document.getElementById('video-title');
      if (titleEl) {
        titleEl.textContent = getTitleByTopic(topic);
      }
      
      // 2. Load video source
      const videoPlayer = document.getElementById('video-player');
      if (videoPlayer) {
        const nextSrc = '/videos/' + topic + '_full_course.mp4';
        if (!videoPlayer.src.includes(nextSrc)) {
          videoPlayer.src = nextSrc;
          videoPlayer.load();
        }
      }
      
      // 3. Load description
      const descEl = document.getElementById('description');
      if (descEl) {
        descEl.innerHTML = getDescriptionByTopic(topic);
      }
      
      // 4. Load voiceover script via fetch (or local registry fallback)
      let voiceoverScript;
      try {
        const res = await fetch('/scripts/' + topic + '_voiceover.json');
        if (res.ok) {
          voiceoverScript = await res.json();
        } else {
          voiceoverScript = TOPIC_REGISTRY[topic]?.voiceover || TOPIC_REGISTRY.general.voiceover;
        }
      } catch (err) {
        console.warn('[Dynamic Content Engine] Using local fallback script:', err);
        voiceoverScript = TOPIC_REGISTRY[topic]?.voiceover || TOPIC_REGISTRY.general.voiceover;
      }
      
      activeVoiceoverData = voiceoverScript;
      renderSegmentTelemetry(voiceoverScript);
      playVoiceoverWithTiming(voiceoverScript);
    };

    // =========================================================================
    // 3. CHANGE UI BASED ON URL (Exact Framework Implementation)
    // =========================================================================
    const updateUIByURL = () => {
      const topic = getCurrentTopic();
      const topicData = TOPIC_REGISTRY[topic] || TOPIC_REGISTRY.general;
      
      // Wrap in View Transitions API for seamless morphing (Progressive Enhancement)
      const applyStyles = () => {
        // Change colors
        document.body.style.backgroundColor = getColorByTopic(topic);
        document.documentElement.style.setProperty('--theme-bg', topicData.bgColor);
        document.documentElement.style.setProperty('--theme-card', topicData.bgCard);
        document.documentElement.style.setProperty('--theme-color', topicData.color);
        document.documentElement.style.setProperty('--theme-secondary', topicData.secondaryColor);
        document.documentElement.style.setProperty('--theme-glow', topicData.color + '4D');
        
        // Change fonts
        document.body.style.fontFamily = getFontByTopic(topic);
        
        // Show/hide sections
        document.querySelectorAll('.content-section').forEach(el => {
          el.style.display = el.dataset.topic === topic ? 'block' : 'none';
        });

        // Update Topic Pills Active State
        document.querySelectorAll('.topic-pill').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.topicTarget === topic);
        });

        // Update HUD Badge
        const hudTopicBadge = document.getElementById('hudTopicBadge');
        if (hudTopicBadge) {
          hudTopicBadge.textContent = 'TOPIC: ' + topic.toUpperCase();
        }
        
        // Load relevant B-roll
        loadBRollByTopic(topic);
      };

      if (document.startViewTransition) {
        document.startViewTransition(applyStyles);
      } else {
        applyStyles();
      }
    };

    // Load B-Roll Snippet and Architecture Diagram
    const loadBRollByTopic = (topic) => {
      const data = TOPIC_REGISTRY[topic] || TOPIC_REGISTRY.general;
      const broll = data.bRollSnippet;
      
      const filenameEl = document.getElementById('codeFilename');
      const langEl = document.getElementById('codeLanguage');
      const snippetEl = document.getElementById('codeSnippet');
      const badgeEl = document.getElementById('brollBadge');
      const diagTitleEl = document.getElementById('diagramTitle');
      const diagGridEl = document.getElementById('diagramGrid');
      const metricNumEl = document.getElementById('metricNum');
      const metricDescEl = document.getElementById('metricDesc');

      if (filenameEl) filenameEl.textContent = broll.title;
      if (langEl) langEl.textContent = broll.language.toUpperCase();
      if (snippetEl) snippetEl.textContent = broll.code;
      if (badgeEl) badgeEl.textContent = broll.badge;
      if (diagTitleEl) diagTitleEl.textContent = broll.diagramTitle;
      if (metricNumEl) metricNumEl.textContent = broll.metricValue;
      if (metricDescEl) metricDescEl.textContent = broll.metricLabel;

      if (diagGridEl) {
        diagGridEl.innerHTML = broll.diagramItems.map((item, idx) => 
          '<div class="diagram-item ' + (idx === 0 ? 'active' : '') + '">' + item + '</div>'
        ).join('');
      }
    };

    // =========================================================================
    // 4. SYNC VOICEOVER WITH VISUALS (Exact Framework Implementation)
    // =========================================================================
    const syncVoiceoverWithVisuals = (voiceoverData) => {
      // Clear any previously scheduled timeouts
      scheduledTimers.forEach(t => clearTimeout(t));
      scheduledTimers = [];

      const startTime = 0;
      const audioPlayer = document.getElementById('voiceover-audio');
      
      voiceoverData.forEach((segment, index) => {
        // At specified time, change visual & play animation
        const timerId = setTimeout(() => {
          showVisualForSegment(segment.visual);
          playAnimationForSegment(segment.animation);
          highlightSegmentUI(index, segment);
          speakSegmentWithWebSpeech(segment.text);
        }, segment.startTime * 1000);

        scheduledTimers.push(timerId);
      });
    };

    // Visual segment display handler
    const showVisualForSegment = (visual) => {
      console.log('[Dynamic Visuals] Triggering visual state:', visual);
      const brollCard = document.getElementById('brollCard');
      const videoCard = document.getElementById('videoCard');
      
      // Highlight matching diagram nodes in real-time
      const diagramItems = document.querySelectorAll('.diagram-item');
      if (diagramItems.length > 0) {
        const activeIdx = Math.floor(Math.random() * diagramItems.length);
        diagramItems.forEach((item, idx) => {
          item.classList.toggle('active', idx === activeIdx);
        });
      }
    };

    // Kinetic Animation Player
    const playAnimationForSegment = (animation) => {
      const videoCard = document.getElementById('videoCard');
      const brollCard = document.getElementById('brollCard');
      
      const animClasses = ['anim-pulse-blue', 'anim-neon-flash', 'anim-smooth-transition', 'anim-neural-pulse', 'anim-glow-subscribe'];
      
      [videoCard, brollCard].forEach(el => {
        if (!el) return;
        animClasses.forEach(c => el.classList.remove(c));
        el.classList.add('anim-' + animation);
      });
    };

    // Voiceover Playback Orchestration
    const playVoiceoverWithTiming = (voiceoverScript) => {
      syncVoiceoverWithVisuals(voiceoverScript);
      
      const videoPlayer = document.getElementById('video-player');
      if (videoPlayer) {
        videoPlayer.currentTime = 0;
        videoPlayer.play().catch(() => {
          console.log('[Autoplay Policy] Audio/Video waiting for user gesture.');
        });
      }
    };

    // Web Speech API Voiceover Engine
    function speakSegmentWithWebSpeech(text) {
      if (!isSpeechEnabled || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }

    // Telemetry and HUD highlighting
    function highlightSegmentUI(index, segment) {
      currentSegmentIndex = index;
      const captionOverlay = document.getElementById('captionOverlay');
      const captionText = document.getElementById('captionText');
      const currentSegmentBadge = document.getElementById('currentSegmentBadge');

      if (captionText) captionText.textContent = '💬 "' + segment.text + '"';
      if (captionOverlay) captionOverlay.classList.add('visible');
      if (currentSegmentBadge) currentSegmentBadge.textContent = segment.badge;

      document.querySelectorAll('.segment-item').forEach((item, idx) => {
        item.classList.toggle('active', idx === index);
      });
    }

    function renderSegmentTelemetry(segments) {
      const listEl = document.getElementById('segmentList');
      if (!listEl) return;

      listEl.innerHTML = segments.map((seg, idx) => {
        return '<div class="segment-item ' + (idx === 0 ? 'active' : '') + '" onclick="jumpToSegment(' + seg.startTime + ')">'
          + '<span class="segment-badge">' + seg.badge + '</span>'
          + '<span class="segment-text">' + seg.text + '</span>'
          + '<span class="segment-time">' + seg.startTime + 's</span>'
          + '</div>';
      }).join('');
    }

    function jumpToSegment(startTimeSeconds) {
      const videoPlayer = document.getElementById('video-player');
      if (videoPlayer) {
        videoPlayer.currentTime = startTimeSeconds;
        videoPlayer.play().catch(() => {});
      }
      scheduledTimers.forEach(t => clearTimeout(t));
      scheduledTimers = [];

      const remainingSegments = activeVoiceoverData.filter(s => s.startTime >= startTimeSeconds);
      remainingSegments.forEach(segment => {
        const delay = (segment.startTime - startTimeSeconds) * 1000;
        const timerId = setTimeout(() => {
          showVisualForSegment(segment.visual);
          playAnimationForSegment(segment.animation);
          const originalIdx = activeVoiceoverData.indexOf(segment);
          highlightSegmentUI(originalIdx, segment);
          speakSegmentWithWebSpeech(segment.text);
        }, delay);
        scheduledTimers.push(timerId);
      });
    }

    // Play / Pause Toggle
    function togglePlayPause() {
      const videoPlayer = document.getElementById('video-player');
      const playIcon = document.getElementById('playIcon');
      const playLabel = document.getElementById('playLabel');

      if (!videoPlayer) return;

      if (videoPlayer.paused) {
        videoPlayer.play();
        playVoiceoverWithTiming(activeVoiceoverData);
        if (playIcon) playIcon.textContent = '⏸';
        if (playLabel) playLabel.textContent = 'Pause';
      } else {
        videoPlayer.pause();
        scheduledTimers.forEach(t => clearTimeout(t));
        scheduledTimers = [];
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (playIcon) playIcon.textContent = '▶';
        if (playLabel) playLabel.textContent = 'Resume';
      }
    }

    function restartPresentation() {
      const videoPlayer = document.getElementById('video-player');
      if (videoPlayer) {
        videoPlayer.currentTime = 0;
        videoPlayer.play().catch(() => {});
      }
      playVoiceoverWithTiming(activeVoiceoverData);
    }

    function toggleSpeechSynthesis() {
      isSpeechEnabled = !isSpeechEnabled;
      const btn = document.getElementById('speechToggleBtn');
      if (btn) {
        btn.textContent = isSpeechEnabled ? '🔊 Web Speech Voice: ON' : '🔇 Web Speech Voice: OFF';
      }
      if (!isSpeechEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }

    // Timeline Scrubber
    function onTimelineClick(e) {
      const container = document.getElementById('timelineContainer');
      const videoPlayer = document.getElementById('video-player');
      if (!container || !videoPlayer) return;

      const rect = container.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const targetTime = pct * presentationDuration;
      jumpToSegment(targetTime);
    }

    // Real-time timeline updater
    setInterval(() => {
      const videoPlayer = document.getElementById('video-player');
      const timelineFill = document.getElementById('timelineFill');
      const currentTimeEl = document.getElementById('currentTime');

      if (videoPlayer && timelineFill) {
        const cur = videoPlayer.currentTime;
        const dur = videoPlayer.duration || presentationDuration;
        const pct = Math.min(100, (cur / dur) * 100);
        timelineFill.style.width = pct + '%';
        
        const mins = Math.floor(cur / 60);
        const secs = Math.floor(cur % 60);
        if (currentTimeEl) {
          currentTimeEl.textContent = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
        }
      }
    }, 200);

    // =========================================================================
    // 5. TRACK URL CHANGES & SPA ROUTING (Exact Framework Implementation)
    // =========================================================================
    window.addEventListener('popstate', () => {
      console.log('[Router] popstate event triggered. Reloading content...');
      loadContentByURL();
      updateUIByURL();
    });

    window.addEventListener('load', () => {
      console.log('[Router] Page load complete. Initializing DOM content...');
      loadContentByURL();
      updateUIByURL();
    });

    // Programmatic SPA Navigation helper
    function navigateToTopic(topic) {
      const nextUrl = '/video?topic=' + topic;
      history.pushState({ topic }, '', nextUrl);
      loadContentByURL();
      updateUIByURL();
      
      // Accessibility focus routing
      document.getElementById('video-title')?.focus();
    }

    function onUrlBarSubmit() {
      const input = document.getElementById('currentUrlInput');
      if (!input) return;
      const target = input.value.trim();
      if (target) {
        history.pushState(null, '', target);
        loadContentByURL();
        updateUIByURL();
      }
    }
  </script>
</body>
</html>`;
}
