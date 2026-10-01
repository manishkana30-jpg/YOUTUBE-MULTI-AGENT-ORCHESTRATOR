export interface VisualItem {
  timestamp: number;
  type: string;
  text: string;
  subtitle: string;
  animation: string;
  color: string;
  actor: string;
}

export interface ContentItem {
  videoFile: string;
  voiceoverFile: string;
  voiceoverActor: string;
  title: string;
  description: string;
  duration: string;
  visualsJson: string;
  thumbnail: string;
  themeColor: string;
  bgColor: string;
  font: string;
  visuals: VisualItem[];
}

export const contentMap: Record<string, ContentItem> = {
  python: {
    videoFile: '/videos/python_tutorial.mp4',
    voiceoverFile: '/audio/python_voiceover.mp3',
    voiceoverActor: 'professional_male_voice',
    title: 'Complete Python Tutorial for Beginners',
    description: 'Learn Python from zero to hero with asynchronous event loops, generators, and production backend architecture.',
    duration: '12:34',
    visualsJson: '/data/python_visuals.json',
    thumbnail: '/thumbnails/python.jpg',
    themeColor: '#3B82F6',
    bgColor: '#080E1C',
    font: "'Fira Code', 'JetBrains Mono', monospace",
    visuals: [
      { timestamp: 0.5, type: 'headline', text: '🐍 Complete Python Tutorial for Beginners', subtitle: 'From Zero to Production Architecture', animation: 'fade-down', color: '#3B82F6', actor: 'professional_male_voice' },
      { timestamp: 3.0, type: 'code-callout', text: 'async def worker(): await asyncio.gather(*tasks)', subtitle: 'Asyncio Event Loops & Non-Blocking Coroutines', animation: 'slide-left', color: '#60A5FA', actor: 'professional_male_voice' },
      { timestamp: 6.5, type: 'diagram', text: 'Task Queue ➔ Event Loop ➔ Zero-Copy Buffer', subtitle: '10x Latency Drop with TaskGroup Execution', animation: 'zoom-pulse', color: '#F59E0B', actor: 'professional_male_voice' },
      { timestamp: 9.5, type: 'metrics', text: 'Production Benchmark: 140ms Latency', subtitle: 'Scales to 100k Concurrent WebSockets with Zero Thread Starvation', animation: 'glow-rise', color: '#10B981', actor: 'professional_male_voice' },
      { timestamp: 12.5, type: 'cta', text: '👉 Subscribe to NEXO KIDS for Daily Python Code', subtitle: 'Get the Free Open-Source Repository & Project Files', animation: 'pulse-badge', color: '#FF2A55', actor: 'professional_male_voice' }
    ]
  },

  javascript: {
    videoFile: '/videos/javascript_tutorial.mp4',
    voiceoverFile: '/audio/javascript_voiceover.mp3',
    voiceoverActor: 'professional_female_voice',
    title: 'JavaScript Complete Guide',
    description: 'Master JavaScript in one video with deep dives into the V8 engine, microtask priority, and 60fps browser rendering.',
    duration: '15:20',
    visualsJson: '/data/javascript_visuals.json',
    thumbnail: '/thumbnails/javascript.jpg',
    themeColor: '#F7DF1E',
    bgColor: '#12120A',
    font: "'Plus Jakarta Sans', sans-serif",
    visuals: [
      { timestamp: 0.5, type: 'headline', text: '⚡ JavaScript Complete Guide', subtitle: 'Master the V8 Engine, Event Loop & Asynchronous Architecture', animation: 'fade-down', color: '#F7DF1E', actor: 'professional_female_voice' },
      { timestamp: 3.0, type: 'code-callout', text: 'queueMicrotask(() => processJob())', subtitle: 'Microtask Queue Execution Priority Before Render', animation: 'slide-left', color: '#FBBF24', actor: 'professional_female_voice' },
      { timestamp: 6.5, type: 'diagram', text: 'Call Stack ➔ Microtask Queue ➔ Render Pipeline', subtitle: 'Lock-Free 60 FPS Smooth User Interactions', animation: 'zoom-pulse', color: '#10B981', actor: 'professional_female_voice' },
      { timestamp: 10.0, type: 'metrics', text: 'INP Reduced to < 45ms Across All Devices', subtitle: 'Eliminating Main-Thread Long Tasks and Layout Thrashing', animation: 'glow-rise', color: '#06B6D4', actor: 'professional_female_voice' },
      { timestamp: 13.0, type: 'cta', text: '👉 Subscribe for Weekly Full-Stack JavaScript Deep Dives', subtitle: 'Drop Your Favorite Framework in the Comments Below!', animation: 'pulse-badge', color: '#FF2A55', actor: 'professional_female_voice' }
    ]
  },

  ai: {
    videoFile: '/videos/ai_basics.mp4',
    voiceoverFile: '/audio/ai_voiceover.mp3',
    voiceoverActor: 'professional_deep_voice',
    title: 'AI & Machine Learning Basics',
    description: 'Understand AI in simple terms with hierarchical multi-agent supervisor swarms, MCP tool execution, and self-healing state.',
    duration: '14:45',
    visualsJson: '/data/ai_visuals.json',
    thumbnail: '/thumbnails/ai.jpg',
    themeColor: '#10B981',
    bgColor: '#071510',
    font: "'Outfit', sans-serif",
    visuals: [
      { timestamp: 0.5, type: 'headline', text: '🤖 AI & Machine Learning Basics', subtitle: 'Hierarchical Supervisor Swarms & Model Context Protocol', animation: 'fade-down', color: '#10B981', actor: 'professional_deep_voice' },
      { timestamp: 3.0, type: 'code-callout', text: 'const swarm = new AgentSupervisor({ mcp: true })', subtitle: 'Orchestrating Specialized Subagents Concurrently', animation: 'slide-left', color: '#00F0FF', actor: 'professional_deep_voice' },
      { timestamp: 6.5, type: 'diagram', text: 'Supervisor Controller ➔ Content, SEO & Media Workers', subtitle: 'Dynamic Tool Discovery via MCP Protocol', animation: 'zoom-pulse', color: '#A855F7', actor: 'professional_deep_voice' },
      { timestamp: 10.0, type: 'metrics', text: '10x Autonomous Speed & 100% Deterministic Retries', subtitle: 'Zero Context Window Hallucination or Thread Hangs', animation: 'glow-rise', color: '#F59E0B', actor: 'professional_deep_voice' },
      { timestamp: 13.0, type: 'cta', text: '👉 Subscribe to NEXO KIDS for Production AI Agent Templates', subtitle: 'Star the GitHub Repo & Build Your First Autonomous Swarm!', animation: 'pulse-badge', color: '#FF2A55', actor: 'professional_deep_voice' }
    ]
  }
};

