export interface ObsSceneConfig {
  name: string;
  sources: Array<{
    name: string;
    type: string;
    settings?: Record<string, any>;
    pos?: { x: number; y: number };
    scale?: { x: number; y: number };
  }>;
}

export function generateObsSceneCollectionJson(channelName: string = 'NEXO KIDS'): string {
  const collection = {
    name: "Professional Hybrid Video Studio (" + channelName + ")",
    OBSSceneCollectionVersion: 2,
    current_scene: "Scene 1 - INTRO (You Fullscreen)",
    current_program_scene: "Scene 1 - INTRO (You Fullscreen)",
    scene_order: [
      { name: "Scene 1 - INTRO (You Fullscreen)" },
      { name: "Scene 2 - MAIN CONTENT (Screen 70% + PiP 30%)" },
      { name: "Scene 3 - CONCLUSION (You Fullscreen + CTA)" }
    ],
    name_counter: 3,
    sources: [
      {
        id: "scene",
        name: "Scene 1 - INTRO (You Fullscreen)",
        settings: {
          items: [
            {
              name: "Webcam Fullscreen (1080p)",
              visible: true,
              pos: { x: 0, y: 0 },
              scale: { x: 1.0, y: 1.0 }
            },
            {
              name: "USB Microphone (Vocals)",
              visible: true,
              pos: { x: 0, y: 0 }
            },
            {
              name: "Lower Third - Intro Title & Presenter",
              visible: true,
              pos: { x: 80, y: 840 },
              scale: { x: 1.0, y: 1.0 }
            }
          ]
        }
      },
      {
        id: "scene",
        name: "Scene 2 - MAIN CONTENT (Screen 70% + PiP 30%)",
        settings: {
          items: [
            {
              name: "Screen Recording (Main 70%)",
              visible: true,
              pos: { x: 0, y: 0 },
              scale: { x: 0.7, y: 1.0 },
              bounds: { x: 1344, y: 1080 }
            },
            {
              name: "Webcam Inset (Top-Right 30%)",
              visible: true,
              pos: { x: 1344, y: 0 },
              scale: { x: 0.3, y: 0.355 },
              bounds: { x: 576, y: 384 }
            },
            {
              name: "Animated Overlays (Text, Arrows, Highlights)",
              visible: true,
              pos: { x: 0, y: 0 },
              scale: { x: 1.0, y: 1.0 }
            },
            {
              name: "USB Microphone (Vocals)",
              visible: true,
              pos: { x: 0, y: 0 }
            }
          ]
        }
      },
      {
        id: "scene",
        name: "Scene 3 - CONCLUSION (You Fullscreen + CTA)",
        settings: {
          items: [
            {
              name: "Webcam Fullscreen (1080p)",
              visible: true,
              pos: { x: 0, y: 0 },
              scale: { x: 1.0, y: 1.0 }
            },
            {
              name: "USB Microphone (Vocals)",
              visible: true,
              pos: { x: 0, y: 0 }
            },
            {
              name: "Lower Third - Outro Call to Action",
              visible: true,
              pos: { x: 80, y: 840 },
              scale: { x: 1.0, y: 1.0 }
            }
          ]
        }
      },
      {
        id: "dshow_input",
        name: "Webcam Fullscreen (1080p)",
        settings: {
          res_type: 1,
          resolution: "1920x1080",
          frame_interval: 166666,
          buffering: 0
        }
      },
      {
        id: "dshow_input",
        name: "Webcam Inset (Top-Right 30%)",
        settings: {
          res_type: 1,
          resolution: "1280x720",
          frame_interval: 166666,
          buffering: 0
        }
      },
      {
        id: "monitor_capture",
        name: "Screen Recording (Main 70%)",
        settings: {
          capture_cursor: true,
          monitor: 0
        }
      },
      {
        id: "wasapi_input_capture",
        name: "USB Microphone (Vocals)",
        settings: {
          device_id: "default"
        },
        filters: [
          {
            id: "noise_suppress_filter",
            name: "Noise Suppression (RNNoise)",
            settings: { method: "rnnoise" }
          },
          {
            id: "compressor_filter",
            name: "Vocal Compressor",
            settings: {
              ratio: 4.0,
              threshold: -18.0,
              attack_time: 6,
              release_time: 60,
              output_gain: 3.5
            }
          },
          {
            id: "limiter_filter",
            name: "Master Safety Limiter (-6dB)",
            settings: {
              threshold: -6.0,
              release_time: 60
            }
          }
        ]
      },
      {
        id: "browser_source",
        name: "Lower Third - Intro Title & Presenter",
        settings: {
          url: "http://localhost:3001/hybrid-studio/overlays/lower-third?mode=intro",
          width: 1920,
          height: 1080,
          fps: 60,
          reroute_audio: false,
          restart_when_active: true
        }
      },
      {
        id: "browser_source",
        name: "Lower Third - Outro Call to Action",
        settings: {
          url: "http://localhost:3001/hybrid-studio/overlays/lower-third?mode=outro",
          width: 1920,
          height: 1080,
          fps: 60,
          reroute_audio: false,
          restart_when_active: true
        }
      },
      {
        id: "browser_source",
        name: "Animated Overlays (Text, Arrows, Highlights)",
        settings: {
          url: "http://localhost:3001/hybrid-studio/overlays/kinetic",
          width: 1920,
          height: 1080,
          fps: 60,
          reroute_audio: false
        }
      }
    ]
  };

  return JSON.stringify(collection, null, 2);
}

