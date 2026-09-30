import { z } from 'zod';
import { geminiService } from '../services/gemini.js';
import { ContentAgentOutput } from './content.js';
import { SEOAgentOutput } from './seo.js';
import { db } from '../db/client.js';
import { captureAgentError } from '../services/sentry.js';

export const DesignAgentOutputSchema = z.object({
  primary_color: z.string(),
  text_overlay: z.string().max(35),
  font_style: z.string(),
  reaction_face: z.string(),
  visual_elements: z.array(z.string()).min(2),
  composition_layout: z.string(),
  contrast_rating: z.string().optional()
});

export type DesignAgentOutput = z.infer<typeof DesignAgentOutputSchema>;

export class DesignAgent {
  public readonly name = 'Design Agent';

  public async execute(
    content: ContentAgentOutput,
    seo?: SEOAgentOutput,
    temperature = 0.4
  ): Promise<DesignAgentOutput> {
    const startTime = Date.now();
    console.log(`\n[${this.name}] Formulating high-CTR thumbnail strategy for: "${content.videoTitle}"...`);

    const systemPrompt = `You are a world-class YouTube Thumbnail Art Director and High-CTR Growth Designer.
Formulate a thumbnail visual strategy with high contrast and maximum click-through appeal.
Respond STRICTLY with a valid JSON object matching this schema:
{
  "primary_color": "Hex color code and color theory rationale (e.g. #FF3366 Neon Cyber Crimson)",
  "text_overlay": "3-4 words MAXIMUM, high curiosity or contrast hook",
  "font_style": "Font family, weight, and treatment (e.g. Montserrat ExtraBold / Yellow drop-shadow / 3D emboss)",
  "reaction_face": "Exact face framing, emotion, and eye gaze direction (e.g. Intense analytical shock, eyes focused on glowing terminal)",
  "visual_elements": ["Element 1: Glowing agent node graph", "Element 2: 24/7 autonomous badge", "Element 3: Minimalist IDE screenshot"],
  "composition_layout": "Rule of thirds description: subject on right 1/3, high-impact text in top-left, depth of field blur on background",
  "contrast_rating": "A+ (98% contrast against dark YouTube mobile theme)"
}`;

    const topKeywords = seo?.tags?.length ? seo.tags.slice(0, 5).join(', ') : content.videoTitle;
    const userPrompt = `VIDEO DATA:
Title: ${content.videoTitle}
Description Hook: ${content.description.substring(0, 150)}
Top SEO Keywords: ${topKeywords}

Design a thumb-stopping visual specification for the downstream image generation pipeline now.`;

    try {
      let rawJson: any;
      try {
        rawJson = await geminiService.generateStructuredJSON<any>(userPrompt, systemPrompt, temperature);
      } catch {
        rawJson = this.generateFallbackDesign(content);
      }

      const validated = DesignAgentOutputSchema.parse(rawJson);
      const executionTime = Date.now() - startTime;

      await db.logAgentExecution({
        agent_name: this.name,
        execution_time: executionTime,
        payload: validated,
        status: 'success'
      });

      console.log(`[${this.name}] Completed successfully in ${executionTime}ms. Text Overlay: "${validated.text_overlay}" | Color: ${validated.primary_color}`);
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

  private generateFallbackDesign(content: ContentAgentOutput): DesignAgentOutput {
    return {
      primary_color: '#FF0055 Neon Electric Crimson with Deep Obsidian #0A0A0F',
      text_overlay: 'IT RUNS ITSELF?!',
      font_style: 'Impact / Neue Haas Grotesk 900 Black with 4px neon yellow border and subtle 3D tilt',
      reaction_face: 'Astonished developer with hands hovering above keyboard, looking directly at floating holographic agent nodes',
      visual_elements: [
        'Holographic glowing diagram showing 5 connected AI agents exchanging JSON payloads',
        'Supabase & Gemini glowing vector logos in corner badge',
        'Vibrant bokeh blur background simulating modern dark-mode IDE with streaming execution logs'
      ],
      composition_layout: 'Subject face positioned at right 35% with eye level on upper third line. High-contrast 3-word hook placed upper left with dark vignette backplate.',
      contrast_rating: 'A+ (Optimized for YouTube Mobile Dark and Light modes)'
    };
  }
}

export const designAgent = new DesignAgent();
