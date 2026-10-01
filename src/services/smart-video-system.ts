export interface VisualItem {
  timestamp: number;
  type: string;
  text: string;
  subtitle: string;
  animation: string;
  color: string;
  actor: string;
  framing?: 'FULLSCREEN_PRESENTER' | 'SPLIT_SCREEN' | 'PICTURE_IN_PICTURE' | 'CLOSE_UP';
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
      { timestamp: 0.5, type: 'intro', text: '🐍 Python Basics for Beginners', subtitle: "Hey everyone! I'm about to show you Python basics. By the end of this, you'll be able to write your first program. Let's go!", animation: 'fade-down', color: '#3B82F6', actor: 'professional_male_voice', framing: 'FULLSCREEN_PRESENTER' },
      { timestamp: 3.0, type: 'problem', text: 'Split Screen: Why People Struggle with Python', subtitle: "Most people give up on Python because they think it's too hard. But I'm going to show you it's actually simple. Here's what I see people struggling with...", animation: 'slide-left', color: '#60A5FA', actor: 'professional_male_voice', framing: 'SPLIT_SCREEN' },
      { timestamp: 6.5, type: 'teaching', text: 'Step 1: Live Code & Highlighting Common Mistakes', subtitle: "Step 1: Writing clean functions. See how I'm doing this? Now here's the common mistake: indentation errors. Let me show you the right way.", animation: 'zoom-pulse', color: '#F59E0B', actor: 'professional_male_voice', framing: 'PICTURE_IN_PICTURE' },
      { timestamp: 9.5, type: 'example', text: 'Real Working Code Running Live with Output', subtitle: "Look at this! I just wrote this code and it worked first try. See the output on screen? That's exactly what we wanted.", animation: 'glow-rise', color: '#10B981', actor: 'professional_male_voice', framing: 'PICTURE_IN_PICTURE' },
      { timestamp: 12.0, type: 'story', text: 'Personal Story: Five Years Ago I Knew Zero Python', subtitle: "Here's why this matters to me. Five years ago I didn't know Python. Then I learned it, and it completely changed my career.", animation: 'fade-down', color: '#8B5CF6', actor: 'professional_male_voice', framing: 'CLOSE_UP' },
      { timestamp: 14.5, type: 'cta', text: 'Call to Action: Build Today & Subscribe', subtitle: "I want you to try coding today. Comment below what you build. Subscribe for more Python lessons!", animation: 'pulse-badge', color: '#FF2A55', actor: 'professional_male_voice', framing: 'FULLSCREEN_PRESENTER' }
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
      { timestamp: 0.5, type: 'headline', text: '⚡ JavaScript Complete Guide', subtitle: 'Welcome back! Today we master modern JavaScript and V8 engine internals.', animation: 'fade-down', color: '#F7DF1E', actor: 'professional_female_voice', framing: 'FULLSCREEN_PRESENTER' },
      { timestamp: 3.0, type: 'code-callout', text: 'Long synchronous tasks lock the main browser thread.', subtitle: 'See the UI freeze on screen: frame rates collapse down to zero.', animation: 'slide-left', color: '#FBBF24', actor: 'professional_female_voice', framing: 'SPLIT_SCREEN' },
      { timestamp: 6.5, type: 'diagram', text: 'Step 1: Microtask Queue & queueMicrotask()', subtitle: 'Watch the execution order: promises run before the next paint tick.', animation: 'zoom-pulse', color: '#10B981', actor: 'professional_female_voice', framing: 'PICTURE_IN_PICTURE' },
      { timestamp: 10.0, type: 'metrics', text: 'Real Case Study: INP Reduced to < 45ms', subtitle: 'In production, eliminating main-thread long tasks preserved fluid 60fps.', animation: 'glow-rise', color: '#06B6D4', actor: 'professional_female_voice', framing: 'PICTURE_IN_PICTURE' },
      { timestamp: 12.0, type: 'story', text: 'Early in my career, UI lag cost us major conversions.', subtitle: 'Understanding V8 microtask scheduling completely revolutionized our apps.', animation: 'fade-down', color: '#8B5CF6', actor: 'professional_female_voice', framing: 'CLOSE_UP' },
      { timestamp: 14.5, type: 'cta', text: '👉 Subscribe for Weekly Full-Stack JavaScript Deep Dives', subtitle: 'Try this in your browser devtools, comment below, and subscribe!', animation: 'pulse-badge', color: '#FF2A55', actor: 'professional_female_voice', framing: 'FULLSCREEN_PRESENTER' }
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
      { timestamp: 0.5, type: 'headline', text: '🤖 AI & Machine Learning Basics', subtitle: 'Welcome! Today I\'m going to show you how to master autonomous AI agent swarms.', animation: 'fade-down', color: '#10B981', actor: 'professional_deep_voice', framing: 'FULLSCREEN_PRESENTER' },
      { timestamp: 3.0, type: 'code-callout', text: 'Single-prompt AI chains get stuck in infinite retries.', subtitle: 'Look at the screen: context drift burns tokens and causes silent crashes.', animation: 'slide-left', color: '#00F0FF', actor: 'professional_deep_voice', framing: 'SPLIT_SCREEN' },
      { timestamp: 6.5, type: 'diagram', text: 'Step 1: Supervisor-Worker Multi-Agent Swarms', subtitle: 'Watch the controller delegate tasks to specialized workers via MCP.', animation: 'zoom-pulse', color: '#A855F7', actor: 'professional_deep_voice', framing: 'PICTURE_IN_PICTURE' },
      { timestamp: 10.0, type: 'metrics', text: 'Real Case Study: 10x Speed with Zero Crashes', subtitle: 'Autonomous execution completed in 12 seconds with 100% verified test passes.', animation: 'glow-rise', color: '#F59E0B', actor: 'professional_deep_voice', framing: 'PICTURE_IN_PICTURE' },
      { timestamp: 12.0, type: 'story', text: 'I spent months battling fragile prompt chains.', subtitle: 'Switching to hierarchical supervisor swarms changed everything.', animation: 'fade-down', color: '#8B5CF6', actor: 'professional_deep_voice', framing: 'CLOSE_UP' },
      { timestamp: 14.5, type: 'cta', text: '👉 Subscribe to NEXO KIDS for Production AI Blueprints', subtitle: 'Star the GitHub repo, build your swarm, and I\'ll see you in the next video!', animation: 'pulse-badge', color: '#FF2A55', actor: 'professional_deep_voice', framing: 'FULLSCREEN_PRESENTER' }
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
  <title>Smart Video Content System — Engaging Human Presence Architecture</title>
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
      max-width: 1120px;
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
      max-width: 1120px;
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

    /* HUMAN PRESENCE INSET CAMERA (Picture-in-Picture / Split-Screen / Fullscreen) */
    .creator-pip-box {
      position: absolute;
      bottom: 24px;
      right: 24px;
      width: 240px;
      height: 155px;
      background: #0A0D18;
      border: 2px solid var(--theme-color);
      border-radius: 14px;
      overflow: hidden;
      z-index: 25;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.75), 0 0 25px var(--theme-glow);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .creator-pip-box.fullscreen-mode {
      inset: 0;
      width: 100%;
      height: 100%;
      border-radius: 0;
      border: none;
      z-index: 10;
    }

    .creator-pip-box.split-mode {
      top: 0;
      bottom: 0;
      left: 0;
      right: auto;
      width: 44%;
      height: 100%;
      border-radius: 0;
      border: none;
      border-right: 3px solid var(--theme-color);
      z-index: 15;
    }

    #creator-webcam {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: none;
    }

    .creator-avatar-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.4) 100%);
    }

    .avatar-head {
      font-size: 2.4rem;
      filter: drop-shadow(0 0 12px var(--theme-color));
    }

    .voice-bars {
      display: flex;
      gap: 3px;
      align-items: center;
      height: 16px;
    }

    .voice-bars span {
      width: 4px;
      height: 6px;
      background: var(--theme-color);
      border-radius: 2px;
      animation: wave 1s infinite alternate;
    }
    .voice-bars span:nth-child(2) { animation-delay: 0.2s; }
    .voice-bars span:nth-child(3) { animation-delay: 0.4s; }
    .voice-bars span:nth-child(4) { animation-delay: 0.6s; }

    @keyframes wave {
      from { height: 4px; }
      to { height: 16px; }
    }

    .pip-tag {
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: rgba(0, 0, 0, 0.85);
      border: 1px solid var(--theme-color);
      color: var(--theme-color);
      font-family: var(--mono);
      font-size: 0.68rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      pointer-events: none;
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
      max-width: 820px;
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
      font-size: 1.65rem;
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
      flex-wrap: wrap;
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

    .btn-highlight {
      background: rgba(59, 130, 246, 0.2);
      border-color: var(--theme-color);
      color: #93C5FD;
    }

    .time-indicator {
      font-family: var(--mono);
      font-size: 0.85rem;
      color: #94A3B8;
    }

    /* PRODUCTION SETUP & 12-MINUTE BLUEPRINT ACCORDION */
    .production-card {
      width: 100%;
      max-width: 1120px;
      background: rgba(16, 20, 32, 0.85);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 1.75rem 2rem;
      margin-top: 1.5rem;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
    }

    .production-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border);
    }

    .production-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #FFF;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .setup-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .setup-box {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1rem;
    }

    .setup-box-title {
      font-size: 0.82rem;
      font-family: var(--mono);
      font-weight: 700;
      color: var(--theme-color);
      margin-bottom: 0.5rem;
    }

    .setup-list {
      list-style: none;
      font-size: 0.82rem;
      color: #CBD5E1;
    }

    .setup-list li {
      margin-bottom: 0.35rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    /* 12-Minute Storyboard Tabs */
    .storyboard-nav {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }

    .sb-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      color: #94A3B8;
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      font-size: 0.78rem;
      font-family: var(--mono);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }

    .sb-btn:hover {
      color: #FFF;
      border-color: var(--theme-color);
    }

    .sb-btn.active {
      background: var(--theme-color);
      color: #000;
      font-weight: 700;
    }

    .script-teleprompter {
      background: #090C16;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.25rem;
      font-size: 0.9rem;
      color: #E2E8F0;
      line-height: 1.6;
    }

    .notes-box {
      margin-top: 0.75rem;
      font-size: 0.8rem;
      color: #94A3B8;
      border-left: 3px solid var(--theme-color);
      padding-left: 0.75rem;
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
      <span>Engaging Human Presence Engine</span>
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
      <a href="/hybrid-studio" class="nav-link" style="border-color: #3B82F6; background: rgba(59, 130, 246, 0.15); color: #93C5FD;">
        🎙️ OBS Hybrid Studio
      </a>
      <a href="/voiceover-studio" class="nav-link" style="border-color: #10B981; background: rgba(16, 185, 129, 0.15); color: #6EE7B7;">
        🗣️ Voiceover Studio
      </a>
      <a href="/workflow" class="nav-link" style="border-color: #6366F1; background: rgba(99, 102, 241, 0.15); color: #C7D2FE;">
        🚀 4-Day Roadmap
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

      <!-- HUMAN PRESENCE INSET CAMERA (Picture-in-Picture / Split-Screen / Fullscreen) -->
      <div id="creator-pip" class="creator-pip-box" title="Human Presence PiP Mode">
        <video id="creator-webcam" autoplay playsinline muted></video>
        <div id="creator-avatar" class="creator-avatar-placeholder">
          <div class="avatar-head">👨‍🏫</div>
          <div class="voice-bars">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div class="pip-tag">
          <span class="actor-pulse"></span>
          <span id="pip-tag-text">YOU ON CAMERA</span>
        </div>
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
        <button class="btn-action btn-highlight" id="webcamToggleBtn" onclick="toggleCreatorWebcam()">
          📹 Toggle Creator Webcam (PiP)
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

  <!-- PRODUCTION SETUP & 12-MINUTE SCRIPT GUIDE -->
  <div class="production-card">
    <div class="production-header">
      <div class="production-title">
        <span>🎬 Human Presence Production Blueprint (12-Minute Standard)</span>
      </div>
      <span class="badge-pill">CREATOR SETUP</span>
    </div>

    <!-- Production Setup Checklist -->
    <div class="setup-grid">
      <div class="setup-box">
        <div class="setup-box-title">📷 CAMERA SETUP</div>
        <ul class="setup-list">
          <li>✓ 1080p minimum webcam or phone</li>
          <li>✓ Positioned at eye level (not looking down)</li>
          <li>✓ Steady tripod with soft diffusion</li>
        </ul>
      </div>

      <div class="setup-box">
        <div class="setup-box-title">🛋️ LOCATION & LIGHTING</div>
        <ul class="setup-list">
          <li>✓ Clean background (office, bookshelf, plant)</li>
          <li>✓ Natural key light + soft ring light</li>
          <li>✓ Sound-dampened quiet recording room</li>
        </ul>
      </div>

      <div class="setup-box">
        <div class="setup-box-title">🎙️ AUDIO SETUP</div>
        <ul class="setup-list">
          <li>✓ Cardioid USB mic (AT2020, Blue Yeti)</li>
          <li>✓ 6-8 inches from mouth with pop filter</li>
          <li>✓ Over-ear headphones for zero feedback</li>
        </ul>
      </div>
    </div>

    <!-- 12-Minute Scene Navigation Tabs -->
    <div class="storyboard-nav" role="tablist">
      <button class="sb-btn active" onclick="jumpToScene(0, 'FULLSCREEN_PRESENTER')">[00:00-00:30] INTRO (You on Camera)</button>
      <button class="sb-btn" onclick="jumpToScene(3, 'SPLIT_SCREEN')">[00:30-02:00] PROBLEM (Split Screen)</button>
      <button class="sb-btn" onclick="jumpToScene(6.5, 'PICTURE_IN_PICTURE')">[02:00-08:00] MAIN TEACHING (3 Layers)</button>
      <button class="sb-btn" onclick="jumpToScene(9.5, 'PICTURE_IN_PICTURE')">[08:00-10:00] REAL EXAMPLES (Case Study)</button>
      <button class="sb-btn" onclick="jumpToScene(12, 'CLOSE_UP')">[10:00-11:30] YOUR STORY (Close-Up)</button>
      <button class="sb-btn" onclick="jumpToScene(14.5, 'FULLSCREEN_PRESENTER')">[11:30-12:00] CTA (You + Animated Text)</button>
    </div>

    <!-- Dynamic Teleprompter Box -->
    <div class="script-teleprompter" id="teleprompterText">
      <strong>[00:00-00:30] INTRO SCRIPT:</strong><br>
      "Hey everyone! I'm about to show you Python basics. By the end of this, you'll be able to write your first program. Let's go!"
      <div class="notes-box">
        <strong>Production Notes:</strong> Direct eye contact with camera &bull; Warm natural smile &bull; Conversational tone &bull; Gentle hand gestures.
      </div>
    </div>
  </div>

  <!-- BEFORE VS AFTER TRANSFORMATION SHOWCASE -->
  <div class="production-card" style="margin-top: 1.5rem;">
    <div class="production-header">
      <div class="production-title">
        <span>📊 Transformation Case Study: Python Tutorial Video</span>
      </div>
      <span class="badge-pill" style="background: #10B981; color: #000;">PROVEN RESULTS</span>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; margin-top: 1rem;">
      <!-- BEFORE CARD -->
      <div style="background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 1.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(239, 68, 68, 0.2); padding-bottom: 0.5rem;">
          <strong style="color: #EF4444; font-size: 1.05rem;">❌ BEFORE (Slideshow Disaster)</strong>
          <span style="font-family: var(--mono); font-size: 0.72rem; background: rgba(239, 68, 68, 0.2); color: #FCA5A5; padding: 0.15rem 0.5rem; border-radius: 4px;">2 VIEWS</span>
        </div>
        <ul style="list-style: none; font-size: 0.85rem; color: #CBD5E1; display: flex; flex-direction: column; gap: 0.4rem;">
          <li>✗ Just static slides with plain bullet points</li>
          <li>✗ Robotic text-to-speech voice reading words</li>
          <li>✗ Zero human presence or eye contact</li>
          <li>✗ Boring background music with muffled audio</li>
          <li>✗ No engagement or real story connection</li>
          <li>⚠️ <strong>Audience Retention:</strong> Drops off at 30 seconds</li>
          <li>📉 <strong>Final Result:</strong> 2 views, 0 subscribers</li>
        </ul>
      </div>

      <!-- AFTER CARD -->
      <div style="background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 1.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(16, 185, 129, 0.2); padding-bottom: 0.5rem;">
          <strong style="color: #10B981; font-size: 1.05rem;">✅ AFTER (Human Presence)</strong>
          <span style="font-family: var(--mono); font-size: 0.72rem; background: rgba(16, 185, 129, 0.2); color: #6EE7B7; padding: 0.15rem 0.5rem; border-radius: 4px;">2,000+ VIEWS</span>
        </div>
        <ul style="list-style: none; font-size: 0.85rem; color: #CBD5E1; display: flex; flex-direction: column; gap: 0.4rem;">
          <li>✓ You on camera + Split screen + Working code</li>
          <li>✓ Natural conversational voice (warm, enthusiastic)</li>
          <li>✓ Real problem empathy + personal breakthrough story</li>
          <li>✓ Studio audio (-6dB normalized) + subtle BGM</li>
          <li>✓ 6-stage video pacing with kinetic highlights</li>
          <li>🔥 <strong>Audience Retention:</strong> 15+ minute average watch time</li>
          <li>📈 <strong>Final Result:</strong> 2,000+ views, 500+ subscribers, 50+ comments</li>
        </ul>
      </div>
    </div>

    <div style="margin-top: 1.25rem; background: rgba(0, 0, 0, 0.4); border-left: 4px solid var(--theme-color); padding: 0.85rem 1.2rem; border-radius: 8px; font-size: 0.88rem; color: #E2E8F0;">
      <strong>The Fundamental Difference:</strong> Before was robotic, impersonal, and boring. After is human, relatable, and deeply engaging.
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
    let isWebcamActive = false;
    let webcamStream = null;

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
      
      // Single debounced timeupdate listener:
      // Prevents listener leaks, avoids duplicate re-renders,
      // and guarantees human-like precision even when seeking!
      audio.ontimeupdate = () => {
        const cur = audio.currentTime;
        
        const currentVisual = visualsData
          .filter(v => cur >= v.timestamp)
          .sort((a, b) => b.timestamp - a.timestamp)[0];

        if (currentVisual && currentVisual.timestamp !== activeVisualTimestamp) {
          activeVisualTimestamp = currentVisual.timestamp;
          updateVisual(currentVisual);
        }
      };
    };

    // 4. Update Visual Overlay & Camera Framing
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

      // Adjust Camera Framing
      if (visual.framing) {
        setCameraFraming(visual.framing);
      }

      // Play neural Web Speech synthesis fallback
      if (isSpeechEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(visual.text);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    }

    // Camera Framing Controller
    function setCameraFraming(framing) {
      const pip = document.getElementById('creator-pip');
      if (!pip) return;
      pip.classList.remove('fullscreen-mode', 'split-mode');
      if (framing === 'FULLSCREEN_PRESENTER' || framing === 'CLOSE_UP') {
        pip.classList.add('fullscreen-mode');
      } else if (framing === 'SPLIT_SCREEN') {
        pip.classList.add('split-mode');
      }
    }

    // Toggle Creator Webcam
    async function toggleCreatorWebcam() {
      const webcamEl = document.getElementById('creator-webcam');
      const avatarEl = document.getElementById('creator-avatar');
      const btn = document.getElementById('webcamToggleBtn');
      const pipTagText = document.getElementById('pip-tag-text');

      if (!isWebcamActive) {
        try {
          webcamStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: false
          });
          if (webcamEl) {
            webcamEl.srcObject = webcamStream;
            webcamEl.style.display = 'block';
          }
          if (avatarEl) avatarEl.style.display = 'none';
          if (btn) btn.textContent = '📹 Stop Creator Webcam';
          if (pipTagText) pipTagText.textContent = 'LIVE WEBCAM ON';
          isWebcamActive = true;
        } catch (err) {
          alert('Camera notification: Webcam access was not granted (' + err.message + '). Displaying interactive Human Presence Avatar simulation.');
          if (avatarEl) avatarEl.style.display = 'flex';
          if (webcamEl) webcamEl.style.display = 'none';
          if (pipTagText) pipTagText.textContent = 'AI AVATAR ACTIVE';
        }
      } else {
        if (webcamStream) {
          webcamStream.getTracks().forEach(t => t.stop());
          webcamStream = null;
        }
        if (webcamEl) webcamEl.style.display = 'none';
        if (avatarEl) avatarEl.style.display = 'flex';
        if (btn) btn.textContent = '📹 Toggle Creator Webcam (PiP)';
        if (pipTagText) pipTagText.textContent = 'YOU ON CAMERA';
        isWebcamActive = false;
      }
    }

    // 12-Minute Scene Scrubber
    function jumpToScene(timestamp, framing) {
      const video = document.getElementById('main-video');
      const audio = document.getElementById('voiceover-audio');
      if (video) video.currentTime = timestamp;
      if (audio) audio.currentTime = timestamp;
      activeVisualTimestamp = null;
      setCameraFraming(framing);

      document.querySelectorAll('.sb-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(timestamp.toString()));
      });

      const teleprompter = document.getElementById('teleprompterText');
      if (teleprompter) {
        const matchingVisual = activeVisuals.find(v => Math.abs(v.timestamp - timestamp) < 0.8) || activeVisuals[0];
        if (matchingVisual) {
          teleprompter.innerHTML = '<strong>' + (matchingVisual.type || 'SCENE').toUpperCase() + ' SCRIPT:</strong><br>'
            + '"' + matchingVisual.subtitle + '"'
            + '<div class="notes-box"><strong>Production Notes:</strong> ' + matchingVisual.text + ' &bull; Camera Framing: ' + framing + '</div>';
        }
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
