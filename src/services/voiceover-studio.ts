export interface VoiceoverSection {
  title: string;
  durationSeconds: number;
  direction: string;
  tone: string;
  script: string;
}

export const sampleVoiceoverScripts: Record<string, VoiceoverSection[]> = {
  python: [
    {
      title: "INTRO - 30 SECONDS",
      durationSeconds: 30,
      direction: "Warm, friendly energy. Smile while speaking directly to the camera.",
      tone: "Friendly & Inviting",
      script: `[WARM SMILE] Hey everyone, it's Alex!

Today I'm showing you how to build production-ready asynchronous Python backends that don't choke under heavy traffic.

This is really important because traditional blocking scripts waste server memory and stall whenever your database gets busy.

So stick with me for the next few minutes, and by the end, you'll know exactly how to structure your async event loops like a seasoned staff engineer.

[EXCITED] Let's jump in!`
    },
    {
      title: "PROBLEM STATEMENT - 90 SECONDS",
      durationSeconds: 90,
      direction: "Sympathetic, relatable. Lower pitch slightly to connect with their frustration.",
      tone: "Relatable & Empathetic",
      script: `[LOWER VOICE] Here's what I see most developers doing wrong when they build microservices...

They write synchronous database calls inside REST loops, which leads to sudden latency spikes under traffic.

Then, they try throwing more CPU threads at the problem, which costs thousands of dollars on AWS every single month.

[PAUSE 1s] And worst of all? A single slow third-party API can freeze your entire application, leaving customers staring at broken spinners.

Sound familiar? Yeah, I've been there too.

[SLOW DOWN] In fact, early in my career, this exact mistake crashed our checkout server during a Black Friday sale. It took us six hours to recover, and it cost our team massive revenue. That's the moment I realized there had to be a cleaner, better architectural way.

And that's exactly what I'm sharing with you today.`
    },
    {
      title: "STEP 1 - 90 SECONDS",
      durationSeconds: 90,
      direction: "Confident, encouraging. Make the technical steps sound clear and actionable.",
      tone: "Instructive & Clear",
      script: `[ENERGETIC] Alright, let's dive right into Step 1: Asyncio TaskGroups and non-blocking I/O.

Now this might sound complicated at first, but it's actually really simple once you see the pattern.

Here's what you do:

First, swap out standard blocking network requests for an asynchronous HTTP client like httpx or aiohttp.

Second, wrap your concurrent background tasks inside Python 3.11's asyncio.TaskGroup context manager.

And third, handle task cancellation cleanly so child routines don't leave lingering orphan sockets.

[WARM SMILE] See? Not that hard, right?

Here's why this step matters so much: [PAUSE 0.5s] by letting the event loop manage idle I/O wait times, your server stays lightning-fast and responsive while handling thousands of live concurrent connections.`
    },
    {
      title: "STEP 2 - 90 SECONDS",
      durationSeconds: 90,
      direction: "Energetic, slightly faster pace. Build momentum and highlight real-world wins.",
      tone: "Momentum & Mastery",
      script: `[SPEED UP] Okay, now that you've got Step 1 down, Step 2 is where things really start to click into place.

Step 2 is all about connection pooling and backpressure management.

Watch what happens on screen when we benchmark the before and after:

Under standard threading, response times spiked past 1,200 milliseconds. But look at this new graph with async connection pooling: [PAUSE 1s] latency drops straight down to 140 milliseconds with zero dropped packets.

[RAISE VOICE] That's exactly the kind of stability we want in production!

The key thing to remember here: never create ad-hoc database connections inside per-request handler loops. A lot of engineers skip connection pools and wonder why their memory leaks. Don't make that mistake.`
    },
    {
      title: "REAL EXAMPLE - 60 SECONDS",
      durationSeconds: 60,
      direction: "Proud, genuine enthusiasm for a real success story.",
      tone: "Proud & Evidence-Driven",
      script: `[WARM SMILE] Let me show you a real-world example.

I was mentoring a junior engineer named Marcus, and his team was completely stuck with an ETL pipeline that took over four hours every night.

They followed this exact async TaskGroup blueprint, and here's what happened:

Their nightly pipeline runtime dropped from 4 hours down to just 18 minutes.

Their AWS container cluster memory usage dropped by 65%.

And they achieved 100% test reliability with zero timeouts.

[EXCITED] In just two weeks, they went from feeling overwhelmed to winning the engineering excellence award. And Marcus told me: "This completely transformed how I think about system design." That's the exact breakthrough I want for you.`
    },
    {
      title: "YOUR STORY - 60 SECONDS",
      durationSeconds: 60,
      direction: "Vulnerable, authentic. Lean slightly forward with genuine passion.",
      tone: "Vulnerable & Authentic",
      script: `[LOWER VOICE / SLOW DOWN] You know, three years ago, I didn't know any of this either.

I was working late nights, constantly firefighting server outages, and honestly feeling like I wasn't cut out for senior engineering.

Then a veteran staff architect sat down with me and showed me how modern event loops actually execute under the hood. That one conversation changed my entire career trajectory.

[PAUSE 1s] That's why I'm so passionate about breaking down these concepts for you on this channel. I know exactly what it's like to feel stuck in tutorial hell.

And I know how life-changing it is when you finally see your code perform effortlessly in production.`
    },
    {
      title: "CALL-TO-ACTION - 30 SECONDS",
      durationSeconds: 30,
      direction: "Warm, direct, friendly. Talk to them like an encouraging friend.",
      tone: "Friendly & Action-Oriented",
      script: `[WARM SMILE] Alright, here's what I want you to do right now.

Don't just close this tab and move on. Go clone the GitHub starter repo today while this pattern is fresh in your mind.

And then I want to hear from you in the comments below: what was the biggest "aha" moment for you in this breakdown?

If this video helped you, please hit subscribe and ring the bell. I'm dropping deep-dive architectural tutorials just like this every single week.

Thanks so much for hanging out with me, [PAUSE 0.5s] and I'll see you in the next one!`
    }
  ]
};

