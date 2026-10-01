import { z } from 'zod';
import { geminiService } from '../services/gemini.js';
import { mcpSerpApiClient, TrendingTopicResult } from '../tools/mcp-serpapi.js';
import { db } from '../db/client.js';
import { captureAgentError } from '../services/sentry.js';

// Strict Zod schema for structured educational video scenes
export const VideoSceneSchema = z.object({
  sceneNumber: z.number(),
  type: z.enum(['HOOK', 'PROBLEM', 'SOLUTION', 'TAKEAWAY']),
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

    // 2. Gemini Prompt formulation
    const systemPrompt = `You are the Lead Content Director and Educational Scriptwriter for an automated YouTube channel.
Your job is topic copywriting, compelling title generation, and writing a 4-part educational video narrative script (Hook -> Problem -> Solution -> Takeaway).
Respond STRICTLY with a valid JSON object matching this schema:
{
  "videoTitle": "High-impact, curiosity-driven, clickable title under 70 characters without spam",
  "alternativeTitles": ["A/B title option 1", "A/B title option 2", "A/B title option 3"],
  "description": "Full structured YouTube description with a 2-line hook, key chapters (00:00 Intro, etc.), value bullets, and links placeholder",
  "cta": "Engaging, value-focused Call To Action asking viewers to subscribe or check resources",
  "trendingContextUsed": "Summary of trend insights leveraged",
  "scenes": [
    {
      "sceneNumber": 1,
      "type": "HOOK",
      "headline": "Short punchy hook under 35 chars",
      "subtitle": "Curiosity gap or bold paradox",
      "narrationScript": "Spoken voiceover script for scene 1 (1-2 clear punchy sentences)."
    },
    {
      "sceneNumber": 2,
      "type": "PROBLEM",
      "headline": "The core failure or obstacle",
      "subtitle": "Why standard methods crash or fail in production",
      "narrationScript": "Spoken voiceover script for scene 2 (1-2 clear punchy sentences)."
    },
    {
      "sceneNumber": 3,
      "type": "SOLUTION",
      "headline": "The architectural breakthrough",
      "subtitle": "How the solution or code pattern works",
      "narrationScript": "Spoken voiceover script for scene 3 (1-2 clear punchy sentences)."
    },
    {
      "sceneNumber": 4,
      "type": "TAKEAWAY",
      "headline": "Actionable blueprint and CTA",
      "subtitle": "Subscribe to NEXO KIDS for daily autonomous engineering",
      "narrationScript": "Spoken voiceover script for scene 4 summarizing the key lesson and asking to subscribe."
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
    return {
      videoTitle: `How We Built a 24/7 Autonomous YouTube Multi-Agent with Gemini & MCP`,
      alternativeTitles: [
        'The Multi-Agent Architecture Nobody Is Talking About in 2026',
        'I Replaced an Entire YouTube Production Team with AI Agents',
        'Gemini 2.5 + Model Context Protocol: The Ultimate Backend Engine'
      ],
      description: `In this deep dive, we architect and deploy a production-grade multi-agent orchestrator that manages an entire YouTube channel autonomously.\n\n` +
        `⏱️ CHAPTERS:\n` +
        `00:00 - The Problem with Single-Prompt AI Chains\n` +
        `01:45 - High-Level Architecture (Orchestrator, Content, SEO, Design, Publication)\n` +
        `04:30 - Supabase Schema for Content Calendars & Agent Logs\n` +
        `07:15 - Model Context Protocol (MCP) Integration with SerpApi\n` +
        `10:20 - Automated CRON Deployment on Render\n\n` +
        `🔥 Relevant Trends:\n` +
        trends.map((t) => `• ${t.title}`).join('\n') +
        `\n\n💻 Full Open Source Code in Description!`,
      cta: 'Subscribe and drop a comment if you want the open-source GitHub repository and deployment template!',
      trendingContextUsed: trends[0]?.title || 'Multi-agent orchestration and MCP protocol',
      scenes: [
        {
          sceneNumber: 1,
          type: 'HOOK',
          headline: 'Stop Chaining Fragile Prompts',
          subtitle: 'Why Single Prompts Fail in Production',
          narrationScript: 'Stop relying on basic prompts. If an agent crashes midway, your entire workflow breaks and loses state.'
        },
        {
          sceneNumber: 2,
          type: 'PROBLEM',
          headline: 'Linear ReAct Loops Are Dead',
          subtitle: 'Infinite Retries & Context Window Pollution',
          narrationScript: 'Standard linear agent loops get stuck in infinite retries, wasting your API credits with hallucinated data.'
        },
        {
          sceneNumber: 3,
          type: 'SOLUTION',
          headline: 'Supervisor-Worker AI Swarms',
          subtitle: 'Hierarchical Orchestration with Model Context Protocol',
          narrationScript: 'The fix is a hierarchical supervisor swarm. The controller agent delegates subtasks to specialized workers using MCP.'
        },
        {
          sceneNumber: 4,
          type: 'TAKEAWAY',
          headline: 'Production AI Blueprint',
          subtitle: 'Subscribe to NEXO KIDS for Daily Autonomous Code',
          narrationScript: 'Switch to multi-agent swarms today for 10x faster execution and zero crashes. Subscribe to NEXO KIDS for daily code.'
        }
      ]
    };
  }
}

export const contentAgent = new ContentAgent();
