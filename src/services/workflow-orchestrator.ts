export interface WorkflowDay {
  dayNumber: number;
  dayTitle: string;
  badge: string;
  steps: Array<{
    stepNumber: number;
    title: string;
    details: string[];
    proTip?: string;
  }>;
}

export const complete4DayWorkflow: WorkflowDay[] = [
  {
    dayNumber: 1,
    dayTitle: "PRE-PRODUCTION",
    badge: "DAY 1",
    steps: [
      {
        stepNumber: 1,
        title: "Write Conversational Script",
        details: [
          "Create detailed script with all spoken dialogue (no robotic jargon).",
          "Mark emotional cues: [WARM SMILE], [LOWER VOICE], [ENERGETIC], [PAUSE 1s].",
          "Note exact visual changes, screen shares, and camera framing cut points.",
          "Estimate runtime aiming for standard 12-15 minute educational depth."
        ],
        proTip: "Use the built-in /voiceover-studio teleprompter to rehearse pacing at 130-150 WPM."
      },
      {
        stepNumber: 2,
        title: "Gather Visuals & B-Roll",
        details: [
          "Record high-resolution software and code terminal demos (1080p minimum).",
          "Collect contextual B-roll footage (tech workspaces, diagrams, server rooms).",
          "Download royalty-free background ambient music and SFX (whooshes, dings).",
          "Prepare graphic overlays: lower-thirds, arrow callouts, and code highlight boxes."
        ]
      },
      {
        stepNumber: 3,
        title: "Set Up Recording Hardware",
        details: [
          "Clean workspace and eliminate background clutter.",
          "Position webcam strictly at eye level with soft three-point lighting.",
          "Mount USB microphone 6-8 inches from mouth with pop filter.",
          "Configure OBS Studio scenes: Scene 1 Intro, Scene 2 PiP Hybrid, Scene 3 Outro."
        ],
        proTip: "Download your pre-configured OBS Scene Collection via /api/obs-hybrid/download-scenes."
      },
      {
        stepNumber: 4,
        title: "Prepare & Record Vocals + Camera",
        details: [
          "Do 2 minutes of vocal warm-ups and drink room-temperature water.",
          "Record Scene 1 Intro on camera (multiple takes, keep the most natural one).",
          "Record main voiceover while capturing screen recording on Track 1.",
          "Record Scene 3 Conclusion looking directly into the camera lens with a smile."
        ]
      }
    ]
  },
  {
    dayNumber: 2,
    dayTitle: "VIDEO EDITING (Premiere / DaVinci / CapCut)",
    badge: "DAY 2",
    steps: [
      {
        stepNumber: 1,
        title: "Import Media & Set Project Settings",
        details: [
          "Project Resolution: 1920x1080 (16:9) at 60fps.",
          "Import screen captures, webcam video, vocal stems, BGM, and SFX.",
          "Color space set to Rec.709 Standard."
        ]
      },
      {
        stepNumber: 2,
        title: "Arrange 6-Track NLE Timeline",
        details: [
          "Track 1 (Video): Main screen recording + B-roll footage.",
          "Track 2 (Video): Webcam face cam (30% PiP inset top-right or fullscreen).",
          "Track 3 (Video): Kinetic graphics, arrows, highlight boxes, and lower-thirds.",
          "Track 4 (Audio): Main voiceover narration track.",
          "Track 5 (Audio): Background music (side-chain ducked at -22dB).",
          "Track 6 (Audio): Sound effects (whoosh, chime, pop)."
        ],
        proTip: "Keep face cam active on Track 2 and cut to full presenter every 45-60 seconds."
      },
      {
        stepNumber: 3,
        title: "Sync Voiceover & Visual Timing",
        details: [
          "Align voiceover track with screen capture interactions.",
          "Trim dead air, coughing, and vocal stutters (ripple delete).",
          "Add text overlays at the exact second keywords are spoken."
        ]
      },
      {
        stepNumber: 4,
        title: "Add Smooth Transitions & Micro-Animations",
        details: [
          "0.3s cross-dissolves between major chapter topics.",
          "Subtle 1.05x punch-in digital zooms when emphasizing key code blocks.",
          "Smooth slide-in animations for lower-thirds."
        ]
      },
      {
        stepNumber: 5,
        title: "Audio Mastering & Equalization",
        details: [
          "High-pass filter voiceover at 80Hz (cuts desk rumble).",
          "Presence EQ boost +2.5dB at 2.5kHz–3kHz for vocal articulation.",
          "Compressor with 3.5:1 ratio and safety limiter peaking at -6.0dB to -3.0dB.",
          "Fade out background music smoothly over the final 8 seconds."
        ]
      },
      {
        stepNumber: 6,
        title: "Export Master Video File",
        details: [
          "Format: MP4 (H.264 / HEVC).",
          "Target Bitrate: 8,000–12,000 kbps (CBR/VBR 2-Pass).",
          "Audio: AAC 192–320 kbps at 48kHz Stereo."
        ]
      }
    ]
  },
  {
    dayNumber: 3,
    dayTitle: "THUMBNAIL & SEO OPTIMIZATION",
    badge: "DAY 3",
    steps: [
      {
        stepNumber: 1,
        title: "Create High-CTR Thumbnail",
        details: [
          "Canvas: 1280x720 pixels (under 2MB, PNG/JPEG).",
          "High-contrast color palette with bold visual focal point.",
          "3-4 readable words maximum in bold sans-serif font.",
          "Expressive face showing emotion or eye contact.",
          "High-res logo/emoji for visual intrigue."
        ]
      },
      {
        stepNumber: 2,
        title: "Write High-Ranking Metadata",
        details: [
          "Title under 60 characters with curiosity hook and primary keyword.",
          "Description formatted with clickable chapter timestamps (00:00, 00:30, 02:00, etc.).",
          "Value bullets highlighting 'What You'll Learn'.",
          "15-20 targeted long-tail search tags.",
          "Assign video to official channel series playlist."
        ]
      }
    ]
  },
  {
    dayNumber: 4,
    dayTitle: "PUBLISH & MULTI-CHANNEL DISTRIBUTION",
    badge: "DAY 4",
    steps: [
      {
        stepNumber: 1,
        title: "Upload & Verify on YouTube Studio",
        details: [
          "Upload master MP4 and set custom thumbnail.",
          "Paste optimized description, title, category, and tags.",
          "Upload cleaned SRT/VTT captions (verify 99% accuracy on tech terms).",
          "Set visibility to Scheduled or Public."
        ]
      },
      {
        stepNumber: 2,
        title: "Repurpose for Short-Form Feeds",
        details: [
          "Extract 30-60 second golden breakthrough clip.",
          "Re-frame to 9:16 vertical format with kinetic auto-captions.",
          "Publish to YouTube Shorts, Instagram Reels, and TikTok."
        ]
      },
      {
        stepNumber: 3,
        title: "24-Hour Analytics & Audience Engagement",
        details: [
          "Pin top comment asking viewers an interactive question.",
          "Reply to every comment within the first 2 hours of upload.",
          "Review YouTube Studio Retention Graph at 24 hours to spot drop-off points."
        ]
      }
    ]
  }
];

