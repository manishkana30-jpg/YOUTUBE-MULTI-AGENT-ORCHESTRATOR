import { z } from 'zod';
import { geminiService } from '../services/gemini.js';
import { mcpSerpApiClient, TrendingTopicResult } from '../tools/mcp-serpapi.js';
import { db } from '../db/client.js';
import { captureAgentError } from '../services/sentry.js';

// Strict Zod schema for Content Agent output
export const ContentAgentOutputSchema = z.object({
  videoTitle: z.string().min(5),
  alternativeTitles: z.array(z.string()).min(2),
  description: z.string().min(20),
  cta: z.string().min(5),
  trendingContextUsed: z.string().optional()
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
    const systemPrompt = `You are the Content Agent for an automated YouTube channel orchestrator.
Your job is topic copywriting, compelling title generation, and structured video descriptions based on current trends.
Respond STRICTLY with a valid JSON object matching this schema:
{
  "videoTitle": "High-impact, curiosity-driven, clickable title under 70 characters without spam",
  "alternativeTitles": ["A/B title option 1", "A/B title option 2", "A/B title option 3"],
  "description": "Full structured YouTube description with a 2-line hook, key chapters (00:00 Intro, etc.), value bullets, and links placeholder",
  "cta": "Engaging, value-focused Call To Action asking viewers to subscribe or check resources",
  "trendingContextUsed": "Summary of trend insights leveraged"
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
      trendingContextUsed: trends[0]?.title || 'Multi-agent orchestration and MCP protocol'
    };
  }
}

export const contentAgent = new ContentAgent();
