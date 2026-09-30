import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export class GeminiService {
  private client: GoogleGenAI | null = null;
  private activeModel: string = 'gemini-3.5-flash-lite';
  private hasValidKey: boolean = false;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    this.activeModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

    if (apiKey && !apiKey.includes('your_gemini_api_key')) {
      try {
        this.client = new GoogleGenAI({ apiKey });
        this.hasValidKey = true;
        console.log(`[Gemini] Initialized Google GenAI SDK with active model: ${this.activeModel}`);
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
      // Prioritize active model and fast reliable production models
      const candidateModels = Array.from(new Set([
        this.activeModel,
        'gemini-3.5-flash-lite',
        'gemini-3.8-flash',
        'gemini-2.5-flash',
        'gemini-1.5-flash'
      ]));

      let lastError: any = null;
      for (const model of candidateModels) {
        try {
          const response = await this.client.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction: systemInstruction || 'You are an expert AI YouTube production orchestrator. Respond strictly with valid JSON only.',
              responseMimeType: 'application/json',
              temperature
            }
          });

          const text = response.text || '';
          let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const firstBrace = cleaned.indexOf('{');
          const lastBrace = cleaned.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
          }
          // Lock onto successful model to eliminate failover latency in subsequent agent steps
          this.activeModel = model;
          return JSON.parse(cleaned) as T;
        } catch (err: any) {
          lastError = err;
          console.warn(`[Gemini] Model ${model} unavailable (${err?.message || err?.status || '503'}). Fast-switching to next candidate...`);
        }
      }

      console.warn(`[Gemini] All candidate models exhausted. Attempting fallback recovery...`);
      throw lastError;
    }

    throw new Error('GEMINI_API_KEY_UNAVAILABLE');
  }
}

export const geminiService = new GeminiService();