export const editingChecklistItems = [
  "Voiceover synced precisely with visual screen movements",
  "Face cam appears every 45-60 seconds for human presence",
  "Text overlays & lower-thirds are large and clearly readable",
  "Transitions between chapters are smooth (0.3s fade/slide)",
  "Audio levels normalized to -6dB target with zero clipping",
  "Background music is subtle (-22dB ducked under voiceover)",
  "Sound effects placed strategically on key reveals and zooms",
  "Captions generated and checked for 99% technical accuracy",
  "Intro music hook included in the first 5 seconds",
  "Outro music and subscribe CTA included in final 15 seconds",
  "Call-to-action directs viewers to comment and subscribe",
  "Export settings verified: 1080p60 MP4 at 8,000-12,000 kbps",
  "Full video plays cleanly without frame drops or audio pops"
];

export function getWorkflowMissionControlHtml(): string {
  const daysJson = JSON.stringify(complete4DayWorkflow);
  const checklistJson = JSON.stringify(editingChecklistItems);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Video Production Workflow — Recording to Publishing</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #6366F1;
      --primary-glow: rgba(99, 102, 241, 0.4);
      --bg: #060913;
      --card-bg: rgba(14, 20, 36, 0.9);
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
    .workflow-header {
      width: 100%;
      max-width: 1200px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(12, 17, 32, 0.85);
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
      background: linear-gradient(135deg, #6366F1, #4F46E5);
      color: #FFF;
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
      background: linear-gradient(135deg, #6366F1, #4F46E5);
      color: #FFF;
      font-weight: 700;
      border: none;
      box-shadow: 0 4px 15px var(--primary-glow);
    }

    /* 4-Day Pipeline Tabs */
    .day-tabs-bar {
      width: 100%;
      max-width: 1200px;
      display: flex;
      gap: 0.75rem;
      background: rgba(14, 19, 34, 0.9);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 0.65rem 1rem;
      margin-bottom: 1.5rem;
      overflow-x: auto;
    }

    .day-tab {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      color: #94A3B8;
      padding: 0.5rem 1.1rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .day-tab:hover {
      color: #FFF;
      border-color: var(--primary);
    }

    .day-tab.active {
      background: var(--primary);
      color: #FFF;
      box-shadow: 0 0 15px var(--primary-glow);
    }

    /* Main Content Layout */
    .workflow-grid {
      width: 100%;
      max-width: 1200px;
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 1.5rem;
    }

    @media (max-width: 1024px) {
      .workflow-grid { grid-template-columns: 1fr; }
    }

    /* Left: Steps Card */
    .steps-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6);
    }

    .day-header-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }

    .day-header-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: #FFF;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .step-item-card {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid var(--border);
      border-left: 5px solid var(--primary);
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .step-title-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.05rem;
      font-weight: 700;
      color: #FFF;
    }

    .step-num-pill {
      background: var(--primary);
      color: #FFF;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.15rem 0.55rem;
      border-radius: 6px;
    }

    .step-bullets {
      list-style: none;
      font-size: 0.88rem;
      color: #CBD5E1;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .step-bullets li {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .step-bullets li::before {
      content: "•";
      color: var(--primary);
      font-weight: bold;
      font-size: 1.2rem;
      line-height: 1;
    }

    .pro-tip-box {
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 8px;
      padding: 0.6rem 0.9rem;
      font-size: 0.8rem;
      color: #C7D2FE;
    }

    /* 6-Track NLE Timeline Visualizer */
    .timeline-card {
      background: #040711;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .timeline-title {
      font-size: 0.85rem;
      font-family: var(--font-mono);
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .track-row {
      display: grid;
      grid-template-columns: 120px 1fr;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.75rem;
      font-family: var(--font-mono);
    }

    .track-label {
      color: #94A3B8;
      font-weight: 600;
    }

    .track-block {
      height: 26px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      padding: 0 0.6rem;
      color: #FFF;
      font-weight: 700;
      font-size: 0.72rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .track-v1 { background: #3B82F6; }
    .track-v2 { background: #8B5CF6; }
    .track-v3 { background: #EC4899; }
    .track-a1 { background: #10B981; color: #000; }
    .track-a2 { background: #F59E0B; color: #000; }
    .track-a3 { background: #EF4444; }

    /* Right Sidebar: 13-Item Editing Checklist */
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

    .checklist-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .check-item {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      font-size: 0.8rem;
      color: #CBD5E1;
      cursor: pointer;
      user-select: none;
    }

    .check-item input[type="checkbox"] {
      margin-top: 0.2rem;
      accent-color: var(--primary);
      cursor: pointer;
      width: 15px;
      height: 15px;
    }

    .check-item.checked {
      color: #64748B;
      text-decoration: line-through;
    }

    .progress-bar-box {
      width: 100%;
      height: 6px;
      background: #1E293B;
      border-radius: 3px;
      overflow: hidden;
      margin-top: 0.25rem;
    }

    .progress-fill {
      height: 100%;
      width: 0%;
      background: var(--primary);
      transition: width 0.3s ease;
    }

    .export-settings-card {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.75rem;
      font-size: 0.78rem;
      color: #CBD5E1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .export-settings-card strong { color: var(--primary); }
  </style>
</head>
<body>

  <!-- Header Nav -->
  <header class="workflow-header">
    <div class="brand-section">
      <span class="brand-pill">PRODUCTION ROADMAP</span>
      <h1 style="font-size: 1.15rem; font-weight: 800;">Complete Video Workflow — Recording to Publishing</h1>
    </div>

    <div class="nav-actions">
      <a href="/voiceover-studio" class="btn">
        🗣️ Voiceover Studio
      </a>
      <a href="/hybrid-studio" class="btn">
        🎙️ OBS Hybrid Studio
      </a>
      <a href="/smart-video?topic=python" class="btn">
        🎬 Smart Video Player
      </a>
      <button class="btn btn-primary" onclick="exportTimelineMarkers()">
        📥 Export Chapter Markers (.csv)
      </button>
    </div>
  </header>

  <!-- 4-Day Switcher Tabs -->
  <div class="day-tabs-bar">
    <button class="day-tab active" id="tab-day1" onclick="switchDay(1)">
      📋 DAY 1: PRE-PRODUCTION (Script & Setup)
    </button>
    <button class="day-tab" id="tab-day2" onclick="switchDay(2)">
      ✂️ DAY 2: VIDEO EDITING (6-Track NLE)
    </button>
    <button class="day-tab" id="tab-day3" onclick="switchDay(3)">
      🎨 DAY 3: THUMBNAIL & SEO
    </button>
    <button class="day-tab" id="tab-day4" onclick="switchDay(4)">
      🚀 DAY 4: PUBLISH & DISTRIBUTION
    </button>
  </div>

  <!-- Main Workflow Grid -->
  <div class="workflow-grid">

    <!-- Left: Dynamic Steps Card -->
    <div class="steps-card">
      <div class="day-header-box">
        <div class="day-header-title">
          <span id="dayBadge" class="brand-pill">DAY 1</span>
          <span id="dayTitleText">PRE-PRODUCTION</span>
        </div>
        <span style="font-size: 0.8rem; font-family: var(--font-mono); color: #94A3B8;" id="stepCountText">4 Key Steps</span>
      </div>

      <!-- Rendered Steps Container -->
      <div id="stepsContainer" style="display: flex; flex-direction: column; gap: 1rem;">
        <!-- Populated via JavaScript -->
      </div>

      <!-- 6-Track NLE Timeline Visualizer (Displayed on Day 2) -->
      <div class="timeline-card" id="timelineVisualizer" style="display: none;">
        <div class="timeline-title">🎬 6-TRACK NLE TIMELINE ARCHITECTURE (Premiere / DaVinci / CapCut)</div>
        <div class="track-row">
          <span class="track-label">Track 1 (Video)</span>
          <div class="track-block track-v1">Main Screen Recording (70%) + Contextual B-Roll</div>
        </div>
        <div class="track-row">
          <span class="track-label">Track 2 (Video)</span>
          <div class="track-block track-v2">Webcam / Face Cam (30% PiP Inset Top-Right & Fullscreen Cuts)</div>
        </div>
        <div class="track-row">
          <span class="track-label">Track 3 (Video)</span>
          <div class="track-block track-v3">Kinetic Graphics, Lower-Thirds, Arrow Pointers & Highlights</div>
        </div>
        <div class="track-row">
          <span class="track-label">Track 4 (Audio)</span>
          <div class="track-block track-a1">Main Voiceover Narration (Normalized to -6dB Peak)</div>
        </div>
        <div class="track-row">
          <span class="track-label">Track 5 (Audio)</span>
          <div class="track-block track-a2">Background Music (Side-Chain Ducked at -22dB under Voice)</div>
        </div>
        <div class="track-row">
          <span class="track-label">Track 6 (Audio)</span>
          <div class="track-block track-a3">Sound Effects (Whooshes, Pop Reveals, Ding on Results)</div>
        </div>
      </div>
    </div>

    <!-- Right Sidebar: 13-Item Editing Checklist -->
    <div class="sidebar-wrapper">

      <div class="sidebar-card">
        <div class="card-title">
          <span>✅ EDITING QA CHECKLIST</span>
          <span id="checklistScore" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--primary);">0/13</span>
        </div>
        <div class="progress-bar-box">
          <div class="progress-fill" id="checklistProgressFill"></div>
        </div>
        <div class="checklist-list" id="checklistContainer">
          <!-- Dynamically populated from editingChecklistItems -->
        </div>
      </div>

      <div class="sidebar-card">
        <div class="card-title">
          <span>📦 EXPORT SETTINGS</span>
        </div>
        <div class="export-settings-card">
          <div>• <strong>Resolution:</strong> 1920x1080 (or 4K 3840x2160)</div>
          <div>• <strong>Frame Rate:</strong> 60 FPS (Fluid screen recordings)</div>
          <div>• <strong>Codec:</strong> MP4 (H.264 / HEVC)</div>
          <div>• <strong>Video Bitrate:</strong> 8,000–12,000 kbps (CBR/VBR)</div>
          <div>• <strong>Audio:</strong> AAC Stereo, 192 kbps, 48 kHz</div>
          <div>• <strong>Normalization:</strong> -6.0 dB Peak Target</div>
        </div>
      </div>

    </div>
  </div>

  <!-- Interactive JavaScript Logic -->
  <script>
    const daysData = ${daysJson};
    const checklistItems = ${checklistJson};

    let activeDay = 1;

    // Render Steps for selected Day
    function renderDay(dayNum) {
      activeDay = dayNum;
      const day = daysData.find(d => d.dayNumber === dayNum) || daysData[0];

      document.querySelectorAll('.day-tab').forEach((tab, idx) => {
        tab.classList.toggle('active', idx + 1 === dayNum);
      });

      document.getElementById('dayBadge').textContent = day.badge;
      document.getElementById('dayTitleText').textContent = day.dayTitle;
      document.getElementById('stepCountText').textContent = day.steps.length + ' Key Steps';

      const container = document.getElementById('stepsContainer');
      let html = '';

      day.steps.forEach(step => {
        const bullets = step.details.map(d => '<li>' + d + '</li>').join('');
        const proTip = step.proTip ? '<div class="pro-tip-box">💡 <strong>Pro Tip:</strong> ' + step.proTip + '</div>' : '';

        html += \`
          <div class="step-item-card">
            <div class="step-title-row">
              <span class="step-num-pill">Step \${step.stepNumber}</span>
              <span>\${step.title}</span>
            </div>
            <ul class="step-bullets">\${bullets}</ul>
            \${proTip}
          </div>
        \`;
      });

      container.innerHTML = html;

      // Show NLE Timeline Visualizer on Day 2
      const timeline = document.getElementById('timelineVisualizer');
      if (timeline) {
        timeline.style.display = dayNum === 2 ? 'flex' : 'none';
      }
    }

    function switchDay(dayNum) {
      renderDay(dayNum);
    }

    // Render 13-Item Checklist
    function renderChecklist() {
      const container = document.getElementById('checklistContainer');
      let html = '';

      checklistItems.forEach((item, idx) => {
        html += \`
          <label class="check-item">
            <input type="checkbox" id="chk-\${idx}" onchange="updateChecklistProgress()">
            <span>\${item}</span>
          </label>
        \`;
      });

      container.innerHTML = html;
    }

    function updateChecklistProgress() {
      const inputs = document.querySelectorAll('#checklistContainer input[type="checkbox"]');
      let checked = 0;
      inputs.forEach(input => {
        const parent = input.closest('.check-item');
        if (input.checked) {
          checked++;
          parent.classList.add('checked');
        } else {
          parent.classList.remove('checked');
        }
      });

      const fill = document.getElementById('checklistProgressFill');
      const score = document.getElementById('checklistScore');
      const pct = (checked / inputs.length) * 100;
      fill.style.width = pct + '%';
      score.textContent = checked + '/' + inputs.length;

      if (checked === inputs.length) {
        score.textContent = 'READY TO EXPORT! 🚀';
        score.style.color = '#10B981';
      } else {
        score.style.color = 'var(--primary)';
      }
    }

    // Export Chapter Markers for Premiere / DaVinci Resolve
    function exportTimelineMarkers() {
      const markersCsv = "Marker Name,Description,In,Duration,Marker Type\\n"
        + "00:00:00:00,Intro - Face Cam & Hook,00:00:00:00,00:00:30:00,Chapter\\n"
        + "00:00:30:00,Problem Statement - Split Screen,00:00:30:00,00:01:30:00,Chapter\\n"
        + "00:02:00:00,Step 1 - TaskGroups & Asyncio,00:02:00:00,00:02:00:00,Chapter\\n"
        + "00:04:00:00,Step 2 - Connection Pooling,00:04:00:00,00:04:00:00,Chapter\\n"
        + "00:08:00:00,Real Examples & Case Study,00:08:00:00,00:02:00:00,Chapter\\n"
        + "00:10:00:00,Your Story - Close Up,00:10:00:00,00:01:30:00,Chapter\\n"
        + "00:11:30:00,CTA & Outro Graphic,00:11:30:00,00:00:30:00,Chapter\\n";

      const blob = new Blob([markersCsv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "NEXO_Video_Chapter_Markers.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Initialize
    renderDay(1);
    renderChecklist();
  </script>
</body>
</html>`;
}
