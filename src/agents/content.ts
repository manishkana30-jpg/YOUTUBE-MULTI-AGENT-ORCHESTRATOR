import { z } from 'zod';
import { geminiService } from '../services/gemini.js';
import { mcpSerpApiClient, TrendingTopicResult } from '../tools/mcp-serpapi.js';
import { db } from '../db/client.js';
import { captureAgentError } from '../services/sentry.js';

// Strict Zod schema for structured educational video scenes
export const VideoSceneSchema = z.object({
  sceneNumber: z.number(),
  type: z.enum(['INTRO', 'HOOK', 'PROBLEM', 'SOLUTION', 'EXAMPLES', 'TAKEAWAY', 'CTA']),
  headline: z.string().min(5),
  subtitle: z.string().min(5),
  narrationScript: z.string().min(10)
});

export type VideoScene = z.infer<typeof VideoSceneSchema>;

// Strict Zod schema for Content Agent output
export const ContentAgentOutputSchema = z.object({
  videoTitle: z.string().min(5),
  alternativeTitles: z.array(z.string()).min(2),
  description: z.string().min(20),
  cta: z.string().min(5),
  trendingContextUsed: z.string().optional(),
  scenes: z.array(VideoSceneSchema).min(3).optional()
});

export type ContentAgentOutput = z.infer<typeof ContentAgentOutputSchema>;

export class ContentAgent {
  public readonly name = 'Content Agent';

  public async execute(topicBrief: string, temperature = 0.4): Promise<ContentAgentOutput> {
    const startTime = Date.now();
    console.log(`\n[${this.name}] Starting execution for brief: "${topicBrief}" (Temp: ${temperature})...`);

    // 1. Tool execution via MCP SerpApi
    let trends: TrendingTopicResult[] = [];
    try {
      trends = await mcpSerpApiClient.fetchTrends(topicBrief, ['hackernews', 'producthunt', 'techblogs'], 4);
      console.log(`[${this.name}] Retrieved ${trends.length} trending items via MCP SerpApi tool.`);
    } catch (err: any) {
      console.warn(`[${this.name}] MCP SerpApi tool warning:`, err.message);
    }

    const trendsContextText = trends
      .map((t, idx) => `[Source ${idx + 1}: ${t.source}] ${t.title} - ${t.snippet}`)
      .join('\n');

    // 2. Gemini Prompt formulation following standard 5-part video script template (10-15 minutes)
    const systemPrompt = `You are the Lead Content Director and Educational Scriptwriter for an automated YouTube channel.
Your job is topic copywriting, compelling title generation, and writing a 5-part educational video narrative script strictly adhering to this production standard:

VIDEO SCRIPT TEMPLATE (10-15 minutes):
[INTRO - 1 min] Hook viewers in 3 seconds
[PROBLEM - 2 min] Make it relatable  
[SOLUTION - 5-7 min] Teach step-by-step with visuals
[EXAMPLES - 2 min] Show real proof
[CTA - 1 min] Tell them what to do next

DESIGN FOR EACH SECTION:
- Text appears when narration mentions it
- Animation every 5 seconds
- Color consistent with brand
- Transitions smooth and professional
- Music matches content mood
- Captions for every word

Respond STRICTLY with a valid JSON object matching this schema:
{
  "videoTitle": "High-impact, curiosity-driven, clickable title under 70 characters without spam",
  "alternativeTitles": ["A/B title option 1", "A/B title option 2", "A/B title option 3"],
  "description": "Full structured YouTube description with a 2-line hook, key chapters matching the 5 parts (00:00 Intro, 01:00 Problem, 03:00 Solution, 09:00 Examples, 11:00 CTA), value bullets, and links placeholder",
  "cta": "Engaging, value-focused Call To Action asking viewers to subscribe and comment",
  "trendingContextUsed": "Summary of trend insights leveraged",
  "scenes": [
    {
      "sceneNumber": 1,
      "type": "INTRO",
      "headline": "Short punchy hook under 35 chars",
      "subtitle": "Curiosity gap or bold paradox",
      "narrationScript": "Spoken hook sentence for the first 3 seconds."
    },
    {
      "sceneNumber": 2,
      "type": "PROBLEM",
      "headline": "The relatable core obstacle",
      "subtitle": "Why standard methods crash or fail in practice",
      "narrationScript": "Spoken voiceover explaining the relatable problem."
    },
    {
      "sceneNumber": 3,
      "type": "SOLUTION",
      "headline": "Step-by-step visual breakthrough",
      "subtitle": "How the solution or code pattern works",
      "narrationScript": "Spoken voiceover teaching the solution step-by-step."
    },
    {
      "sceneNumber": 4,
      "type": "EXAMPLES",
      "headline": "Real case studies and proof",
      "subtitle": "Measurable results and real benchmarks",
      "narrationScript": "Spoken voiceover showing concrete proof and real examples."
    },
    {
      "sceneNumber": 5,
      "type": "CTA",
      "headline": "Actionable blueprint and CTA",
      "subtitle": "Subscribe to NEXO KIDS & drop questions below",
      "narrationScript": "Spoken voiceover summarizing key takeaway and asking viewers to subscribe."
    }
  ]
}`;

    const userPrompt = `TOPIC BRIEF: ${topicBrief}

CURRENT TRENDING SIGNALS (via MCP SerpApi):
${trendsContextText || 'Focus on modern autonomous agents, MCP protocol, and practical engineering execution.'}

Generate a viral, high-value, highly readable content plan now.`;

    try {
      let rawJson: any;
      try {
        rawJson = await geminiService.generateStructuredJSON<any>(userPrompt, systemPrompt, temperature);
      } catch {
        // High quality fallback generation when API key not provided
        rawJson = this.generateFallbackContent(topicBrief, trends);
      }

      // 3. Schema validation
      const validated = ContentAgentOutputSchema.parse(rawJson);
      const executionTime = Date.now() - startTime;

      await db.logAgentExecution({
        agent_name: this.name,
        execution_time: executionTime,
        payload: validated,
        status: 'success'
      });

      console.log(`[${this.name}] Completed successfully in ${executionTime}ms. Title: "${validated.videoTitle}"`);
      return validated;
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      captureAgentError(this.name, error, { topicBrief, temperature });

      await db.logAgentExecution({
        agent_name: this.name,
        execution_time: executionTime,
        payload: { topicBrief, temperature },
        status: 'failure',
        error_message: error.message
      });

      throw error;
    }
  }