export function getVoiceoverStudioHtml(): string {
  const defaultScript = JSON.stringify(sampleVoiceoverScripts.python);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Natural Voiceover Studio — Conversational Teleprompter & Audio EQ Guide</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #10B981;
      --primary-glow: rgba(16, 185, 129, 0.4);
      --bg: #070B14;
      --card-bg: rgba(14, 20, 34, 0.9);
      --border: rgba(255, 255, 255, 0.1);
      --font-main: 'Plus Jakarta Sans', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      color: #F8FAFC;
      font-family: var(--font-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      line-height: 1.6;
    }

    /* Header Nav */
    .studio-header {
      width: 100%;
      max-width: 1200px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(12, 17, 30, 0.85);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1rem 1.5rem;
      margin-bottom: 1.5rem;
      backdrop-filter: blur(12px);
      flex-wrap: wrap;
      gap: 1rem;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-pill {
      background: linear-gradient(135deg, #10B981, #059669);
      color: #000;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.25rem 0.65rem;
      border-radius: 8px;
      font-family: var(--font-mono);
      letter-spacing: 0.5px;
    }

    .nav-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border);
      color: #F1F5F9;
      padding: 0.5rem 1rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: var(--primary);
      transform: translateY(-1px);
    }

    .btn-primary {
      background: linear-gradient(135deg, #10B981, #059669);
      color: #000;
      font-weight: 700;
      border: none;
      box-shadow: 0 4px 15px var(--primary-glow);
    }

    /* Teleprompter Stage & Layout */
    .studio-grid {
      width: 100%;
      max-width: 1200px;
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 1.5rem;
    }

    @media (max-width: 1024px) {
      .studio-grid { grid-template-columns: 1fr; }
    }

    /* Left: Teleprompter Viewport */
    .teleprompter-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6);
    }

    .prompter-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem;
      background: rgba(0, 0, 0, 0.4);
      padding: 0.75rem 1rem;
      border-radius: 12px;
      border: 1px solid var(--border);
    }

    .prompter-ctrl-group {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .prompter-viewport {
      position: relative;
      width: 100%;
      height: 480px;
      background: #040711;
      border: 2px solid var(--primary);
      border-radius: 14px;
      overflow-y: scroll;
      scroll-behavior: smooth;
      padding: 2.5rem 3rem;
      box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.8), 0 0 25px var(--primary-glow);
    }

    .prompter-viewport.mirror-mode {
      transform: scaleX(-1);
    }

    /* Eye-level indicator line */
    .eye-line-guide {
      position: absolute;
      top: 38%;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba(16, 185, 129, 0.35);
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.7);
      pointer-events: none;
      z-index: 10;
    }

    .eye-line-label {
      position: absolute;
      right: 14px;
      top: -12px;
      background: #10B981;
      color: #000;
      font-size: 0.65rem;
      font-family: var(--font-mono);
      font-weight: 800;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
    }

    .script-content {
      font-size: 1.55rem;
      line-height: 1.85;
      color: #F8FAFC;
      letter-spacing: -0.2px;
      transition: font-size 0.2s ease;
    }

    .section-block {
      margin-bottom: 3.5rem;
      padding-bottom: 2rem;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
    }

    .section-header-tag {
      font-family: var(--font-mono);
      font-size: 0.95rem;
      color: var(--primary);
      font-weight: 800;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .direction-callout {
      background: rgba(16, 185, 129, 0.12);
      border-left: 4px solid var(--primary);
      padding: 0.5rem 0.85rem;
      border-radius: 6px;
      font-size: 0.85rem;
      color: #A7F3D0;
      margin-bottom: 1.25rem;
      font-family: var(--font-mono);
    }

    /* Vocal variety tag highlights */
    .cue-tag {
      background: #EF4444;
      color: #FFF;
      font-size: 0.72rem;
      font-family: var(--font-mono);
      font-weight: 800;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      margin-right: 0.4rem;
      vertical-align: middle;
      display: inline-block;
    }

    .cue-smile { background: #10B981; color: #000; }
    .cue-slow { background: #3B82F6; color: #FFF; }
    .cue-pause { background: #F59E0B; color: #000; }
    .cue-lower { background: #8B5CF6; color: #FFF; }
    .cue-speed { background: #EC4899; color: #FFF; }

    /* Right Sidebar: Rules & Audio EQ Guide */
    .sidebar-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .sidebar-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .card-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #FFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border);
    }

    .rule-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.75rem;
      font-size: 0.8rem;
    }

    .rule-box strong { color: var(--primary); }

    /* Visual EQ Curve Graphic */
    .eq-curve-box {
      width: 100%;
      height: 90px;
      background: #030712;
      border-radius: 8px;
      border: 1px solid var(--border);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .eq-curve-box svg {
      width: 100%;
      height: 100%;
    }

    /* 10 Professional Voiceover Tips */
    .tips-numbered-list {
      list-style: decimal;
      padding-left: 1.2rem;
      font-size: 0.78rem;
      color: #CBD5E1;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .slider-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.78rem;
      font-family: var(--font-mono);
      color: #94A3B8;
    }

    .slider-group input[type="range"] {
      accent-color: var(--primary);
      cursor: pointer;
    }
  </style>
</head>
<body>

  <!-- Header Nav -->
  <header class="studio-header">
    <div class="brand-section">
      <span class="brand-pill">VOICEOVER PRO</span>
      <h1 style="font-size: 1.15rem; font-weight: 800;">Natural Voiceover Studio & Teleprompter</h1>
    </div>

    <div class="nav-actions">
      <a href="/hybrid-studio" class="btn">
        🎙️ OBS Hybrid Studio
      </a>
      <a href="/workflow" class="btn" style="border-color: #6366F1; color: #C7D2FE;">
        🚀 4-Day Roadmap
      </a>
      <a href="/smart-video?topic=python" class="btn">
        🎬 Smart Video Player
      </a>
      <button class="btn btn-primary" onclick="readScriptOutLoud()">
        🔊 Listen (Neural AI Voice)
      </button>
    </div>
  </header>

  <!-- Main Grid -->
  <div class="studio-grid">

    <!-- Left: Teleprompter Card -->
    <div class="teleprompter-card">
      <div class="prompter-toolbar">
        <div class="prompter-ctrl-group">
          <button class="btn btn-primary" id="scrollPlayBtn" onclick="toggleScroll()">
            ▶ Start Teleprompter
          </button>
          <button class="btn" onclick="resetScroll()">
            ↺ Top
          </button>
          <button class="btn" id="mirrorBtn" onclick="toggleMirror()">
            🪞 Mirror Mode: OFF
          </button>
        </div>

        <div class="prompter-ctrl-group">
          <div class="slider-group">
            <span>SPEED:</span>
            <input type="range" id="speedSlider" min="1" max="10" value="3" oninput="updateSpeed()">
            <span id="speedValue">3x</span>
          </div>

          <div class="slider-group">
            <span>SIZE:</span>
            <input type="range" id="sizeSlider" min="18" max="36" value="24" oninput="updateFontSize()">
            <span id="sizeValue">24px</span>
          </div>
        </div>
      </div>

      <!-- Live Scrolling Prompter Viewport -->
      <div class="prompter-viewport" id="prompterViewport">
        <div class="eye-line-guide">
          <span class="eye-line-label">EYE LEVEL FOCUS</span>
        </div>

        <div class="script-content" id="scriptContent">
          <!-- Populated dynamically with conversational markup -->
        </div>
      </div>
    </div>

    <!-- Right Sidebar -->
    <div class="sidebar-wrapper">

      <!-- 4 Golden Rules Card -->
      <div class="sidebar-card">
        <div class="card-title">
          <span>🎯 4 GOLDEN NATURAL RULES</span>
        </div>

        <div class="rule-box">
          <strong>1. Conversational Language:</strong><br>
          ❌ "The methodology requires implementation"<br>
          ✅ "Here's how to get started - it's pretty simple"
        </div>

        <div class="rule-box">
          <strong>2. Vocal Variety:</strong><br>
          Slow down for core takeaways, speed up for momentum, pause after big ideas.
        </div>

        <div class="rule-box">
          <strong>3. Mandatory Contractions:</strong><br>
          Use <em>"you'll"</em>, <em>"here's"</em>, <em>"that's"</em>, <em>"don't"</em>. Never sound robotic.
        </div>

        <div class="rule-box">
          <strong>4. Authentic Persona:</strong><br>
          Imagine talking to ONE good friend sitting across your desk. Smile while recording.
        </div>
      </div>

      <!-- Studio EQ & Audio Mastering Preset -->
      <div class="sidebar-card">
        <div class="card-title">
          <span>🎛️ STUDIO AUDIO EQ CURVE</span>
          <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--primary);">PRO BROADCAST</span>
        </div>

        <div class="eq-curve-box">
          <svg viewBox="0 0 300 80">
            <!-- Grid Lines -->
            <line x1="0" y1="40" x2="300" y2="40" stroke="rgba(255,255,255,0.1)" stroke-dasharray="3,3"/>
            <!-- 80Hz High Pass Cut, 300Hz Dip, 2.5kHz Presence Boost, 10kHz Air -->
            <path d="M 0,75 Q 30,75 50,42 T 90,46 T 150,40 T 210,24 T 270,30 T 300,32" fill="none" stroke="#10B981" stroke-width="3"/>
            <circle cx="50" cy="42" r="4" fill="#3B82F6"/>
            <circle cx="210" cy="24" r="4" fill="#10B981"/>
            <text x="45" y="32" fill="#93C5FD" font-size="8" font-family="monospace">80Hz HPF</text>
            <text x="195" y="15" fill="#6EE7B7" font-size="8" font-family="monospace">+2.5dB @ 2.5kHz</text>
          </svg>
        </div>

        <div style="font-size: 0.78rem; color: #94A3B8; display: flex; flex-direction: column; gap: 0.25rem;">
          <div>• <strong>High-Pass Filter:</strong> 80Hz (eliminates room rumble)</div>
          <div>• <strong>Presence Boost:</strong> +2.5dB at 2.5kHz (voice clarity)</div>
          <div>• <strong>Compressor:</strong> 3.5:1 ratio, attack 6ms, release 60ms</div>
          <div>• <strong>Master Output:</strong> Normalized between <strong>-6dB and -3dB</strong></div>
        </div>
      </div>

      <!-- 10 Professional Tips -->
      <div class="sidebar-card">
        <div class="card-title">
          <span>🎙️ 10 PRO VOICEOVER TIPS</span>
        </div>
        <ol class="tips-numbered-list">
          <li>Record in a quiet room (close doors & windows).</li>
          <li>Use a decent USB cardioid mic ($50+).</li>
          <li>Drink room-temperature water before recording.</li>
          <li>Do multiple takes (pick the best one).</li>
          <li>Add subtle background ambience/music (-22dB).</li>
          <li>Normalize audio levels in post-production.</li>
          <li>Edit out long pauses, stutters, and "um"s.</li>
          <li>Add sound effects (whoosh, pop) at key moments.</li>
          <li>Mix voiceover peak volume to -6dB to -3dB.</li>
          <li>Add EQ: boost 2kHz–3kHz slightly for warmth.</li>
        </ol>
      </div>

    </div>
  </div>

  <!-- Interactive JavaScript Logic -->
  <script>
    const sections = ${defaultScript};

    let isScrolling = false;
    let scrollTimer = null;
    let scrollSpeed = 3;
    let isMirror = false;
    let isSpeaking = false;

    // Render Script with Highlighted Vocal Cues
    function renderScript() {
      const container = document.getElementById('scriptContent');
      let html = '';

      sections.forEach((sec, idx) => {
        let formatted = sec.script
          .replace(/\\[WARM SMILE\\]/g, '<span class="cue-tag cue-smile">😊 WARM SMILE</span>')
          .replace(/\\[LOWER VOICE\\]/g, '<span class="cue-tag cue-lower">🤫 LOWER VOICE</span>')
          .replace(/\\[LOWER VOICE \\/ SLOW DOWN\\]/g, '<span class="cue-tag cue-lower">🤫 LOWER & SLOW</span>')
          .replace(/\\[SLOW DOWN\\]/g, '<span class="cue-tag cue-slow">🐢 SLOW DOWN</span>')
          .replace(/\\[SPEED UP\\]/g, '<span class="cue-tag cue-speed">⚡ SPEED UP</span>')
          .replace(/\\[ENERGETIC\\]/g, '<span class="cue-tag cue-speed">🔥 ENERGETIC</span>')
          .replace(/\\[EXCITED\\]/g, '<span class="cue-tag cue-speed">🎉 EXCITED</span>')
          .replace(/\\[RAISE VOICE\\]/g, '<span class="cue-tag cue-speed">📢 RAISE VOICE</span>')
          .replace(/\\[PAUSE 1s\\]/g, '<span class="cue-tag cue-pause">⏸️ PAUSE 1s</span>')
          .replace(/\\[PAUSE 0.5s\\]/g, '<span class="cue-tag cue-pause">⏸️ PAUSE 0.5s</span>')
          .replace(/\\n/g, '<br>');

        html += \`
          <div class="section-block" id="section-\${idx}">
            <div class="section-header-tag">\${sec.title} • \${sec.durationSeconds}s (\${sec.tone})</div>
            <div class="direction-callout"><strong>DIRECTION:</strong> \${sec.direction}</div>
            <p>\${formatted}</p>
          </div>
        \`;
      });

      container.innerHTML = html;
    }
    renderScript();

    // Teleprompter Auto-Scroll Engine
    function toggleScroll() {
      isScrolling = !isScrolling;
      const btn = document.getElementById('scrollPlayBtn');
      const viewport = document.getElementById('prompterViewport');

      if (isScrolling) {
        btn.textContent = '⏸ Pause Teleprompter';
        btn.classList.add('btn-primary');

        scrollTimer = setInterval(() => {
          viewport.scrollTop += (scrollSpeed * 0.5);
          if (viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight) {
            toggleScroll();
          }
        }, 30);
      } else {
        btn.textContent = '▶ Start Teleprompter';
        clearInterval(scrollTimer);
      }
    }

    function resetScroll() {
      const viewport = document.getElementById('prompterViewport');
      viewport.scrollTop = 0;
      if (isScrolling) toggleScroll();
    }

    function updateSpeed() {
      const slider = document.getElementById('speedSlider');
      scrollSpeed = parseInt(slider.value, 10);
      document.getElementById('speedValue').textContent = scrollSpeed + 'x';
    }

    function updateFontSize() {
      const slider = document.getElementById('sizeSlider');
      const px = slider.value + 'px';
      document.getElementById('scriptContent').style.fontSize = px;
      document.getElementById('sizeValue').textContent = px;
    }

    function toggleMirror() {
      isMirror = !isMirror;
      const viewport = document.getElementById('prompterViewport');
      const btn = document.getElementById('mirrorBtn');
      viewport.classList.toggle('mirror-mode', isMirror);
      btn.textContent = isMirror ? '🪞 Mirror Mode: ON' : '🪞 Mirror Mode: OFF';
    }

    // Listen to Script using Web Speech Synthesis
    function readScriptOutLoud() {
      if (!window.speechSynthesis) {
        alert('Web Speech API not supported in this browser.');
        return;
      }

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        return;
      }

      const rawText = sections.map(s => s.script.replace(/\\[.*?\\]/g, '')).join(' ');
      const utterance = new SpeechSynthesisUtterance(rawText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onend = () => { isSpeaking = false; };
      window.speechSynthesis.speak(utterance);
      isSpeaking = true;
    }
  </script>
</body>
</html>`;
}
