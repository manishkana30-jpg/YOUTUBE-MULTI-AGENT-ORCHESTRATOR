export interface VoiceoverSegment {
  segmentNumber: number;
  startTime: number;
  duration: number;
  text: string;
  visual: string;
  animation: string;
  badge: string;
}

export interface TopicContent {
  topic: string;
  title: string;
  headline: string;
  subtitle: string;
  descriptionHtml: string;
  color: string;
  secondaryColor: string;
  bgColor: string;
  bgCard: string;
  fontFamily: string;
  bRollType: string;
  bRollSnippet: {
    title: string;
    badge: string;
    code: string;
    language: string;
    diagramTitle: string;
    diagramItems: string[];
    metricValue: string;
    metricLabel: string;
  };
  voiceover: VoiceoverSegment[];
}

export const TOPIC_DATA: Record<string, TopicContent> = {
  python: {
    topic: 'python',
    title: 'Python 3.12 Deep Dive — Asyncio, Generators & Production Architecture',
    headline: 'HIGH-THROUGHPUT ASYNCIO ARCHITECTURE',
    subtitle: 'From Event Loops to Concurrent Gather Pipelines in Python 3.12',
    descriptionHtml: `
      <p>Master modern Python from the ground up: from core syntax to high-throughput asynchronous execution, generators, context managers, and scalable backend design.</p>
      <ul>
        <li>⚡ <strong>Asyncio Event Loop:</strong> Non-blocking coroutines with <code>async/await</code></li>
        <li>🧩 <strong>Generators & Memory:</strong> Lazy evaluation and stream processing with <code>yield</code></li>
        <li>🔒 <strong>Production Context:</strong> Type hints, Pydantic v2, and FastAPI integration</li>
      </ul>
    `,
    color: '#3B82F6',          // Electric Blue
    secondaryColor: '#F59E0B', // Python Gold
    bgColor: '#080E1C',
    bgCard: '#0F1A30',
    fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
    bRollType: 'code-runtime',
    bRollSnippet: {
      title: 'async_worker.py',
      badge: 'ASYNC EVENT LOOP',
      code: `async def fetch_pipeline(tasks: list[Task]) -> list[Result]:
    async with asyncio.TaskGroup() as tg:
        workers = [tg.create_task(run_worker(t)) for t in tasks]
    return [w.result() for w in workers]`,
      language: 'python',
      diagramTitle: 'Asyncio Non-Blocking Flow',
      diagramItems: ['Task Queue', 'Event Loop Selector', 'Thread Pool Executor', 'Zero-Copy Buffer'],
      metricValue: '10x Speed',
      metricLabel: 'I/O Bound Latency Reduction'
    },
    voiceover: [
      {
        segmentNumber: 1,
        startTime: 0,
        duration: 4,
        badge: '01. HOOK',
        text: 'Welcome to the Python masterclass. Let us start by looking at asynchronous coroutines in Python 3.12.',
        visual: 'python-hook',
        animation: 'pulse-blue'
      },
      {
        segmentNumber: 2,
        startTime: 4,
        duration: 4,
        badge: '02. PROBLEM',
        text: 'Standard synchronous Python scripts block the thread on I/O operations, stalling performance.',
        visual: 'python-problem',
        animation: 'slide-error'
      },
      {
        segmentNumber: 3,
        startTime: 8,
        duration: 4,
        badge: '03. SOLUTION',
        text: 'Using asyncio event loops and concurrent gather tasks, execution speeds up by over eight times.',
        visual: 'python-solution',
        animation: 'circuit-flow'
      },
      {
        segmentNumber: 4,
        startTime: 12,
        duration: 4,
        badge: '04. EXAMPLES',
        text: 'In production workloads, benchmarks show latency dropping from 1200 milliseconds down to 140.',
        visual: 'python-examples',
        animation: 'metrics-rise'
      },
      {
        segmentNumber: 5,
        startTime: 16,
        duration: 4,
        badge: '05. CTA',
        text: 'Subscribe to NEXO KIDS and check out the open-source repository in the description below!',
        visual: 'python-cta',
        animation: 'glow-subscribe'
      }
    ]
  },

  javascript: {
    topic: 'javascript',
    title: 'Modern JavaScript — Event Loop, Microtasks & V8 Engine Internals',
    headline: 'UNDER THE HOOD OF V8 & MICROTASKS',
    subtitle: 'Demystifying the Call Stack, Promises, and 60fps Event Scheduling',
    descriptionHtml: `
      <p>Demystify JavaScript under the hood. Understand the call stack, event loop phases, macrotask vs microtask queues, and memory management in modern V8.</p>
      <ul>
        <li>⚡ <strong>Microtask Priority:</strong> Promises & <code>queueMicrotask()</code> execution timing</li>
        <li>🔄 <strong>Event Loop Phases:</strong> Timers, I/O polling, and RAF rendering ticks</li>
        <li>🚀 <strong>Memory Architecture:</strong> Garbage collection cycles and hidden classes</li>
      </ul>
    `,
    color: '#F7DF1E',          // Cyber Gold
    secondaryColor: '#10B981', // Mint
    bgColor: '#12120A',
    bgCard: '#1E1E14',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    bRollType: 'event-loop',
    bRollSnippet: {
      title: 'event_loop.js',
      badge: 'MICROTASKS QUEUE',
      code: `console.log('Script Start');
queueMicrotask(() => console.log('Microtask Priority'));
Promise.resolve().then(() => console.log('Promise Resolved'));
requestAnimationFrame(() => renderSmoothFrame());`,
      language: 'javascript',
      diagramTitle: 'V8 Engine Execution Phases',
      diagramItems: ['Call Stack', 'Microtask Queue', 'Macrotask Queue', 'Render Pipeline'],
      metricValue: '60 FPS',
      metricLabel: 'Zero Main-Thread Freezes'
    },
    voiceover: [
      {
        segmentNumber: 1,
        startTime: 0,
        duration: 4,
        badge: '01. HOOK',
        text: 'JavaScript runs on a single thread, yet powers massive real-time web applications worldwide.',
        visual: 'js-hook',
        animation: 'neon-flash'
      },
      {
        segmentNumber: 2,
        startTime: 4,
        duration: 4,
        badge: '02. PROBLEM',
        text: 'Long-running synchronous loops lock the UI main thread, causing severe frame drops and jank.',
        visual: 'js-problem',
        animation: 'stack-overflow'
      },
      {
        segmentNumber: 3,
        startTime: 8,
        duration: 4,
        badge: '03. SOLUTION',
        text: 'The V8 event loop delegates asynchronous work to the microtask queue, maintaining sixty frames per second.',
        visual: 'js-solution',
        animation: 'event-loop-spin'
      },
      {
        segmentNumber: 4,
        startTime: 12,
        duration: 4,
        badge: '04. EXAMPLES',
        text: 'Optimizing microtask scheduling reduces Interaction to Next Paint to under fifty milliseconds.',
        visual: 'js-examples',
        animation: 'render-boost'
      },
      {
        segmentNumber: 5,
        startTime: 16,
        duration: 4,
        badge: '05. CTA',
        text: 'Subscribe now and level up your frontend architecture with weekly deep dives!',
        visual: 'js-cta',
        animation: 'glow-subscribe'
      }
    ]
  },

  webdev: {
    topic: 'webdev',
    title: 'Full-Stack Web Development 2026 — Modern CSS, View Transitions & Edge APIs',
    headline: 'NATIVE VIEW TRANSITIONS & MODERN CSS',
    subtitle: 'Building Fluid Single Page Experiences with Zero Layout Shifts',
    descriptionHtml: `
      <p>A complete guide to modern web development: native View Transitions, fluid container queries, CSS <code>:has()</code>, and zero-bundle-size edge server rendering.</p>
      <ul>
        <li>✨ <strong>View Transitions API:</strong> Smooth morphing between states with <code>startViewTransition()</code></li>
        <li>📐 <strong>Fluid Modern CSS:</strong> Container queries, subgrid, and modern color spaces</li>
        <li>🌐 <strong>Edge Computing:</strong> Sub-millisecond latency with global serverless caching</li>
      </ul>
    `,
    color: '#06B6D4',          // Cyan
    secondaryColor: '#8B5CF6', // Vibrant Violet
    bgColor: '#09101E',
    bgCard: '#131E35',
    fontFamily: "'Space Grotesk', sans-serif",
    bRollType: 'view-transition',
    bRollSnippet: {
      title: 'transitions.css',
      badge: 'NATIVE VIEW TRANSITIONS',
      code: `::view-transition-old(hero),
::view-transition-new(hero) {
  animation-duration: 350ms;
  mix-blend-mode: normal;
}
@supports (view-transition-name: hero) { ... }`,
      language: 'css',
      diagramTitle: 'DOM State Morphing',
      diagramItems: ['Old State Snapshot', 'Pseudo-Element Tree', 'Cross-Fade Blend', 'Active Layout'],
      metricValue: '100 Score',
      metricLabel: 'Core Web Vitals Pass Rate'
    },
    voiceover: [
      {
        segmentNumber: 1,
        startTime: 0,
        duration: 4,
        badge: '01. HOOK',
        text: 'Web development has evolved dramatically with native View Transitions and modern CSS architecture.',
        visual: 'webdev-hook',
        animation: 'morph-screen'
      },
      {
        segmentNumber: 2,
        startTime: 4,
        duration: 4,
        badge: '02. PROBLEM',
        text: 'Traditional Single Page Applications suffer from harsh layout shifts and bloated JavaScript bundles.',
        visual: 'webdev-problem',
        animation: 'layout-shift'
      },
      {
        segmentNumber: 3,
        startTime: 8,
        duration: 4,
        badge: '03. SOLUTION',
        text: 'With the document.startViewTransition API, pages morph seamlessly with native browser hardware acceleration.',
        visual: 'webdev-solution',
        animation: 'smooth-transition'
      },
      {
        segmentNumber: 4,
        startTime: 12,
        duration: 4,
        badge: '04. EXAMPLES',
        text: 'Production implementations achieve perfect one hundred Lighthouse scores with zero cumulative layout shift.',
        visual: 'webdev-examples',
        animation: 'lighthouse-100'
      },
      {
        segmentNumber: 5,
        startTime: 16,
        duration: 4,
        badge: '05. CTA',
        text: 'Hit subscribe and ring the bell to get our full-stack web development design templates!',
        visual: 'webdev-cta',
        animation: 'glow-subscribe'
      }
    ]
  },

  ai: {
    topic: 'ai',
    title: 'Autonomous AI Multi-Agent Systems — Supervisor Swarms & Model Context Protocol',
    headline: 'SUPERVISOR-WORKER AGENT SWARMS',
    subtitle: 'Hierarchical Orchestration with Model Context Protocol & Gemini 2.5',
    descriptionHtml: `
      <p>Architect, build, and deploy production-grade multi-agent swarms. Learn supervisor-worker routing, real-time tool invocation with MCP, and resilient state recovery.</p>
      <ul>
        <li>🤖 <strong>Hierarchical Swarms:</strong> Controller supervisors with specialized worker subagents</li>
        <li>🔌 <strong>Model Context Protocol:</strong> Dynamic real-world tool discovery and execution</li>
        <li>🛡️ <strong>Self-Healing State:</strong> Automated error boundaries and retry backoff strategies</li>
      </ul>
    `,
    color: '#10B981',          // Matrix Emerald
    secondaryColor: '#00F0FF', // Neural Cyan
    bgColor: '#071510',
    bgCard: '#11261D',
    fontFamily: "'Outfit', sans-serif",
    bRollType: 'neural-swarm',
    bRollSnippet: {
      title: 'swarm_orchestrator.ts',
      badge: 'MCP AGENT SWARM',
      code: `const supervisor = new AgentSupervisor({
  workers: [contentAgent, seoAgent, designAgent],
  protocol: ModelContextProtocol.v1,
  resilience: { maxRetries: 3, circuitBreaker: true }
});
await supervisor.orchestrate(topicBrief);`,
      language: 'typescript',
      diagramTitle: 'Supervisor Delegation Flow',
      diagramItems: ['Supervisor Brain', 'Content Agent', 'SEO Optimizer', 'Video Generator'],
      metricValue: '10x Speed',
      metricLabel: 'Autonomous Task Parallelism'
    },
    voiceover: [
      {
        segmentNumber: 1,
        startTime: 0,
        duration: 4,
        badge: '01. HOOK',
        text: 'Single-prompt AI chains are dead in production. Today we architect multi-agent autonomous swarms.',
        visual: 'ai-hook',
        animation: 'neural-pulse'
      },
      {
        segmentNumber: 2,
        startTime: 4,
        duration: 4,
        badge: '02. PROBLEM',
        text: 'Linear agent loops get trapped in infinite retry loops, rapidly burning through API tokens and drift.',
        visual: 'ai-problem',
        animation: 'agent-crash'
      },
      {
        segmentNumber: 3,
        startTime: 8,
        duration: 4,
        badge: '03. SOLUTION',
        text: 'Supervisor agents delegate microtasks concurrently to specialized workers using the Model Context Protocol.',
        visual: 'ai-solution',
        animation: 'swarm-network'
      },
      {
        segmentNumber: 4,
        startTime: 12,
        duration: 4,
        badge: '04. EXAMPLES',
        text: 'Hierarchical swarms achieve ten times faster task execution with zero unhandled crash states.',
        visual: 'ai-examples',
        animation: 'tenx-speed'
      },
      {
        segmentNumber: 5,
        startTime: 16,
        duration: 4,
        badge: '05. CTA',
        text: 'Subscribe to NEXO KIDS right now for daily production code and autonomous architecture blueprints!',
        visual: 'ai-cta',
        animation: 'glow-subscribe'
      }
    ]
  },

  general: {
    topic: 'general',
    title: 'Content Creation Masterclass — The 3 Pillars of High-Retention Video',
    headline: 'THE 3 PILLARS OF HIGH-RETENTION CONTENT',
    subtitle: 'Information + Entertainment + Value = Viral Educational Media',
    descriptionHtml: `
      <p>Unlock the proven formula for digital media: Information + Entertainment + Value. Build high-converting educational videos with automated workflow architecture.</p>
      <ul>
        <li>🎯 <strong>The 3 Pillars:</strong> Educational value, emotional engagement, and clear CTA</li>
        <li>🎬 <strong>Visual Flow:</strong> Motion graphics every 5 seconds and dynamic typography</li>
        <li>📈 <strong>Audience Retention:</strong> Hook viewers in the first 3 seconds to maximize watch time</li>
      </ul>
    `,
    color: '#FF2A55',          // Neon Crimson
    secondaryColor: '#6366F1', // Electric Indigo
    bgColor: '#140A10',
    bgCard: '#24121C',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    bRollType: 'storyboard',
    bRollSnippet: {
      title: 'retention_formula.ts',
      badge: 'CONTENT RETENTION',
      code: `const retentionFormula = {
  hook3s: 'Pattern Interrupt & Bold Paradox',
  problem: 'Relatable Core Obstacle',
  solution: 'Step-by-step Visual Breakthrough',
  examples: 'Proven Production Metrics (10x)',
  cta: 'Actionable Next Step & Subscribe'
};`,
      language: 'typescript',
      diagramTitle: '5-Part Script Pipeline',
      diagramItems: ['[INTRO - 1m]', '[PROBLEM - 2m]', '[SOLUTION - 6m]', '[EXAMPLES - 2m]', '[CTA - 1m]'],
      metricValue: '85%+',
      metricLabel: 'Audience Average Percentage Viewed'
    },
    voiceover: [
      {
        segmentNumber: 1,
        startTime: 0,
        duration: 4,
        badge: '01. HOOK',
        text: 'Ninety percent of video creators fail because they do not understand the three core pillars of content.',
        visual: 'general-hook',
        animation: 'viral-hook'
      },
      {
        segmentNumber: 2,
        startTime: 4,
        duration: 4,
        badge: '02. PROBLEM',
        text: 'Static slides and monotone delivery cause audience retention to drop by seventy percent in the first ten seconds.',
        visual: 'general-problem',
        animation: 'dropoff-curve'
      },
      {
        segmentNumber: 3,
        startTime: 8,
        duration: 4,
        badge: '03. SOLUTION',
        text: 'By combining educational value, kinetic visuals every five seconds, and a clear call to action, viewers stay locked in.',
        visual: 'general-solution',
        animation: 'three-pillars'
      },
      {
        segmentNumber: 4,
        startTime: 12,
        duration: 4,
        badge: '04. EXAMPLES',
        text: 'Case studies show dynamic kinetic typography triples audience watch time and comment engagement.',
        visual: 'general-examples',
        animation: 'retention-surge'
      },
      {
        segmentNumber: 5,
        startTime: 16,
        duration: 4,
        badge: '05. CTA',
        text: 'Subscribe now and start creating high-impact videos with our automated production engine!',
        visual: 'general-cta',
        animation: 'glow-subscribe'
      }
    ]
  }
};

export function getTopicData(topic: string): TopicContent {
  const normalized = (topic || '').toLowerCase().trim();
  return TOPIC_DATA[normalized] || TOPIC_DATA.general;
}
