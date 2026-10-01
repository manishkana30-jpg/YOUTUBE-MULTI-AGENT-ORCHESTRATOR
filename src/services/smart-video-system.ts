export interface VisualItem {
  timestamp: number;
  type: string;
  text: string;
  subtitle: string;
  animation: string;
  color: string;
  actor: string;
  framing?: 'FULLSCREEN_PRESENTER' | 'SPLIT_SCREEN' | 'PICTURE_IN_PICTURE' | 'CLOSE_UP';
  codeSnippet?: string;
  terminalOutput?: string;
  arrowNote?: string;
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
    description: 'Learn Python from zero to hero with active human presence, live IDE coding, real terminal execution, and async event loop architecture.',
    duration: '01:35',
    visualsJson: '/data/python_visuals.json',
    thumbnail: '/thumbnails/python.jpg',
    themeColor: '#3B82F6',
    bgColor: '#080E1C',
    font: "'Fira Code', 'JetBrains Mono', monospace",
    visuals: [
      {
        timestamp: 0.0,
        type: 'intro',
        text: '🐍 Python Basics for Beginners (Live Studio)',
        subtitle: "Hey everyone! I'm about to show you Python basics. By the end of this video, you'll be able to write your first program. Let's go!",
        animation: 'fade-down',
        color: '#3B82F6',
        actor: 'professional_male_voice',
        framing: 'FULLSCREEN_PRESENTER',
        codeSnippet: `# 🐍 Python 3.12 Developer Workspace
# Welcome! In this lesson, you'll build your first program.
import sys

print(f"Python Active Version: {sys.version.split()[0]}")
print("Status: Workspace ready for live execution.")`,
        terminalOutput: `$ python main.py
Python Active Version: 3.12.6
Status: Workspace ready for live execution.`,
        arrowNote: ''
      },
      {
        timestamp: 10.5,
        type: 'problem',
        text: 'Split Screen: Why 90% Struggle with Python',
        subtitle: "Most people give up on Python because they think it's too hard. But I'm going to show you it's actually simple. Here's what I see people struggling with.",
        animation: 'slide-left',
        color: '#EF4444',
        actor: 'professional_male_voice',
        framing: 'SPLIT_SCREEN',
        codeSnippet: `# ❌ THE COMMON PITFALL: Memorizing syntax instead of building
import time

def blocking_request(user_id):
    # ⚠️ WARNING: Thread blocks for 5 seconds!
    time.sleep(5)
    return {"status": "stalled", "user": user_id}`,
        terminalOutput: `[WARNING] 90% of beginners give up when memorizing syntax theory!
[SOLUTION] Switch to writing real, interactive functions with live outputs.`,
        arrowNote: '⚠️ BLOCKING SYNTAX PITFALL'
      },
      {
        timestamp: 26.5,
        type: 'teaching',
        text: 'Step 1: Clean Functions & Async Event Loops',
        subtitle: "Step 1: Writing clean functions and handling data. Watch how I write this in the code editor on screen. Let me show you the right way to structure your code cleanly.",
        animation: 'zoom-pulse',
        color: '#F59E0B',
        actor: 'professional_male_voice',
        framing: 'PICTURE_IN_PICTURE',
        codeSnippet: `# ✅ THE RIGHT WAY: Clean Functions & Asyncio TaskGroups
import asyncio
import httpx

async def fetch_user_data(client: httpx.AsyncClient, user_id: int):
    """Fetches user payload asynchronously without thread locking."""
    response = await client.get(f"https://api.internal/users/{user_id}")
    return response.json()

async def main():
    async with httpx.AsyncClient() as client:
        async with asyncio.TaskGroup() as tg:
            tasks = [tg.create_task(fetch_user_data(client, i)) for i in range(100)]`,
        terminalOutput: `$ python -m pytest tests/test_async.py
tests/test_async.py .... [100%]
4 passed in 0.04s`,
        arrowNote: '➔ ASYNC TASKGROUP EXECUTION'
      },
      {
        timestamp: 48.5,
        type: 'example',
        text: 'Real Working Code: Terminal Output 200 OK',
        subtitle: "Look at this! I just ran this Python script and it executed on the first try. See the terminal output on screen? Output 200 OK, latency 140 milliseconds. That is exactly what we wanted.",
        animation: 'glow-rise',
        color: '#10B981',
        actor: 'professional_male_voice',
        framing: 'PICTURE_IN_PICTURE',
        codeSnippet: `# 🚀 LIVE WORKING BENCHMARK
import asyncio

if __name__ == "__main__":
    print("[INIT] Dispatching 100 concurrent asynchronous requests...")
    # Simulated execution
    print("[SUCCESS] 100/100 requests completed with 200 OK!")
    print("[METRICS] Latency: 140ms | Memory: 38MB | Throughput: 8.5x")`,
        terminalOutput: `$ python main.py
[INIT] Dispatching 100 concurrent asynchronous requests...
[SUCCESS] 100/100 requests completed with 200 OK!
[METRICS] Latency: 140ms | Memory: 38MB | Throughput: 8.5x
[STATUS] All unit tests verified. Zero dropped packets.`,
        arrowNote: '➔ 200 OK OUTPUT CONFIRMED'
      },
      {
        timestamp: 65.5,
        type: 'story',
        text: 'Five Years Ago I Knew Zero Python: How It Changed My Career',
        subtitle: "Here is why this matters to me personally. Five years ago, I didn't know Python at all. Then I learned it step by step, and it completely changed my software engineering career.",
        animation: 'fade-down',
        color: '#8B5CF6',
        actor: 'professional_male_voice',
        framing: 'CLOSE_UP',
        codeSnippet: `# 💡 ARCHITECTURAL SHIFT:
# Five years ago: Struggled with basic syntax and server crashes
# Today: Staff Engineer designing autonomous multi-agent systems
# The Secret: Stop memorizing theory. Write real code every day.`,
        terminalOutput: `$ git log -1 --pretty=format:"Author: Alex Rivera | Commitment: Daily Real-World Code"
Commit: 845fbd8 - Built practical microservices and production swarms`,
        arrowNote: '💡 REAL PRACTICAL EXPERIENCE'
      },
      {
        timestamp: 80.5,
        type: 'cta',
        text: 'Take Action: Write Your First Code & Subscribe',
        subtitle: "I want you to try coding today. Open your terminal, write your first script, and comment below what you built! Don't forget to subscribe for weekly Python lessons.",
        animation: 'pulse-badge',
        color: '#FF2A55',
        actor: 'professional_male_voice',
        framing: 'FULLSCREEN_PRESENTER',
        codeSnippet: `# 🏁 YOUR ACTION STEPS TODAY:
# 1. Clone the repository and run your first script:
#    git clone https://github.com/manishkana30-jpg/YOUTUBE-MULTI-AGENT-ORCHESTRATOR.git
# 2. Leave a comment below with your first program!
# 3. Hit Subscribe for weekly deep dives!`,
        terminalOutput: `$ echo "👉 Subscribe to NEXO KIDS & Hit the Bell!"
👉 Subscribe to NEXO KIDS & Hit the Bell!
$ echo "See you in the next tutorial!"
See you in the next tutorial!`,
        arrowNote: '👉 SUBSCRIBE & HIT THE BELL'
      }
    ]
  },

  javascript: {
    videoFile: '/videos/javascript_tutorial.mp4',
    voiceoverFile: '/audio/javascript_voiceover.mp3',
    voiceoverActor: 'professional_female_voice',
    title: 'JavaScript Complete Guide',
    description: 'Master modern JavaScript with live V8 microtask queues, non-blocking promises, and 60fps browser rendering.',
    duration: '01:26',
    visualsJson: '/data/javascript_visuals.json',
    thumbnail: '/thumbnails/javascript.jpg',
    themeColor: '#F7DF1E',
    bgColor: '#12120A',
    font: "'Plus Jakarta Sans', sans-serif",
    visuals: [
      {
        timestamp: 0.0,
        type: 'intro',
        text: '⚡ Modern JavaScript Complete Guide',
        subtitle: "Welcome back everyone! Today we are mastering modern JavaScript from the ground up. In just a few minutes, you will understand how modern web apps really work. Let's dive in!",
        animation: 'fade-down',
        color: '#F7DF1E',
        actor: 'professional_female_voice',
        framing: 'FULLSCREEN_PRESENTER',
        codeSnippet: `// ⚡ Modern JavaScript ES2024 Runtime
console.log("V8 Engine Initialized: Ready for async execution.");`,
        terminalOutput: `$ node app.js\nV8 Engine Initialized: Ready for async execution.`,
        arrowNote: ''
      },
      {
        timestamp: 9.5,
        type: 'problem',
        text: 'Split Screen: Main-Thread Freezes & Long Tasks',
        subtitle: "A lot of developers get frustrated with JavaScript because of asynchronous event loops and promise rejections. But once you understand the execution order, everything becomes clear.",
        animation: 'slide-left',
        color: '#FBBF24',
        actor: 'professional_female_voice',
        framing: 'SPLIT_SCREEN',
        codeSnippet: `// ❌ COMMON MISTAKE: Synchronous long tasks lock browser paints
function heavyCalculation() {
  const start = Date.now();
  while (Date.now() - start < 1000) {} // UI Freezes! 0 FPS!
}`,
        terminalOutput: `[WARNING] Long task detected: 1000ms duration. Browser dropped 60 frames.`,
        arrowNote: '⚠️ LONG TASK LOCKS MAIN THREAD'
      },
      {
        timestamp: 24.5,
        type: 'teaching',
        text: 'Step 1: Microtask Queue & queueMicrotask()',
        subtitle: "Step 1: Async functions and microtasks. Look at the code on screen. Promises resolve before the next browser render tick. Notice how avoiding long tasks keeps the user interface fluid at sixty frames per second.",
        animation: 'zoom-pulse',
        color: '#10B981',
        actor: 'professional_female_voice',
        framing: 'PICTURE_IN_PICTURE',
        codeSnippet: `// ✅ THE RIGHT WAY: Chunking tasks with microtasks
async function processChunkedData(items) {
  for (const item of items) {
    await new Promise(resolve => queueMicrotask(resolve));
    renderItem(item); // Fluid 60fps render
  }
}`,
        terminalOutput: `$ npm test\n[PASS] INP Latency: 18ms (Green CWV Score)`,
        arrowNote: '➔ MICROTASKS YIELD TO PAINT'
      },
      {
        timestamp: 45.5,
        type: 'example',
        text: 'Live Working Benchmark: INP < 40ms',
        subtitle: "Check out this live benchmark! When we run this optimized JavaScript code, our interaction to next paint score drops under forty milliseconds. Zero frame drops and buttery smooth rendering.",
        animation: 'glow-rise',
        color: '#06B6D4',
        actor: 'professional_female_voice',
        framing: 'PICTURE_IN_PICTURE',
        codeSnippet: `// 🚀 PRODUCTION METRICS REPORT
const metrics = { inp: '28ms', lcp: '1.1s', fps: 60 };
console.table(metrics);`,
        terminalOutput: `┌─────────┬────────┐\n│ (index) │ Values │\n├─────────┼────────┤\n│ inp     │ '28ms' │\n│ fps     │ 60     │\n└─────────┴────────┘`,
        arrowNote: '➔ 60FPS CONFIRMED'
      },
      {
        timestamp: 60.5,
        type: 'story',
        text: 'Early in My Career: UI Lag Cost Us Conversions',
        subtitle: "Early in my career, UI lag and broken scripts cost our team major conversions. Taking the time to master JavaScript internals transformed our web apps and my confidence as a developer.",
        animation: 'fade-down',
        color: '#8B5CF6',
        actor: 'professional_female_voice',
        framing: 'CLOSE_UP',
        codeSnippet: `// 💡 Real Lessons from Production:
// Eliminating 50ms bottlenecks restored conversion rates by 18%.`,
        terminalOutput: `$ git commit -m "fix: eliminate long tasks and restore 60fps"`,
        arrowNote: ''
      },
      {
        timestamp: 72.5,
        type: 'cta',
        text: 'Action Step: Try in DevTools & Subscribe',
        subtitle: "Now it is your turn! Open your browser devtools, test this code today, and subscribe to the channel for more full-stack web development deep dives!",
        animation: 'pulse-badge',
        color: '#FF2A55',
        actor: 'professional_female_voice',
        framing: 'FULLSCREEN_PRESENTER',
        codeSnippet: `// 🏁 Subscribe to NEXO KIDS for Full-Stack Tutorials!
console.log("👉 Subscribe & Hit the Bell! See you next week!");`,
        terminalOutput: `👉 Subscribe & Hit the Bell! See you next week!`,
        arrowNote: '👉 SUBSCRIBE FOR JS DEEP DIVES'
      }
    ]
  },

  ai: {
    videoFile: '/videos/ai_basics.mp4',
    voiceoverFile: '/audio/ai_voiceover.mp3',
    voiceoverActor: 'professional_deep_voice',
    title: 'AI & Machine Learning Basics',
    description: 'Understand autonomous multi-agent supervisor swarms, MCP execution, and fault-tolerant architecture.',
    duration: '01:21',
    visualsJson: '/data/ai_visuals.json',
    thumbnail: '/thumbnails/ai.jpg',
    themeColor: '#10B981',
    bgColor: '#071510',
    font: "'Outfit', sans-serif",
    visuals: [
      {
        timestamp: 0.0,
        type: 'intro',
        text: '🤖 Production Autonomous AI Swarms',
        subtitle: "Welcome everyone! Today I am going to show you how autonomous AI agent swarms actually work in production. By the end of this, you will understand how to build resilient AI systems.",
        animation: 'fade-down',
        color: '#10B981',
        actor: 'professional_deep_voice',
        framing: 'FULLSCREEN_PRESENTER',
        codeSnippet: `// 🤖 Model Context Protocol Supervisor Initialized
import { AgentSwarm } from '@antigravity/swarm';
const swarm = new AgentSwarm({ orchestrator: 'Gemini-Flash' });`,
        terminalOutput: `[SWARM] Initialized 4 specialized agent workers via MCP.`,
        arrowNote: ''
      },
      {
        timestamp: 9.5,
        type: 'problem',
        text: 'Split Screen: Single Prompt Chains Crash in Production',
        subtitle: "Most developers struggle with AI because single prompt chains get stuck in infinite retries. When context drifts, the agent burns tokens and fails silently. Here is the better architectural pattern.",
        animation: 'slide-left',
        color: '#00F0FF',
        actor: 'professional_deep_voice',
        framing: 'SPLIT_SCREEN',
        codeSnippet: `// ❌ THE FRAGILE CHAIN:
while (!taskDone) {
  // ⚠️ Context drift causes hallucination & infinite loop!
  const res = await callLLM(context);
}`,
        terminalOutput: `[ERROR] Maximum context window exceeded. Silent retry failure.`,
        arrowNote: '⚠️ CONTEXT DRIFT FAILURE'
      },
      {
        timestamp: 22.5,
        type: 'teaching',
        text: 'Step 1: Supervisor-Worker Multi-Agent Swarms',
        subtitle: "Step 1: Supervisor-worker multi-agent swarms. Look at the live diagram and terminal on screen. The supervisor agent delegates subtasks to specialized tools using the Model Context Protocol.",
        animation: 'zoom-pulse',
        color: '#A855F7',
        actor: 'professional_deep_voice',
        framing: 'PICTURE_IN_PICTURE',
        codeSnippet: `// ✅ HIERARCHICAL SUPERVISOR SWARM
const task = await supervisor.delegate({
  workers: ['ContentAgent', 'SEOAgent', 'DesignAgent'],
  protocol: 'MCP_TOOLS_V2'
});`,
        terminalOutput: `[SUPERVISOR] Delegated subtasks concurrently. All workers reporting 200 OK.`,
        arrowNote: '➔ CONCURRENT WORKER EXECUTION'
      },
      {
        timestamp: 42.5,
        type: 'example',
        text: 'Live Working Benchmark: 12 Seconds, Zero Errors',
        subtitle: "Look at these production metrics! The multi-agent swarm executed the entire task in twelve seconds with zero errors and one hundred percent verified test passes.",
        animation: 'glow-rise',
        color: '#F59E0B',
        actor: 'professional_deep_voice',
        framing: 'PICTURE_IN_PICTURE',
        codeSnippet: `// 🚀 PRODUCTION BENCHMARK AUDIT
console.log({ duration: '12.4s', testsPassed: '100%', errors: 0 });`,
        terminalOutput: `$ npm run test:pipeline\n[PASS] Pipeline executed in 12.4s. 100% verified passes.`,
        arrowNote: '➔ 100% TEST PASSES'
      },
      {
        timestamp: 58.5,
        type: 'story',
        text: 'From Fragile Prompt Chains to Resilient Swarms',
        subtitle: "I spent months battling fragile prompt chains before switching to hierarchical supervisor swarms. It completely revolutionized our automated engineering workflows.",
        animation: 'fade-down',
        color: '#8B5CF6',
        actor: 'professional_deep_voice',
        framing: 'CLOSE_UP',
        codeSnippet: `// 💡 Personal Lesson:
// Separate concerns: Supervisors plan, specialized workers execute.`,
        terminalOutput: `[SYSTEM] Architecture hardened against context drift.`,
        arrowNote: ''
      },
      {
        timestamp: 70.5,
        type: 'cta',
        text: 'Action Step: Build Your Swarm & Subscribe',
        subtitle: "Start building your own AI swarms today! Check out the starter repo, comment your questions below, and subscribe for daily production AI blueprints!",
        animation: 'pulse-badge',
        color: '#FF2A55',
        actor: 'professional_deep_voice',
        framing: 'FULLSCREEN_PRESENTER',
        codeSnippet: `// 🏁 Subscribe to NEXO KIDS for AI Engineering Blueprints!
console.log("👉 Star the repo & Subscribe on YouTube!");`,
        terminalOutput: `👉 Star the repo & Subscribe on YouTube!`,
        arrowNote: '👉 SUBSCRIBE FOR AI BLUEPRINTS'
      }
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
  <title>Smart Video Content System — Engaging Human Presence & Live Code Studio</title>
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
      background: #060913;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* LIVE INTERACTIVE CODE STUDIO LAYER (Replaces static slides!) */
    .live-ide-container {
      position: absolute;
      inset: 0;
      background: #0B0F19;
      display: flex;
      flex-direction: column;
      z-index: 5;
      overflow: hidden;
    }

    .ide-window-header {
      height: 38px;
      background: #111827;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      padding: 0 1rem;
      justify-content: space-between;
    }

    .window-buttons {
      display: flex;
      gap: 6px;
    }

    .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    .dot-red { background: #EF4444; }
    .dot-yellow { background: #F59E0B; }
    .dot-green { background: #10B981; }

    .tab-pill {
      font-family: var(--mono);
      font-size: 0.75rem;
      color: #FFF;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: #0B0F19;
      padding: 0.35rem 0.9rem;
      border-radius: 6px 6px 0 0;
      border-top: 2px solid var(--theme-color);
    }

    .branch-pill {
      font-family: var(--mono);
      font-size: 0.7rem;
      color: #64748B;
    }

    .ide-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #080C16;
      position: relative;
      overflow: hidden;
    }

    .ide-editor-panel {
      flex: 1;
      display: flex;
      padding: 1rem 1.25rem;
      gap: 1rem;
      font-family: var(--mono);
      font-size: 0.95rem;
      line-height: 1.7;
      color: #E2E8F0;
      overflow: hidden;
    }

    .line-numbers {
      color: #475569;
      user-select: none;
      text-align: right;
      padding-right: 0.6rem;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      font-size: 0.85rem;
    }

    .code-content-view {
      flex: 1;
      white-space: pre;
      font-size: 0.92rem;
      overflow-x: auto;
    }

    .ide-terminal-panel {
      height: 135px;
      background: #03060C;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
    }

    .terminal-bar {
      height: 26px;
      background: #0E1322;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
      font-family: var(--mono);
      font-size: 0.72rem;
      color: #94A3B8;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .term-status {
      color: #10B981;
      font-weight: 700;
    }

    .terminal-body {
      flex: 1;
      padding: 0.6rem 1rem;
      font-family: var(--mono);
      font-size: 0.82rem;
      color: #10B981;
      line-height: 1.5;
      white-space: pre-wrap;
      overflow-y: auto;
    }

    /* KINETIC POINTER ARROW OVERLAY */
    .kinetic-pointer-arrow {
      position: absolute;
      top: 32%;
      left: 36%;
      z-index: 22;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      animation: floatArrow 1.5s ease-in-out infinite alternate;
      display: none;
      pointer-events: none;
    }

    .kinetic-pointer-arrow.visible {
      display: flex;
    }

    .arrow-symbol {
      font-size: 2.2rem;
      color: #EF4444;
      filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.9));
    }

    .arrow-text {
      background: #EF4444;
      color: #FFF;
      font-family: var(--mono);
      font-size: 0.78rem;
      font-weight: 800;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.6);
    }

    @keyframes floatArrow {
      from { transform: translateX(0); }
      to { transform: translateX(-12px); }
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
      width: 250px;
      height: 160px;
      background: #0A0D18;
      border: 2px solid var(--theme-color);
      border-radius: 14px;
      overflow: hidden;
      z-index: 25;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.8), 0 0 25px var(--theme-glow);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .creator-pip-box.fullscreen-mode {
      inset: 0;
      width: 100%;
      height: 100%;
      border-radius: 0;
      border: none;
      z-index: 15;
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
      gap: 0.6rem;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0.6) 100%);
    }

    .avatar-head-stage {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .avatar-face {
      font-size: 3rem;
      filter: drop-shadow(0 0 16px var(--theme-color));
      animation: headBob 2.5s infinite ease-in-out;
    }

    .avatar-mouth {
      width: 14px;
      height: 4px;
      background: #EF4444;
      border-radius: 3px;
      margin-top: -6px;
      transition: height 0.1s ease;
    }

    .avatar-mouth.talking {
      animation: mouthTalk 0.25s infinite alternate;
    }

    @keyframes headBob {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-4px) rotate(1deg); }
    }

    @keyframes mouthTalk {
      from { height: 3px; width: 12px; }
      to { height: 9px; width: 16px; border-radius: 5px; }
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
    .voice-bars span:nth-child(2) { animation-delay: 0.15s; }
    .voice-bars span:nth-child(3) { animation-delay: 0.3s; }
    .voice-bars span:nth-child(4) { animation-delay: 0.45s; }
    .voice-bars span:nth-child(5) { animation-delay: 0.6s; }

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
      background: rgba(10, 12, 20, 0.92);
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
      flex-wrap: wrap;
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

    /* Storyboard Navigation Tabs */
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

  <!-- EXACT REQUIRED HTML STRUCTURE (#video-container) -->
  <div id="video-container">
    <div class="video-viewport" id="stageViewport">

      <!-- 1. LIVE INTERACTIVE CODE STUDIO LAYER (Replaces boring static slides!) -->
      <div id="live-ide-stage" class="live-ide-container">
        <div class="ide-window-header">
          <div class="window-buttons">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          <div class="tab-pill active-tab" id="ideTabTitle">📄 main.py — Python 3.12 (Virtualenv: .venv)</div>
          <div class="branch-pill">🌿 main*</div>
        </div>
        
        <div class="ide-body">
          <!-- Code Editor Panel -->
          <div class="ide-editor-panel">
            <div class="line-numbers" id="ideLineNumbers">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
            </div>
            <div class="code-content-view" id="ideCodeContent">
              <!-- Dynamically populated with syntax highlighted code -->
            </div>
          </div>
          
          <!-- Interactive Terminal Output Panel -->
          <div class="ide-terminal-panel">
            <div class="terminal-bar">
              <span>TERMINAL — bash</span>
              <span class="term-status" id="termStatus">● LIVE EXECUTION</span>
            </div>
            <div class="terminal-body" id="ideTerminalBody">
              <!-- Live terminal commands and execution outputs -->
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Kinetic Pointer Arrow Overlay -->
      <div id="kinetic-arrow" class="kinetic-pointer-arrow">
        <span class="arrow-symbol">➔</span>
        <span class="arrow-text" id="arrowText">WATCH LIVE CODE</span>
      </div>

      <!-- 3. Hidden video source maintaining exact required selector -->
      <video id="main-video" width="100%" playsinline preload="metadata" style="display: none;">
        <source id="video-source" src="" type="video/mp4">
      </video>
      
      <!-- 4. Voiceover Audio Container maintaining exact required selector -->
      <div id="voiceover-container">
        <div class="actor-badge">
          <div class="actor-pulse"></div>
          <span id="actor-label">VOICEOVER: Studio Master (-6dB)</span>
        </div>
        <audio id="voiceover-audio" autoplay></audio>
      </div>

      <!-- 5. HUMAN PRESENCE INSET CAMERA (Picture-in-Picture / Split-Screen / Fullscreen) -->
      <div id="creator-pip" class="creator-pip-box fullscreen-mode" title="Human Presence Framing">
        <video id="creator-webcam" autoplay playsinline muted></video>
        <div id="creator-avatar" class="creator-avatar-placeholder">
          <div class="avatar-head-stage">
            <div class="avatar-face">👨‍🏫</div>
            <div class="avatar-mouth" id="avatarMouth"></div>
          </div>
          <div class="voice-bars" id="voiceBars">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div class="pip-tag">
          <span class="actor-pulse"></span>
          <span id="pip-tag-text">YOU ON CAMERA</span>
        </div>
      </div>
      
      <!-- 6. Visual Overlay maintaining exact required selector -->
      <div id="visual-overlay">
        <div class="overlay-card visible" id="activeVisualCard">
          <div class="overlay-tag" id="visualTag">01. INTRO • 0.0s</div>
          <div class="overlay-headline" id="visualHeadline">🐍 Python Basics for Beginners</div>
          <div class="overlay-subtitle" id="visualSubtitle">Hey everyone! I'm about to show you Python basics. Let's go!</div>
        </div>
      </div>
    </div>

    <!-- Playback Control Bar -->
    <div class="player-controls-bar">
      <div class="ctrl-group">
        <button class="btn-action" id="playBtn" onclick="togglePlay()">
          <span id="playIcon">⏸</span> <span id="playText">Pause</span>
        </button>
        <button class="btn-action" onclick="restart()">
          ↺ Restart
        </button>
        <button class="btn-action btn-highlight" id="webcamToggleBtn" onclick="toggleCreatorWebcam()">
          📹 Toggle Creator Webcam
        </button>
      </div>
      <div class="time-indicator">
        <span id="timeElapsed">00:00</span> / <span id="totalTime">01:35</span>
      </div>
    </div>
    
    <div id="description-panel">
      <h1 id="video-title">Complete Python Tutorial for Beginners</h1>
      <div class="meta-row">
        <span>⏱️ Duration: <strong id="meta-duration">01:35</strong></span>
        <span>•</span>
        <span>🎙️ Audio: <strong id="meta-actor">Studio Master (Continuous 95s)</strong></span>
        <span>•</span>
        <span>📁 Audio Source: <code id="meta-source">/audio/python_voiceover.mp3</code></span>
      </div>
      <div id="description">
        Learn Python from zero to hero with active human presence, live IDE coding, real terminal execution, and async event loop architecture.
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
          <li>✗ Robotic voice that breaks after the first portion</li>
          <li>✗ Zero human presence or eye contact</li>
          <li>✗ Boring background music with muffled audio</li>
          <li>✗ No engagement or real coding action</li>
          <li>⚠️ <strong>Audience Retention:</strong> Drops off at 30 seconds</li>
          <li>📉 <strong>Final Result:</strong> 2 views, 0 subscribers</li>
        </ul>
      </div>

      <!-- AFTER CARD -->
      <div style="background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 1.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(16, 185, 129, 0.2); padding-bottom: 0.5rem;">
          <strong style="color: #10B981; font-size: 1.05rem;">✅ AFTER (Human Presence & Live IDE)</strong>
          <span style="font-family: var(--mono); font-size: 0.72rem; background: rgba(16, 185, 129, 0.2); color: #6EE7B7; padding: 0.15rem 0.5rem; border-radius: 4px;">2,000+ VIEWS</span>
        </div>
        <ul style="list-style: none; font-size: 0.85rem; color: #CBD5E1; display: flex; flex-direction: column; gap: 0.4rem;">
          <li>✓ You on camera + Split screen + Live IDE execution</li>
          <li>✓ Natural conversational voice (continuous, zero breaks!)</li>
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

  <!-- 12-Minute Storyboard Scrubber Card -->
  <div class="production-card" style="margin-top: 1.5rem;">
    <div class="production-header">
      <div class="production-title">
        <span>🎬 Human Presence Storyboard (6 Paced Stages)</span>
      </div>
      <span class="badge-pill">INTERACTIVE TIMELINE</span>
    </div>

    <!-- 12-Minute Scene Navigation Tabs -->
    <div class="storyboard-nav" role="tablist">
      <button class="sb-btn active" onclick="jumpToScene(0, 'FULLSCREEN_PRESENTER')">[00:00-00:10] INTRO (You on Camera)</button>
      <button class="sb-btn" onclick="jumpToScene(10.5, 'SPLIT_SCREEN')">[00:10-00:26] PROBLEM (Split Screen)</button>
      <button class="sb-btn" onclick="jumpToScene(26.5, 'PICTURE_IN_PICTURE')">[00:26-00:48] TEACHING (3 Layers + Live Code)</button>
      <button class="sb-btn" onclick="jumpToScene(48.5, 'PICTURE_IN_PICTURE')">[00:48-01:05] REAL EXAMPLE (Live Output)</button>
      <button class="sb-btn" onclick="jumpToScene(65.5, 'CLOSE_UP')">[01:05-01:20] YOUR STORY (Close-Up)</button>
      <button class="sb-btn" onclick="jumpToScene(80.5, 'FULLSCREEN_PRESENTER')">[01:20-01:35] CTA (You + Animated Subscribe)</button>
    </div>

    <!-- Dynamic Teleprompter Box -->
    <div class="script-teleprompter" id="teleprompterText">
      <strong>[00:00-00:10] INTRO SCRIPT:</strong><br>
      "Hey everyone! I'm about to show you Python basics. By the end of this video, you'll be able to write your first program. Let's go!"
      <div class="notes-box">
        <strong>Production Notes:</strong> Direct eye contact with camera &bull; Warm natural smile &bull; Conversational tone &bull; Gentle hand gestures.
      </div>
    </div>
  </div>

  <!-- JAVASCRIPT IMPLEMENTATION -->
  <script>
    const contentMap = ${contentMapJson};

    let activeVisuals = [];
    let activeVisualTimestamp = null;
    let isWebcamActive = false;
    let webcamStream = null;

    // Load Content By URL
    const loadContentByURL = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const topic = urlParams.get('topic') || 'python';
      
      const content = contentMap[topic];
      if (!content) return;
      
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.id === 'nav-' + topic);
      });

      document.documentElement.style.setProperty('--theme-color', content.themeColor);
      document.documentElement.style.setProperty('--theme-bg', content.bgColor);
      document.documentElement.style.setProperty('--theme-glow', content.themeColor + '66');
      document.body.style.backgroundColor = content.bgColor;

      const actorLabel = document.getElementById('actor-label');
      if (actorLabel) actorLabel.textContent = 'VO: ' + content.voiceoverActor;
      const metaDuration = document.getElementById('meta-duration');
      if (metaDuration) metaDuration.textContent = content.duration;
      const metaActor = document.getElementById('meta-actor');
      if (metaActor) metaActor.textContent = content.voiceoverActor;
      const metaSource = document.getElementById('meta-source');
      if (metaSource) metaSource.textContent = content.voiceoverFile;
      const totalTime = document.getElementById('totalTime');
      if (totalTime) totalTime.textContent = content.duration;

      // Load continuous voiceover audio
      const audio = document.getElementById('voiceover-audio');
      audio.src = content.voiceoverFile;
      audio.load();
      
      document.title = content.title;
      document.getElementById('video-title').textContent = content.title;
      document.getElementById('description').textContent = content.description;
      
      activeVisuals = content.visuals;
      syncVisualsWithAudio(activeVisuals);

      // Play audio automatically or show prompt
      audio.play().then(() => {
        setPlayingState(true);
      }).catch(err => {
        console.log('Autoplay deferred for user gesture:', err.message);
        setPlayingState(false);
      });
    };

    // Continuous Audio Sync Engine
    const syncVisualsWithAudio = (visualsData) => {
      const audio = document.getElementById('voiceover-audio');
      activeVisualTimestamp = null;
      
      audio.ontimeupdate = () => {
        const cur = audio.currentTime;
        
        const currentVisual = visualsData
          .filter(v => cur >= v.timestamp)
          .sort((a, b) => b.timestamp - a.timestamp)[0];

        if (currentVisual && currentVisual.timestamp !== activeVisualTimestamp) {
          activeVisualTimestamp = currentVisual.timestamp;
          updateVisual(currentVisual);
        }

        // Animated mouth movement & voice bars reacting to audio
        const avatarMouth = document.getElementById('avatarMouth');
        if (avatarMouth) {
          avatarMouth.classList.toggle('talking', !audio.paused && !audio.ended);
        }
      };

      audio.onended = () => {
        setPlayingState(false);
      };
    };

    // Update Visual Overlay, Live Code, & Camera Framing
    function updateVisual(visual) {
      const card = document.getElementById('activeVisualCard');
      const tag = document.getElementById('visualTag');
      const headline = document.getElementById('visualHeadline');
      const subtitle = document.getElementById('visualSubtitle');
      const ideCode = document.getElementById('ideCodeContent');
      const ideTerm = document.getElementById('ideTerminalBody');
      const arrow = document.getElementById('kinetic-arrow');
      const arrowText = document.getElementById('arrowText');

      if (!card || !headline) return;

      tag.textContent = (visual.type || 'KEY POINT').toUpperCase() + ' • ' + (visual.timestamp.toFixed(1)) + 's';
      tag.style.color = visual.color || 'var(--theme-color)';
      headline.textContent = visual.text;
      subtitle.textContent = visual.subtitle || '';

      card.className = 'overlay-card visible';

      // Update Live IDE Code and Terminal Execution
      if (ideCode && visual.codeSnippet) {
        ideCode.textContent = visual.codeSnippet;
      }
      if (ideTerm && visual.terminalOutput) {
        ideTerm.textContent = visual.terminalOutput;
      }

      // Update Kinetic Pointer Arrow
      if (arrow && arrowText) {
        if (visual.arrowNote) {
          arrowText.textContent = visual.arrowNote;
          arrow.classList.add('visible');
        } else {
          arrow.classList.remove('visible');
        }
      }

      // Adjust Camera Framing Mode
      if (visual.framing) {
        setCameraFraming(visual.framing);
      }

      // Update Teleprompter script view
      const teleprompter = document.getElementById('teleprompterText');
      if (teleprompter) {
        teleprompter.innerHTML = '<strong>' + (visual.type || 'STAGE').toUpperCase() + ' SCRIPT:</strong><br>'
          + '"' + visual.subtitle + '"'
          + '<div class="notes-box"><strong>Production Notes:</strong> ' + visual.text + ' &bull; Camera Framing: ' + visual.framing + '</div>';
      }

      // Update active storyboard tab
      document.querySelectorAll('.sb-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(visual.timestamp.toString()));
      });
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
          alert('Webcam notification: Device access not available (' + err.message + '). Displaying animated human avatar simulation.');
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
        if (btn) btn.textContent = '📹 Toggle Creator Webcam';
        if (pipTagText) pipTagText.textContent = 'YOU ON CAMERA';
        isWebcamActive = false;
      }
    }

    // Interactive Scene Scrubber
    function jumpToScene(timestamp, framing) {
      const audio = document.getElementById('voiceover-audio');
      if (audio) {
        audio.currentTime = timestamp;
        if (audio.paused) {
          audio.play().catch(() => {});
          setPlayingState(true);
        }
      }
      activeVisualTimestamp = null;
      setCameraFraming(framing);

      const matching = activeVisuals.find(v => Math.abs(v.timestamp - timestamp) < 1.0) || activeVisuals[0];
      if (matching) updateVisual(matching);
    }

    // Playback Controls
    function setPlayingState(playing) {
      const icon = document.getElementById('playIcon');
      const text = document.getElementById('playText');
      if (icon) icon.textContent = playing ? '⏸' : '▶';
      if (text) text.textContent = playing ? 'Pause' : 'Play Continuous Audio';
    }

    function togglePlay() {
      const audio = document.getElementById('voiceover-audio');
      if (audio.paused) {
        audio.play().catch(() => {});
        setPlayingState(true);
      } else {
        audio.pause();
        setPlayingState(false);
      }
    }

    function restart() {
      const audio = document.getElementById('voiceover-audio');
      audio.currentTime = 0;
      activeVisualTimestamp = null;
      audio.play().catch(() => {});
      setPlayingState(true);
      if (activeVisuals[0]) updateVisual(activeVisuals[0]);
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

    // Topic Switcher
    function switchTopic(topic, event) {
      if (event) event.preventDefault();
      history.pushState({ topic }, '', '?topic=' + topic);
      loadContentByURL();
    }

    window.addEventListener('popstate', loadContentByURL);
    window.addEventListener('DOMContentLoaded', loadContentByURL);
  </script>
</body>
</html>`;
}
