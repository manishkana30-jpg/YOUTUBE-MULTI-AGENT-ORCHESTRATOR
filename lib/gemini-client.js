import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

export class GeminiClient {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    this.client = null;

    if (this.apiKey && !this.apiKey.includes('your_gemini_api_key')) {
      try {
        this.client = new GoogleGenAI({ apiKey: this.apiKey });
      } catch (err) {
        console.warn('[Gemini Client] Initialization warning:', err.message);
      }
    }
  }

  async generateStructuredScript(topic) {
    if (this.client) {
      const prompt = `Generate a high-retention 10-minute YouTube video script for: "${topic}".
Output ONLY valid JSON matching this schema:
{
  "title": "Punchy, high-CTR YouTube video title",
  "description": "SEO description with timestamps and keywords",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "tag11", "tag12", "tag13", "tag14", "tag15"],
  "script": [
    { "section": "intro", "text": "Hook sentence (max 10 words). [PAUSE] Next sentence.", "duration": 15, "emotion": "[EXCITED]", "visual": "Vivid visual description" },
    { "section": "problem", "text": "The core struggle viewers face. [PAUSE] Short sentences only.", "duration": 15, "emotion": "[SERIOUS]", "visual": "Visual description" },
    { "section": "solution_step_1", "text": "First actionable step explained simply. [PAUSE] Short sentences.", "duration": 18, "emotion": "[CONFIDENT]", "visual": "Visual description" },
    { "section": "solution_step_2", "text": "Second actionable step. [PAUSE] Action oriented.", "duration": 18, "emotion": "[CONFIDENT]", "visual": "Visual description" },
    { "section": "solution_step_3", "text": "Third actionable step. [PAUSE] Easy to implement.", "duration": 18, "emotion": "[CONFIDENT]", "visual": "Visual description" },
    { "section": "examples", "text": "Real world proof or live benchmark demonstration.", "duration": 15, "emotion": "[WARM]", "visual": "Visual description" },
    { "section": "cta", "text": "Hit subscribe for daily tutorials. Leave a comment below.", "duration": 15, "emotion": "[URGENT]", "visual": "Subscribe animation" }
  ]
}`;

      try {
        const response = await this.client.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: {
            systemInstruction: 'You are an elite YouTube retention director. Respond strictly with valid JSON only.',
            responseMimeType: 'application/json',
            temperature: 0.35
          }
        });

        const text = response.text || '';
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const first = cleaned.indexOf('{');
        const last = cleaned.lastIndexOf('}');
        if (first !== -1 && last !== -1) {
          return JSON.parse(cleaned.substring(first, last + 1));
        }
      } catch (err) {
        console.warn('[Gemini Client] API call notice:', err.message);
      }
    }

    // Adaptive fallback
    return {
      title: `${topic}: The 10-Minute Masterclass`,
      description: `Complete guide to ${topic}. Learn the core fundamentals and advance your skills fast. \n\nTimestamps:\n0:00 - Intro\n0:15 - Problem\n0:35 - Step 1\n0:55 - Step 2\n1:15 - Step 3\n1:35 - Outro`,
      tags: [topic.toLowerCase(), 'tutorial', 'learn fast', 'masterclass', 'guide', '2026', 'tips', 'coding', 'education', 'skills', 'productivity', 'pro tips', 'strategy', 'best practices', 'how to'],
      script: [
        { section: 'intro', text: `Welcome! Today we master ${topic}. Everything you need in under ten minutes.`, duration: 15, emotion: '[EXCITED]', visual: 'Cinematic tech intro with dynamic neon typography' },
        { section: 'problem', text: 'Most tutorials overcomplicate the basics. They waste your precious time.', duration: 15, emotion: '[SERIOUS]', visual: 'Frustrated student staring at a dense textbook' },
        { section: 'solution_step_1', text: 'Step one: Master the core fundamentals. Focus on eighty twenty leverage.', duration: 18, emotion: '[CONFIDENT]', visual: 'Clean code editor with syntax highlighting and live execution' },
        { section: 'solution_step_2', text: 'Step two: Build a practical project immediately. Theory follows practice.', duration: 18, emotion: '[CONFIDENT]', visual: 'Fast typing on mechanical keyboard with terminal output' },
        { section: 'solution_step_3', text: 'Step three: Automate the repetitive tasks. Build scalable workflows.', duration: 18, emotion: '[CONFIDENT]', visual: 'Automated pipeline compiling and running smoothly' },
        { section: 'examples', text: 'Look at these production results. Clean, reproducible, and ten times faster.', duration: 15, emotion: '[WARM]', visual: 'Analytics dashboard with metrics trending up' },
        { section: 'cta', text: 'Subscribe to the channel right now. Drop your questions in the comments below.', duration: 15, emotion: '[URGENT]', visual: 'Subscribe button with bell notification animation' }
      ]
    };
  }
}

export const geminiClient = new GeminiClient();