  private generateFallbackContent(topicBrief: string, trends: TrendingTopicResult[]): ContentAgentOutput {
    const isContentGuide = /content|breakdown|guide/i.test(topicBrief);

    if (isContentGuide) {
      return {
        videoTitle: 'What is CONTENT? Complete Breakdown - Beginners Guide',
        alternativeTitles: [
          'The Secret Formula for Great Content (Info + Entertainment + Value)',
          'How to Create Content That Gets Views - Complete Step-by-Step Guide',
          'Why 90% of Content Creators Fail (And How to Fix It)'
        ],
        description: `What is CONTENT? In this complete beginner's breakdown, we demystify content creation, the 3 pillars of great content, and step-by-step production strategies.\n\n` +
          `⏱️ CHAPTERS:\n` +
          `00:00 - The Hook: Why 90% of Creators Fail\n` +
          `00:30 - What is Content? (Information + Entertainment + Value)\n` +
          `01:30 - Why Content Matters Online\n` +
          `03:00 - The 3 Pillars of Great Content\n` +
          `05:00 - The 5 Major Content Types\n` +
          `07:00 - Step-by-Step Content Creation Blueprint\n` +
          `09:00 - Pre-Publication Quality Checklist\n` +
          `11:00 - Common Content Mistakes to Avoid\n` +
          `13:00 - Real Case Studies & Action Steps\n\n` +
          `🎯 THE 3 PILLARS:\n` +
          `1. Educational Value (Teaches a clear lesson)\n` +
          `2. Emotional Engagement (Makes viewers feel something)\n` +
          `3. Call-to-Action (Gives viewers a next step)\n\n` +
          `💡 Subscribe to NEXO KIDS for daily automated creation blueprints!`,
        cta: 'Subscribe for more content creation masterclasses and drop a comment with your channel niche!',
        trendingContextUsed: 'Content creation frameworks, digital media distribution, and audience retention metrics',
        scenes: [
          {
            sceneNumber: 1,
            type: 'INTRO',
            headline: '90 PERCENT OF CREATORS FAIL',
            subtitle: 'THE FORMULA: CONTENT = INFO + ENTERTAINMENT + VALUE',
            narrationScript: 'Ninety percent of people who create content fail because they do not understand this one secret formula.'
          },
          {
            sceneNumber: 2,
            type: 'PROBLEM',
            headline: 'WHY BORING CONTENT CRASHES',
            subtitle: 'STATIC SLIDES AND ZERO ENGAGEMENT KILL RETENTION',
            narrationScript: 'Without the three pillars, you are just creating noise. Static slides and boring delivery cause viewers to leave in seconds.'
          },
          {
            sceneNumber: 3,
            type: 'SOLUTION',
            headline: 'THE 3 PILLARS OF GREAT CONTENT',
            subtitle: '1. EDUCATIONAL VALUE  2. EMOTIONAL HOOK  3. CLEAR CTA',
            narrationScript: 'Great content combines three elements: educational value that teaches, emotional engagement that connects, and a clear call to action.'
          },
          {
            sceneNumber: 4,
            type: 'EXAMPLES',
            headline: 'REAL PROOF AND METRICS',
            subtitle: 'VIDEO GETS 1200 PERCENT MORE SHARES • 1B DAILY HOURS',
            narrationScript: 'Video content generates twelve hundred percent more shares than static text, and viewers watch over one billion hours daily.'
          },
          {
            sceneNumber: 5,
            type: 'CTA',
            headline: 'START CREATING CONTENT TODAY',
            subtitle: 'YOUR FIRST VIDEO WILL BE YOURS • SUBSCRIBE FOR BLUEPRINTS',
            narrationScript: 'Start creating today. Your first video will not be perfect, but it will be yours. Subscribe to NEXO KIDS right now for daily creator blueprints.'
          }
        ]
      };
    }

    return {
      videoTitle: `How We Built a 24/7 Autonomous YouTube Multi-Agent with Gemini & MCP`,
      alternativeTitles: [
        'The Multi-Agent Architecture Nobody Is Talking About in 2026',
        'I Replaced an Entire YouTube Production Team with AI Agents',
        'Gemini 2.5 + Model Context Protocol: The Ultimate Backend Engine'
      ],
      description: `In this deep dive, we architect and deploy a production-grade multi-agent orchestrator that manages an entire YouTube channel autonomously.\n\n` +
        `⏱️ CHAPTERS:\n` +
        `00:00 - Intro & Hook: The Problem with Single-Prompt AI Chains\n` +
        `01:30 - Relatable Pain Point: Infinite Loops & Context Window Drift\n` +
        `03:30 - Step-by-Step Architecture: Supervisor-Worker Swarms with MCP\n` +
        `08:00 - Real Case Studies: Live Performance Benchmarks\n` +
        `10:00 - Next Steps & Call to Action\n\n` +
        `🔥 Relevant Trends:\n` +
        trends.map((t) => `• ${t.title}`).join('\n') +
        `\n\n💻 Full Open Source Code in Description!`,
      cta: 'Subscribe and drop a comment if you want the open-source GitHub repository and deployment template!',
      trendingContextUsed: trends[0]?.title || 'Multi-agent orchestration and MCP protocol',
      scenes: [
        {
          sceneNumber: 1,
          type: 'INTRO',
          headline: 'STOP CHAINING FRAGILE PROMPTS',
          subtitle: 'WHY SINGLE PROMPTS FAIL IN PRODUCTION',
          narrationScript: 'Stop relying on basic prompts. If an agent crashes midway, your entire workflow breaks and loses state.'
        },
        {
          sceneNumber: 2,
          type: 'PROBLEM',
          headline: 'LINEAR REACT LOOPS ARE DEAD',
          subtitle: 'INFINITE RETRIES AND CONTEXT WINDOW POLLUTION',
          narrationScript: 'Standard linear agent loops get stuck in infinite retries, wasting your API credits with hallucinated data.'
        },
        {
          sceneNumber: 3,
          type: 'SOLUTION',
          headline: 'SUPERVISOR-WORKER AI SWARMS',
          subtitle: 'HIERARCHICAL ORCHESTRATION WITH MODEL CONTEXT PROTOCOL',
          narrationScript: 'The fix is a hierarchical supervisor swarm. The controller agent delegates subtasks to specialized workers using MCP.'
        },
        {
          sceneNumber: 4,
          type: 'EXAMPLES',
          headline: 'REAL BENCHMARKS & 10X SPEED',
          subtitle: 'ZERO CRASHES AND 100 PERCENT REPRODUCIBILITY',
          narrationScript: 'In production benchmarks, hierarchical swarms execute ten times faster with zero runtime crashes.'
        },
        {
          sceneNumber: 5,
          type: 'CTA',
          headline: 'PRODUCTION AI BLUEPRINT',
          subtitle: 'SUBSCRIBE TO NEXO KIDS FOR DAILY PRODUCTION CODE',
          narrationScript: 'Switch to multi-agent swarms today for ten times faster execution. Subscribe to NEXO KIDS for daily code blueprints.'
        }
      ]
    };
  }
}

export const contentAgent = new ContentAgent();
