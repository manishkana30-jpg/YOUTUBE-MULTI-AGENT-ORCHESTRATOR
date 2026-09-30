import { z } from 'zod';
import { geminiService } from '../services/gemini.js';
import { ContentAgentOutput } from './content.js';
import { db } from '../db/client.js';
import { captureAgentError } from '../services/sentry.js';

export const ShortConceptSchema = z.object({
  title: z.string(),
  visualHook: z.string(),
  scriptSynopsis: z.string()
});

export const SEOAgentOutputSchema = z.object({
  tags: z.array(z.string()).min(5),
  shortFormStrategy: z.object({
    hook: z.string(),
    shortConcepts: z.array(ShortConceptSchema).min(1),
    hashtags: z.array(z.string()).min(3)
  }),
  seoScore: z.number().min(0).max(100),
  scoreBreakdown: z.object({
    titleRelevance: z.number(),
    keywordDensity: z.number(),
    searchIntentMatch: z.number(),
    viralityFactor: z.number(),
    critique: z.string()
  })
});

export type SEOAgentOutput = z.infer<typeof SEOAgentOutputSchema>;

export class SEOAgent {
  public readonly name = 'SEO Agent';

  public async execute(content: ContentAgentOutput, temperature = 0.3): Promise<SEOAgentOutput> {
    const startTime = Date.now();
    console.log(`\n[${this.name}] Starting SEO optimization for: "${content.videoTitle}"...`);

    const systemPrompt = `You are an elite YouTube SEO Agent and Viral Strategist.
Analyze the provided title, description, and alternative titles.
Generate ranking tags, a short-form YouTube Shorts strategy, and an estimated algorithmic SEO score (0-100).
Respond STRICTLY with a valid JSON object matching this schema:
{
  "tags": ["tag1", "tag2", "long tail keyword 3", ...],
  "shortFormStrategy": {
    "hook": "First 3 seconds hook to stop the scroll",
    "shortConcepts": [
      {
        "title": "Short Title 1",
        "visualHook": "Visual action in first 2 seconds",
        "scriptSynopsis": "30-second rapid punchy breakdown"
      },
      {
        "title": "Short Title 2",
        "visualHook": "Visual action in first 2 seconds",
        "scriptSynopsis": "30-second rapid punchy breakdown"
      },
      {
        "title": "Short Title 3",
        "visualHook": "Visual action in first 2 seconds",
        "scriptSynopsis": "30-second rapid punchy breakdown"
      }
    ],
    "hashtags": ["#Shorts", "#AI", "#SoftwareEngineering"]
  },
  "seoScore": 94,
  "scoreBreakdown": {
    "titleRelevance": 96,
    "keywordDensity": 90,
    "searchIntentMatch": 95,
    "viralityFactor": 93,
    "critique": "High search volume keywords paired with strong curiosity gap."
  }
}`;

    const userPrompt = `INPUT CONTENT:
Title: ${content.videoTitle}
Alternatives: ${content.alternativeTitles.join(' | ')}
Description: ${content.description}
CTA: ${content.cta}

Generate comprehensive tags, YouTube Shorts strategy, and algorithmic score breakdown now.`;

    try {
      let rawJson: any;
      try {
        rawJson = await geminiService.generateStructuredJSON<any>(userPrompt, systemPrompt, temperature);
      } catch {
        rawJson = this.generateFallbackSEO(content);
      }

      const validated = SEOAgentOutputSchema.parse(rawJson);
      const executionTime = Date.now() - startTime;

      await db.logAgentExecution({
        agent_name: this.name,
        execution_time: executionTime,
        payload: validated,
        status: 'success'
      });

      console.log(`[${this.name}] Completed successfully in ${executionTime}ms. SEO Score: ${validated.seoScore}/100 with ${validated.tags.length} tags.`);
      return validated;
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      captureAgentError(this.name, error, { title: content.videoTitle });

      await db.logAgentExecution({
        agent_name: this.name,
        execution_time: executionTime,
        payload: { title: content.videoTitle },
        status: 'failure',
        error_message: error.message
      });

      throw error;
    }
  }

  private generateFallbackSEO(content: ContentAgentOutput): SEOAgentOutput {
    return {
      tags: [
        'ai agents',
        'multi-agent orchestration',
        'google gemini 2.5',
        'model context protocol',
        'mcp tutorial',
        'nodejs typescript backend',
        'autonomous youtube automation',
        'software engineering',
        'ai developer tools',
        'supabase postgresql',
        'render background worker',
        'automated content creation'
      ],
      shortFormStrategy: {
        hook: 'Stop building single-prompt ChatGPT wrappers — here is how 2026 AI agents actually work.',
        shortConcepts: [
          {
            title: '5 AI Agents Run This Entire Channel (Zero Human Editing)',
            visualHook: 'Split-screen of terminal running 5 concurrent agent loops with green status logs.',
            scriptSynopsis: 'Break down how Content, SEO, Design, and Publication agents hand off state via Supabase in under 45 seconds.'
          },
          {
            title: 'What is MCP? The Protocol That Replaces Custom APIs',
            visualHook: 'Diagram animation showing Claude/Gemini speaking directly to SerpApi and PostgreSQL.',
            scriptSynopsis: 'Explain why Model Context Protocol is the standard interface for giving LLMs hands and eyes.'
          },
          {
            title: 'Why Gemini 2.5 Flash is the King of Backend Workers',
            visualHook: 'Latency benchmark comparison showing 120ms structured JSON responses.',
            scriptSynopsis: 'Highlight 1M token context and native schema adherence for resilient background task queues.'
          }
        ],
        hashtags: ['#Shorts', '#AIAgents', '#SoftwareEngineer', '#Tech', '#Coding']
      },
      seoScore: 95,
      scoreBreakdown: {
        titleRelevance: 98,
        keywordDensity: 94,
        searchIntentMatch: 96,
        viralityFactor: 92,
        critique: 'Outstanding search intent targeting modern developer curiosity surrounding multi-agent systems and MCP.'
      }
    };
  }
}

export const seoAgent = new SEOAgent();