export function getObsHybridStudioHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Professional Hybrid Video Studio — Screen Recording + Talking Head + B-Roll</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #3B82F6;
      --primary-glow: rgba(59, 130, 246, 0.4);
      --bg-dark: #070A13;
      --card-bg: rgba(14, 18, 30, 0.9);
      --card-border: rgba(255, 255, 255, 0.1);
      --accent-red: #EF4444;
      --accent-green: #10B981;
      --accent-yellow: #F59E0B;
      --font-main: 'Plus Jakarta Sans', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: var(--bg-dark);
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
      background: rgba(12, 16, 28, 0.85);
      border: 1px solid var(--card-border);
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
      background: linear-gradient(135deg, #2563EB, #1D4ED8);
      color: #FFF;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.25rem 0.65rem;
      border-radius: 8px;
      font-family: var(--font-mono);
      letter-spacing: 0.5px;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--card-border);
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
      background: linear-gradient(135deg, #3B82F6, #2563EB);
      color: #FFF;
      border: none;
      box-shadow: 0 4px 15px var(--primary-glow);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #2563EB, #1D4ED8);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
    }

    .btn-record-active {
      background: #DC2626 !important;
      animation: pulseRecord 1.2s infinite;
      border-color: #EF4444;
      color: #FFF;
    }

    @keyframes pulseRecord {
      0%, 100% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.8); }
      50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.3); }
    }

    /* OBS Scene Switcher Bar */
    .scene-switcher-bar {
      width: 100%;
      max-width: 1200px;
      display: flex;
      gap: 0.75rem;
      background: rgba(16, 22, 38, 0.9);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 0.65rem 1rem;
      margin-bottom: 1.25rem;
      align-items: center;
      overflow-x: auto;
    }

    .scene-bar-label {
      font-size: 0.8rem;
      font-family: var(--font-mono);
      font-weight: 700;
      color: #94A3B8;
      white-space: nowrap;
      margin-right: 0.5rem;
    }

    .scene-tab {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--card-border);
      color: #CBD5E1;
      padding: 0.45rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .scene-tab:hover {
      border-color: var(--primary);
      color: #FFF;
    }

    .scene-tab.active {
      background: var(--primary);
      color: #FFF;
      font-weight: 700;
      box-shadow: 0 0 15px var(--primary-glow);
    }

    /* Main Studio Container */
    .studio-container {
      width: 100%;
      max-width: 1200px;
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 1.5rem;
    }

    @media (max-width: 1024px) {
      .studio-container {
        grid-template-columns: 1fr;
      }
    }

    /* Left: Live Stage Viewport */
    .stage-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .viewport-box {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #000;
      border: 2px solid var(--primary);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 35px var(--primary-glow);
    }

    /* Scene Layers */
    /* Screen Recording layer (70% or full) */
    .layer-screen {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 70%;
      background: #0A0F1D;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-right: 2px solid rgba(255, 255, 255, 0.1);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .layer-screen video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .screen-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #64748B;
      gap: 0.75rem;
      text-align: center;
      padding: 1.5rem;
    }

    .screen-placeholder svg {
      width: 56px;
      height: 56px;
      stroke: var(--primary);
      fill: none;
    }

    /* Talking Head Webcam layer (30% Top-Right PiP or Fullscreen) */
    .layer-webcam {
      position: absolute;
      top: 0;
      right: 0;
      width: 30%;
      height: 40%;
      background: #0D1222;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-bottom: 2px solid var(--primary);
      box-shadow: -5px 10px 25px rgba(0, 0, 0, 0.6);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 15;
    }

    .layer-webcam.blurred {
      backdrop-filter: blur(12px);
    }

    .layer-webcam video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .webcam-avatar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .avatar-icon {
      font-size: 2.5rem;
      filter: drop-shadow(0 0 12px var(--primary));
    }

    /* SCENE 1 & 3: FULLSCREEN TALKING HEAD */
    .viewport-box.scene-intro .layer-webcam,
    .viewport-box.scene-conclusion .layer-webcam {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      border: none;
      z-index: 20;
    }

    .viewport-box.scene-intro .layer-screen,
    .viewport-box.scene-conclusion .layer-screen {
      opacity: 0;
      pointer-events: none;
    }

    /* Animated Overlays (Arrows, Highlights, Kinetic Text) */
    .kinetic-overlay-stage {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 25;
      overflow: hidden;
    }

    /* Kinetic Pointer Arrow */
    .pointer-arrow {
      position: absolute;
      top: 35%;
      left: 32%;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      animation: floatArrow 1.5s ease-in-out infinite alternate;
      display: none;
    }

    .pointer-arrow.active {
      display: flex;
    }

    .arrow-icon {
      font-size: 2.2rem;
      color: #EF4444;
      filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.8));
    }

    .arrow-badge {
      background: #EF4444;
      color: #FFF;
      font-weight: 800;
      font-size: 0.8rem;
      font-family: var(--font-mono);
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.6);
    }

    @keyframes floatArrow {
      from { transform: translateX(0); }
      to { transform: translateX(-12px); }
    }

    /* Highlight Box */
    .highlight-box {
      position: absolute;
      top: 48%;
      left: 12%;
      width: 45%;
      height: 30%;
      border: 3px solid #F59E0B;
      background: rgba(245, 158, 11, 0.15);
      border-radius: 8px;
      box-shadow: 0 0 25px rgba(245, 158, 11, 0.4);
      display: none;
    }

    .highlight-box.active {
      display: block;
      animation: pulseHighlight 1s infinite alternate;
    }

    @keyframes pulseHighlight {
      from { border-color: #F59E0B; box-shadow: 0 0 15px rgba(245, 158, 11, 0.3); }
      to { border-color: #FBBF24; box-shadow: 0 0 35px rgba(245, 158, 11, 0.8); }
    }

    /* Lower Third Graphic */
    .lower-third-card {
      position: absolute;
      bottom: 24px;
      left: 32px;
      background: rgba(10, 14, 26, 0.92);
      border-left: 6px solid var(--primary);
      border-radius: 10px;
      padding: 0.85rem 1.4rem;
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px var(--primary-glow);
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      transform: translateX(-40px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 30;
      pointer-events: none;
    }

    .lower-third-card.active {
      transform: translateX(0);
      opacity: 1;
    }

    .lt-name {
      font-size: 1.15rem;
      font-weight: 800;
      color: #FFF;
      letter-spacing: 0.2px;
    }

    .lt-title {
      font-size: 0.8rem;
      font-family: var(--font-mono);
      color: var(--primary);
      font-weight: 600;
    }

    /* Live VU Meter & Audio Normalizer */
    .vu-meter-bar {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      background: rgba(14, 18, 30, 0.95);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 0.75rem 1.25rem;
    }

    .vu-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      font-family: var(--font-mono);
      color: #94A3B8;
    }

    .vu-meter-track {
      width: 100%;
      height: 12px;
      background: #111827;
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      position: relative;
    }

    .vu-fill {
      height: 100%;
      width: 65%;
      background: linear-gradient(to right, #10B981 0%, #10B981 70%, #F59E0B 85%, #EF4444 100%);
      border-radius: 6px;
      transition: width 0.08s ease-out;
    }

    .vu-target-marker {
      position: absolute;
      left: 78%;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #FFF;
      box-shadow: 0 0 6px #FFF;
    }

    .vu-markers {
      display: flex;
      justify-content: space-between;
      font-size: 0.65rem;
      font-family: var(--font-mono);
      color: #64748B;
      padding: 0 2px;
    }

    /* Live Stage Controls Bar */
    .stage-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(14, 18, 30, 0.95);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 0.75rem 1.25rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .control-btn-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    /* Right Sidebar: Checklists, Guides & OBS Exporter */
    .sidebar-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .sidebar-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
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
      border-bottom: 1px solid var(--card-border);
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

    /* Voiceover Technique Card */
    .tip-pill {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 8px;
      padding: 0.6rem 0.85rem;
      font-size: 0.78rem;
      color: #93C5FD;
      line-height: 1.5;
    }

    .tip-pill strong {
      color: #FFF;
    }
  </style>
</head>
<body>

  <!-- Header Nav -->
  <header class="studio-header">
    <div class="brand-section">
      <span class="brand-pill">OBS HYBRID</span>
      <h1 style="font-size: 1.15rem; font-weight: 800;">Professional Hybrid Studio (Screen + Talking Head + B-Roll)</h1>
    </div>

    <div class="header-actions">
      <a href="/smart-video?topic=python" class="btn">
        🎬 Smart Video Player
      </a>
      <a href="/voiceover-studio" class="btn" style="border-color: #10B981; color: #6EE7B7;">
        🗣️ Natural Voiceover Studio
      </a>
      <a href="/api/obs-hybrid/download-scenes" class="btn btn-primary" download="NEXO_OBS_Hybrid_Scenes.json">
        📥 Download OBS Scene Collection (.json)
      </a>
      <button class="btn" id="recordToggleBtn" onclick="toggleRecordingSimulator()">
        🔴 Start Recording
      </button>
    </div>
  </header>

  <!-- OBS Scene Switcher Tabs -->
  <div class="scene-switcher-bar">
    <span class="scene-bar-label">OBS ACTIVE SCENE:</span>
    <button class="scene-tab active" id="tab-scene1" onclick="switchScene(1)">
      👤 Scene 1: INTRO (Full Camera + Lower Third)
    </button>
    <button class="scene-tab" id="tab-scene2" onclick="switchScene(2)">
      🖥️ Scene 2: MAIN CONTENT (70% Screen + 30% PiP + Overlays)
    </button>
    <button class="scene-tab" id="tab-scene3" onclick="switchScene(3)">
      🏁 Scene 3: CONCLUSION (Full Camera + CTA)
    </button>
  </div>

  <!-- Main Container -->
  <div class="studio-container">

    <!-- Left Stage Viewport -->
    <div class="stage-wrapper">
      <div class="viewport-box scene-intro" id="studioViewport">

        <!-- Layer 1: Screen Recording (Main 70%) -->
        <div class="layer-screen" id="layerScreen">
          <video id="screenShareVideo" autoplay playsinline muted></video>
          <div class="screen-placeholder" id="screenPlaceholder">
            <svg viewBox="0 0 24 24" stroke-width="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <div style="font-weight: 700; color: #E2E8F0;">Screen Recording (Main 70% Viewport)</div>
            <div style="font-size: 0.8rem;">Click <strong>"Share Screen"</strong> below to stream your live desktop/IDE</div>
          </div>
        </div>

        <!-- Layer 2: Talking Head Inset (Top-Right 30% or Fullscreen) -->
        <div class="layer-webcam" id="layerWebcam">
          <video id="webcamVideo" autoplay playsinline muted></video>
          <div class="webcam-avatar" id="avatarBox">
            <div class="avatar-icon">👨‍🏫</div>
            <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--primary);">YOU ON CAMERA</div>
          </div>
        </div>

        <!-- Layer 3: Kinetic Animated Overlays (Arrows & Highlights) -->
        <div class="kinetic-overlay-stage">
          <div class="pointer-arrow" id="pointerArrow">
            <div class="arrow-icon">➔</div>
            <div class="arrow-badge">KEY ARCHITECTURE</div>
          </div>
          <div class="highlight-box" id="highlightBox"></div>
        </div>

        <!-- Layer 4: Lower Third Graphics -->
        <div class="lower-third-card active" id="lowerThirdCard">
          <div class="lt-name" id="ltName">Alex Rivera</div>
          <div class="lt-title" id="ltTitle">Senior Systems Architect • NEXO Channel</div>
        </div>
      </div>

      <!-- Live VU Meter & Audio Normalizer -->
      <div class="vu-meter-bar">
        <div class="vu-header">
          <span>🎙️ USB MICROPHONE LEVEL (Peak Meter)</span>
          <span id="vuDbText">-6.2 dB (TARGET ZONE)</span>
        </div>
        <div class="vu-meter-track">
          <div class="vu-fill" id="vuFill"></div>
          <div class="vu-target-marker" title="Target Level: -6dB"></div>
        </div>
        <div class="vu-markers">
          <span>-40dB</span>
          <span>-24dB</span>
          <span>-12dB</span>
          <span style="color: #10B981; font-weight: 700;">-6dB (TARGET)</span>
          <span style="color: #EF4444; font-weight: 700;">0dB (CLIPPING)</span>
        </div>
      </div>

      <!-- Live Stage Controls Bar -->
      <div class="stage-controls">
        <div class="control-btn-group">
          <button class="btn" id="shareScreenBtn" onclick="toggleScreenShare()">
            🖥️ Share Screen
          </button>
          <button class="btn" id="webcamBtn" onclick="toggleWebcam()">
            📹 Enable Webcam
          </button>
          <button class="btn" id="blurBtn" onclick="toggleBackgroundBlur()">
            ✨ Background Blur: OFF
          </button>
        </div>

        <div class="control-btn-group">
          <button class="btn" onclick="triggerOverlay('arrow')">
            🎯 Arrow Callout
          </button>
          <button class="btn" onclick="triggerOverlay('highlight')">
            💡 Highlight Box
          </button>
          <button class="btn" onclick="triggerOverlay('lowerThird')">
            🏷️ Lower Third
          </button>
        </div>
      </div>
    </div>

    <!-- Right Sidebar -->
    <div class="sidebar-wrapper">

      <!-- Before Recording Checklist -->
      <div class="sidebar-card">
        <div class="card-title">
          <span>📋 BEFORE RECORDING</span>
          <span id="beforeProgressText" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--primary);">0/13</span>
        </div>
        <div class="progress-bar-box">
          <div class="progress-fill" id="beforeProgressFill"></div>
        </div>
        <div class="checklist-list" id="beforeChecklist">
          <label class="check-item"><input type="checkbox" onchange="updateProgress()"> Camera positioned at eye level</label>
          <label class="check-item"><input type="checkbox" onchange="updateProgress()"> Good lighting (no harsh facial shadows)</label>
          <label class="check-item"><input type="checkbox" onchange="updateProgress()"> Clean, professional background</label>
          <label class="check-item"><input type="checkbox" onchange="updateProgress()"> Mic positioned 6-8 inches from mouth</label>
          <label class="check-item"><input type="checkbox" onchange="updateProgress()"> Pop filter attached</label>
          <label class="check-item"><input type="checkbox" onchange="updateProgress()"> Tested audio levels (peak at -6dB)</label>
          <label class="check-item"><input type="checkbox" onchange="updateProgress()"> Dressed appropriately for brand</label>
          <label class="check-item"><input type="checkbox" onchange="updateProgress()"> Hair / styling ready</label>
          <label class="check-item"><input type="checkbox" onchange="updateProgress()"> Script / outline visible</label>
          <label class="check-item"><input type="checkbox" onchange="updateProgress()"> Closed all notifications & background apps</label>
          <label class="check-item"><input type="checkbox" onchange="updateProgress()"> OBS scenes configured and tested</label>
          <label class="check-item"><input type="checkbox" onchange="updateProgress()"> Screen resolution set (1080p minimum)</label>
          <label class="check-item"><input type="checkbox" onchange="updateProgress()"> Bitrate set (6000-8000 kbps)</label>
        </div>
      </div>

      <!-- During Recording & Voiceover Coaching -->
      <div class="sidebar-card">
        <div class="card-title">
          <span>🎙️ VOICEOVER TECHNIQUE</span>
        </div>
        <div class="tip-pill">
          <strong>Talk to ONE Person:</strong> Imagine a close friend sitting right across the table. Use warm, natural language rather than reading monotone slides.
        </div>
        <div class="checklist-list" id="duringChecklist">
          <label class="check-item"><input type="checkbox"> Look at the camera lens (not monitor)</label>
          <label class="check-item"><input type="checkbox"> Smile & maintain friendly facial expressions</label>
          <label class="check-item"><input type="checkbox"> Use natural hand gestures to guide attention</label>
          <label class="check-item"><input type="checkbox"> Pause between sentences (breathe)</label>
          <label class="check-item"><input type="checkbox"> No "um" or "uh" fillers (cut in edit)</label>
          <label class="check-item"><input type="checkbox"> Lower volume for thoughtful reflections</label>
          <label class="check-item"><input type="checkbox"> Raise volume for exciting breakthroughs</label>
        </div>
      </div>

      <!-- OBS Audio Filter Chain Quick-Copy -->
      <div class="sidebar-card">
        <div class="card-title">
          <span>⚙️ OBS FILTER PRESETS</span>
        </div>
        <div style="font-size: 0.78rem; color: #94A3B8;">
          Apply these 3 filters to your <strong>USB Mic</strong> in OBS:
        </div>
        <ol style="font-size: 0.78rem; color: #CBD5E1; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.35rem;">
          <li><strong>Noise Suppression:</strong> RNNoise (Good quality)</li>
          <li><strong>Compressor:</strong> Ratio 4:1, Threshold -18dB, Gain +3.5dB</li>
          <li><strong>Limiter:</strong> Threshold -6.0dB, Release 60ms</li>
        </ol>
      </div>

    </div>
  </div>

  <!-- Interactive JavaScript Controller -->
  <script>
    let activeScene = 1;
    let screenStream = null;
    let webcamStream = null;
    let isBlurActive = false;
    let isRecording = false;
    let vuInterval = null;

    // 1. Scene Switcher
    function switchScene(sceneNum) {
      activeScene = sceneNum;
      const viewport = document.getElementById('studioViewport');
      const ltCard = document.getElementById('lowerThirdCard');
      const ltName = document.getElementById('ltName');
      const ltTitle = document.getElementById('ltTitle');

      // Update Tabs
      document.querySelectorAll('.scene-tab').forEach((tab, idx) => {
        tab.classList.toggle('active', idx + 1 === sceneNum);
      });

      // Clear previous scene classes
      viewport.classList.remove('scene-intro', 'scene-main', 'scene-conclusion');

      if (sceneNum === 1) {
        // Scene 1 - INTRO (Talking head full screen)
        viewport.classList.add('scene-intro');
        ltName.textContent = "Alex Rivera";
        ltTitle.textContent = "Master Python & Systems Engineering • INTRO";
        ltCard.classList.add('active');
      } else if (sceneNum === 2) {
        // Scene 2 - MAIN CONTENT (Screen 70% + PiP 30%)
        viewport.classList.add('scene-main');
        ltCard.classList.remove('active');
      } else if (sceneNum === 3) {
        // Scene 3 - CONCLUSION (Talking head full screen + CTA)
        viewport.classList.add('scene-conclusion');
        ltName.textContent = "👉 Take Action Today";
        ltTitle.textContent = "Subscribe & Comment Below • See You in the Next Video!";
        ltCard.classList.add('active');
      }
    }

    // 2. Screen Share (Live Display Media)
    async function toggleScreenShare() {
      const video = document.getElementById('screenShareVideo');
      const placeholder = document.getElementById('screenPlaceholder');
      const btn = document.getElementById('shareScreenBtn');

      if (!screenStream) {
        try {
          screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { cursor: "always" },
            audio: false
          });
          video.srcObject = screenStream;
          placeholder.style.display = 'none';
          btn.textContent = '🖥️ Stop Screen Share';
          btn.classList.add('btn-primary');

          screenStream.getVideoTracks()[0].onended = () => {
            toggleScreenShare();
          };
        } catch (err) {
          console.warn('Screen share cancelled:', err);
        }
      } else {
        screenStream.getTracks().forEach(t => t.stop());
        screenStream = null;
        video.srcObject = null;
        placeholder.style.display = 'flex';
        btn.textContent = '🖥️ Share Screen';
        btn.classList.remove('btn-primary');
      }
    }

    // 3. Webcam Feed
    async function toggleWebcam() {
      const video = document.getElementById('webcamVideo');
      const avatar = document.getElementById('avatarBox');
      const btn = document.getElementById('webcamBtn');

      if (!webcamStream) {
        try {
          webcamStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: false
          });
          video.srcObject = webcamStream;
          avatar.style.display = 'none';
          btn.textContent = '📹 Stop Webcam';
          btn.classList.add('btn-primary');
        } catch (err) {
          alert('Webcam permission not granted or device unavailable: ' + err.message);
        }
      } else {
        webcamStream.getTracks().forEach(t => t.stop());
        webcamStream = null;
        video.srcObject = null;
        avatar.style.display = 'flex';
        btn.textContent = '📹 Enable Webcam';
        btn.classList.remove('btn-primary');
      }
    }

    // 4. Background Blur Toggle
    function toggleBackgroundBlur() {
      isBlurActive = !isBlurActive;
      const webcamLayer = document.getElementById('layerWebcam');
      const btn = document.getElementById('blurBtn');
      webcamLayer.classList.toggle('blurred', isBlurActive);
      btn.textContent = isBlurActive ? '✨ Background Blur: ON' : '✨ Background Blur: OFF';
    }

    // 5. Overlays (Arrows, Highlights, Lower Third)
    function triggerOverlay(type) {
      if (type === 'arrow') {
        const arrow = document.getElementById('pointerArrow');
        arrow.classList.toggle('active');
      } else if (type === 'highlight') {
        const hl = document.getElementById('highlightBox');
        hl.classList.toggle('active');
      } else if (type === 'lowerThird') {
        const lt = document.getElementById('lowerThirdCard');
        lt.classList.toggle('active');
      }
    }

    // 6. VU Meter Simulation peaking around -6dB
    function startVuMeter() {
      const fill = document.getElementById('vuFill');
      const dbText = document.getElementById('vuDbText');

      vuInterval = setInterval(() => {
        // Natural speech bounce: between -14dB and -5.5dB
        const randomDb = -6 - (Math.random() * 6.5);
        const percent = Math.min(100, Math.max(10, ((randomDb + 40) / 40) * 100));
        fill.style.width = percent + '%';
        dbText.textContent = randomDb.toFixed(1) + ' dB (TARGET ZONE)';
      }, 120);
    }
    startVuMeter();

    // 7. Interactive Checklist Progress
    function updateProgress() {
      const items = document.querySelectorAll('#beforeChecklist input[type="checkbox"]');
      let checkedCount = 0;
      items.forEach(input => {
        const parent = input.closest('.check-item');
        if (input.checked) {
          checkedCount++;
          parent.classList.add('checked');
        } else {
          parent.classList.remove('checked');
        }
      });

      const fill = document.getElementById('beforeProgressFill');
      const text = document.getElementById('beforeProgressText');
      const pct = (checkedCount / items.length) * 100;
      fill.style.width = pct + '%';
      text.textContent = checkedCount + '/' + items.length;

      if (checkedCount === items.length) {
        text.textContent = 'READY TO RECORD! 🎉';
        text.style.color = '#10B981';
      } else {
        text.style.color = 'var(--primary)';
      }
    }

    // 8. Recording Simulator
    function toggleRecordingSimulator() {
      isRecording = !isRecording;
      const btn = document.getElementById('recordToggleBtn');
      if (isRecording) {
        btn.textContent = '⏹️ Stop Recording';
        btn.classList.add('btn-record-active');
      } else {
        btn.textContent = '🔴 Start Recording';
        btn.classList.remove('btn-record-active');
      }
    }
  </script>
</body>
</html>`;
}