export function getSmartVideoSystemHtml(): string {
  const contentMapJson = JSON.stringify(contentMap);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Video Content System — Dynamic DOM Architecture</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --theme-color: #3B82F6;
      --theme-bg: #080E1C;
      --theme-glow: rgba(59, 130, 246, 0.4);
      --font-family: 'Plus Jakarta Sans', sans-serif;
      --mono: 'JetBrains Mono', monospace;
      --card-bg: rgba(16, 20, 32, 0.85);
      --border: rgba(255, 255, 255, 0.1);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      transition: background-color 0.35s ease, border-color 0.35s ease, color 0.35s ease;
    }

    body {
      background-color: var(--theme-bg);
      font-family: var(--font-family);
      color: #F8FAFC;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      line-height: 1.6;
    }

    /* Top Global Header */
    .top-bar {
      width: 100%;
      max-width: 1080px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1.25rem;
      background: rgba(12, 15, 24, 0.8);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: 14px;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .brand-title {
      font-weight: 800;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #FFF;
      text-decoration: none;
    }

    .badge-pill {
      background: var(--theme-color);
      color: #000;
      font-weight: 800;
      font-size: 0.72rem;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      font-family: var(--mono);
    }

    /* URL Navigation Switcher */
    .topic-nav {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .nav-link {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      color: #CBD5E1;
      padding: 0.4rem 0.9rem;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s;
    }

    .nav-link:hover {
      border-color: var(--theme-color);
      color: #FFF;
      transform: translateY(-1px);
    }

    .nav-link.active {
      background: var(--theme-color);
      color: #000;
      border-color: var(--theme-color);
      box-shadow: 0 0 15px var(--theme-glow);
    }

    /* =========================================================================
       REQUIRED HTML STRUCTURE STYLING (#video-container)
       ========================================================================= */
    #video-container {
      position: relative;
      width: 100%;
      max-width: 1080px;
      background: var(--card-bg);
      border: 2px solid var(--theme-color);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px var(--theme-glow);
      display: flex;
      flex-direction: column;
    }

    /* Media stage */
    .video-viewport {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #000;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #main-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* #voiceover-container (audio element container) */
    #voiceover-container {
      position: absolute;
      top: 14px;
      right: 14px;
      z-index: 30;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .actor-badge {
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid var(--theme-color);
      color: var(--theme-color);
      font-family: var(--mono);
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .actor-pulse {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 8px #10B981;
      animation: pulse 1.2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(0.7); opacity: 0.4; }
    }

    /* #visual-overlay (Dynamic Visual Overlays & Kinetic Animations) */
    #visual-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 20;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 2.5rem;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.1) 60%, transparent 100%);
    }

    .overlay-card {
      background: rgba(10, 12, 20, 0.9);
      border: 1px solid var(--theme-color);
      border-left: 5px solid var(--theme-color);
      border-radius: 12px;
      padding: 1.25rem 1.75rem;
      max-width: 850px;
      backdrop-filter: blur(14px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7), 0 0 20px var(--theme-glow);
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .overlay-card.visible {
      transform: translateY(0);
      opacity: 1;
    }

    .overlay-tag {
      font-family: var(--mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--theme-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.3rem;
    }

    .overlay-headline {
      font-size: 1.45rem;
      font-weight: 800;
      color: #FFF;
      line-height: 1.3;
      margin-bottom: 0.3rem;
    }

    .overlay-subtitle {
      font-size: 0.95rem;
      color: #CBD5E1;
    }

    /* #description-panel (Dynamic Description based on URL) */
    #description-panel {
      padding: 1.75rem 2rem;
      background: rgba(14, 18, 30, 0.95);
      border-top: 1px solid var(--border);
    }

    #video-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: #FFF;
      margin-bottom: 0.5rem;
      letter-spacing: -0.3px;
    }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      font-size: 0.85rem;
      color: #94A3B8;
      margin-bottom: 1rem;
      font-family: var(--mono);
    }

    #description {
      color: #E2E8F0;
      font-size: 0.95rem;
      line-height: 1.7;
    }

    /* Interactive Player Bar Controls */
    .player-controls-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 2rem;
      background: rgba(8, 10, 18, 0.95);
      border-top: 1px solid var(--border);
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .ctrl-group {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .btn-action {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border);
      color: #FFF;
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

    .btn-action:hover {
      background: var(--theme-color);
      color: #000;
      border-color: var(--theme-color);
    }

    .time-indicator {
      font-family: var(--mono);
      font-size: 0.85rem;
      color: #94A3B8;
    }

    /* Timed Visual Overlay Animation Variants */
    .anim-fade-down { animation: fadeDown 0.6s ease; }
    .anim-slide-left { animation: slideLeft 0.5s ease; }
    .anim-zoom-pulse { animation: zoomPulse 0.5s ease; }
    .anim-glow-rise { animation: glowRise 0.6s ease; }
    .anim-pulse-badge { animation: pulseBadge 0.7s infinite alternate; }

    @keyframes fadeDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes zoomPulse {
      0% { transform: scale(0.92); opacity: 0; }
      50% { transform: scale(1.03); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes glowRise {
      from { transform: translateY(20px); opacity: 0; filter: blur(5px); }
      to { transform: translateY(0); opacity: 1; filter: blur(0); }
    }
    @keyframes pulseBadge {
      from { transform: scale(1); box-shadow: 0 0 10px rgba(255, 42, 85, 0.5); }
      to { transform: scale(1.02); box-shadow: 0 0 25px rgba(255, 42, 85, 0.9); }
    }
  </style>
</head>
<body>
  <!-- Top Navigation & Live Topic Switcher -->
  <div class="top-bar">
    <a href="/" class="brand-title">
      <span class="badge-pill">SMART VIDEO</span>
      <span>Dynamic Content Engine</span>
    </a>

    <nav class="topic-nav" aria-label="Topic Selection">
      <a href="?topic=python" class="nav-link" id="nav-python" onclick="switchTopic('python', event)">
        🐍 Python
      </a>
      <a href="?topic=javascript" class="nav-link" id="nav-javascript" onclick="switchTopic('javascript', event)">
        ⚡ JavaScript
      </a>
      <a href="?topic=ai" class="nav-link" id="nav-ai" onclick="switchTopic('ai', event)">
        🤖 AI & ML
      </a>
    </nav>
  </div>

  <!-- =======================================================================
       EXACT REQUIRED HTML STRUCTURE
       ======================================================================= -->
  <div id="video-container">
    <div class="video-viewport">
      <video id="main-video" width="100%" playsinline preload="metadata">
        <source id="video-source" src="" type="video/mp4">
      </video>
      
      <div id="voiceover-container">
        <!-- Voiceover actor metadata badge & audio element -->
        <div class="actor-badge">
          <div class="actor-pulse"></div>
          <span id="actor-label">VOICEOVER: professional_male_voice</span>
        </div>
        <audio id="voiceover-audio" autoplay></audio>
      </div>
      
      <div id="visual-overlay">
        <!-- Text overlays, animations -->
        <div class="overlay-card" id="activeVisualCard">
          <div class="overlay-tag" id="visualTag">01. INITIALIZING</div>
          <div class="overlay-headline" id="visualHeadline">Synchronizing Audio & Video...</div>
          <div class="overlay-subtitle" id="visualSubtitle">Please wait for playback stream</div>
        </div>
      </div>
    </div>

    <!-- Playback Control Bar -->
    <div class="player-controls-bar">
      <div class="ctrl-group">
        <button class="btn-action" id="playBtn" onclick="togglePlay()">
          <span id="playIcon">▶</span> <span id="playText">Play Presentation</span>
        </button>
        <button class="btn-action" onclick="restart()">
          ↺ Restart
        </button>
        <button class="btn-action" id="speechBtn" onclick="toggleSpeechFallback()">
          🔊 Neural Voice: ON
        </button>
      </div>
      <div class="time-indicator">
        <span id="timeElapsed">00:00</span> / <span id="totalTime">12:34</span>
      </div>
    </div>
    
    <div id="description-panel">
      <!-- Dynamic description based on URL -->
      <h1 id="video-title">Complete Python Tutorial for Beginners</h1>
      <div class="meta-row">
        <span>⏱️ Duration: <strong id="meta-duration">12:34</strong></span>
        <span>•</span>
        <span>🎙️ Actor: <strong id="meta-actor">professional_male_voice</strong></span>
        <span>•</span>
        <span>📁 Source: <code id="meta-source">/videos/python_tutorial.mp4</code></span>
      </div>
      <div id="description">
        Learn Python from zero to hero...
      </div>
    </div>
  </div>

  <!-- =======================================================================
       JAVASCRIPT IMPLEMENTATION
       ======================================================================= -->
  <script>
    // 1. Content Mapping Data
    const contentMap = ${contentMapJson};

    let activeVisuals = [];
    let activeVisualTimestamp = null;
    let isSpeechEnabled = true;

    // 2. Load Content By URL (Exact Implementation from User Requirement)
    const loadContentByURL = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const topic = urlParams.get('topic') || 'python';
      
      const content = contentMap[topic];
      if (!content) return;
      
      // Update Active Navigation Pill
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.id === 'nav-' + topic);
      });

      // Update Theme Styling & Typography
      document.documentElement.style.setProperty('--theme-color', content.themeColor);
      document.documentElement.style.setProperty('--theme-bg', content.bgColor);
      document.documentElement.style.setProperty('--theme-glow', content.themeColor + '66');
      document.body.style.backgroundColor = content.bgColor;
      document.body.style.fontFamily = content.font;

      // Update Actor and Metadata
      const actorLabel = document.getElementById('actor-label');
      if (actorLabel) actorLabel.textContent = 'VO: ' + content.voiceoverActor;
      const metaDuration = document.getElementById('meta-duration');
      if (metaDuration) metaDuration.textContent = content.duration;
      const metaActor = document.getElementById('meta-actor');
      if (metaActor) metaActor.textContent = content.voiceoverActor;
      const metaSource = document.getElementById('meta-source');
      if (metaSource) metaSource.textContent = content.videoFile;
      const totalTime = document.getElementById('totalTime');
      if (totalTime) totalTime.textContent = content.duration;

      // Load video
      document.getElementById('video-source').src = content.videoFile;
      const mainVideo = document.getElementById('main-video');
      mainVideo.load();
      
      // Load voiceover
      const audio = document.getElementById('voiceover-audio');
      audio.src = content.voiceoverFile;
      audio.load();
      
      // Update metadata
      document.title = content.title;
      document.getElementById('video-title').textContent = 
        content.title;
      document.getElementById('description').textContent = 
        content.description;
      
      // Load visual timing data
      fetch(content.visualsJson)
        .then(r => {
          if (r.ok) return r.json();
          return content.visuals;
        })
        .catch(() => content.visuals)
        .then(visuals => {
          activeVisuals = visuals || content.visuals;
          syncVisualsWithAudio(activeVisuals);
        });
    };

    // 3. Sync Timing (Critical for human-like feel)
    const syncVisualsWithAudio = (visualsData) => {
      const audio = document.getElementById('voiceover-audio');
      activeVisualTimestamp = null;
      
      // Remove any existing timeupdate listeners to prevent duplicate listener accumulation
      audio.ontimeupdate = () => {
        const cur = audio.currentTime;
        
        // Exact timestamp window matching as defined in user requirements
        // Supports both: (Math.abs(audio.currentTime - visual.timestamp) < 0.2)
        // AND time-bracket detection for seeking backwards and forwards:
        const currentVisual = visualsData
          .filter(v => cur >= v.timestamp)
          .sort((a, b) => b.timestamp - a.timestamp)[0];

        if (currentVisual && currentVisual.timestamp !== activeVisualTimestamp) {
          activeVisualTimestamp = currentVisual.timestamp;
          updateVisual(currentVisual);
        }
      };
    };

    // 4. Update Visual Overlay
    function updateVisual(visual) {
      console.log('[Visual Engine] Displaying visual at timestamp:', visual.timestamp, visual);
      const card = document.getElementById('activeVisualCard');
      const tag = document.getElementById('visualTag');
      const headline = document.getElementById('visualHeadline');
      const subtitle = document.getElementById('visualSubtitle');

      if (!card || !headline) return;

      // Morph card text
      tag.textContent = (visual.type || 'KEY POINT').toUpperCase() + ' • ' + (visual.timestamp.toFixed(1)) + 's';
      tag.style.color = visual.color || 'var(--theme-color)';
      headline.textContent = visual.text;
      subtitle.textContent = visual.subtitle || '';

      // Apply kinetic animation class
      card.className = 'overlay-card visible anim-' + (visual.animation || 'fade-down');

      // Play neural Web Speech synthesis fallback when audio element is muted/autoplay blocked
      if (isSpeechEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(visual.text);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    }

    // Playback Toggle
    function togglePlay() {
      const video = document.getElementById('main-video');
      const audio = document.getElementById('voiceover-audio');
      const icon = document.getElementById('playIcon');
      const text = document.getElementById('playText');

      if (video.paused) {
        video.play().catch(() => {});
        audio.play().catch(() => {});
        if (icon) icon.textContent = '⏸';
        if (text) text.textContent = 'Pause';
      } else {
        video.pause();
        audio.pause();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (icon) icon.textContent = '▶';
        if (text) text.textContent = 'Resume';
      }
    }

    function restart() {
      const video = document.getElementById('main-video');
      const audio = document.getElementById('voiceover-audio');
      video.currentTime = 0;
      audio.currentTime = 0;
      activeVisualTimestamp = null;
      video.play().catch(() => {});
      audio.play().catch(() => {});
    }

    function toggleSpeechFallback() {
      isSpeechEnabled = !isSpeechEnabled;
      const btn = document.getElementById('speechBtn');
      if (btn) btn.textContent = isSpeechEnabled ? '🔊 Neural Voice: ON' : '🔇 Neural Voice: OFF';
      if (!isSpeechEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
    }

    // Time elapsed ticker
    setInterval(() => {
      const audio = document.getElementById('voiceover-audio');
      const timeElapsed = document.getElementById('timeElapsed');
      if (audio && timeElapsed) {
        const cur = audio.currentTime || 0;
        const mins = Math.floor(cur / 60);
        const secs = Math.floor(cur % 60);
        timeElapsed.textContent = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
      }
    }, 250);

    // SPA Topic Switcher
    function switchTopic(topic, event) {
      if (event) event.preventDefault();
      history.pushState({ topic }, '', '?topic=' + topic);
      loadContentByURL();
    }

    // Window events
    window.addEventListener('popstate', loadContentByURL);
    window.addEventListener('DOMContentLoaded', loadContentByURL);
  </script>
</body>
</html>`;
}
