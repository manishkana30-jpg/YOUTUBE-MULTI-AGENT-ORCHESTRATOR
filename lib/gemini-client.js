import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { costTracker } from './cost-tracker.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

// Rate limit tracking: 60 calls/day (Free tier ceiling protection)
export const geminiRateLimiter = {
  callsPerMinute: 0,
  callsPerDay: 0,
  resetTime: Date.now(),

  async checkLimit() {
    const now = Date.now();
    // Reset daily counter at 24 hours
    if (now - this.resetTime > 24 * 60 * 60 * 1000) {
      this.callsPerDay = 0;
      this.resetTime = now;
    }

    if (this.callsPerDay >= 60) {
      throw new Error('Gemini daily quota exceeded (60 calls/day free tier limit)');
    }

    this.callsPerDay++;
    return true;
  }
};

// Cost tracking helper
export const trackGeminiCost = async (inputTokens = 1500, outputTokens = 1200) => {
  return costTracker.trackGeminiUsage(inputTokens, outputTokens);
};

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
    await geminiRateLimiter.checkLimit();

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

        // Track usage tokens & cost
        await trackGeminiCost(1400, 1100);

        const text = response.text || '';
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const first = cleaned.indexOf('{');
        const last = cleaned.lastIndexOf('}');
        if (first !== -1 && last !== -1) {
          return JSON.parse(cleaned.substring(first, last + 1));
        }
      } catch (err) {
        console.warn('[Gemini Client] API call notice:', err.message);
        throw err;
      }
    }

    throw new Error('Gemini client not initialized or credentials missing.');
  }
}

export const geminiClient = new GeminiClient();
