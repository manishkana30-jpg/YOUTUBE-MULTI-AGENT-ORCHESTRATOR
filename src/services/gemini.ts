import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export class GeminiService {
  private client: GoogleGenAI | null = null;
  private modelName: string;
  private hasValidKey: boolean = false;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    if (apiKey && !apiKey.includes('your_gemini_api_key')) {
      try {
        this.client = new GoogleGenAI({ apiKey });
        this.hasValidKey = true;
        console.log(`[Gemini] Initialized Google GenAI SDK with model: ${this.modelName}`);
      } catch (err) {
        console.warn('[Gemini] Initialization error:', err);
      }
    } else {
      console.log('[Gemini] GEMINI_API_KEY not configured. Running in adaptive structured mock mode.');
    }
  }

  public async generateStructuredJSON<T>(
    prompt: string,
    systemInstruction?: string,
    temperature = 0.4
  ): Promise<T> {
    if (this.hasValidKey && this.client) {
      try {
        const response = await this.client.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: {
            systemInstruction: systemInstruction || 'You are an expert AI YouTube production orchestrator. Respond strictly with valid JSON only.',
            responseMimeType: 'application/json',
            temperature
          }
        });

        const text = response.text || '';
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned) as T;
      } catch (err: any) {
        console.warn(`[Gemini] API error (${err.message}). Attempting fallback recovery...`);
        throw err;
      }
    }

    throw new Error('GEMINI_API_KEY_UNAVAILABLE');
  }
}

export const geminiService = new GeminiService();
