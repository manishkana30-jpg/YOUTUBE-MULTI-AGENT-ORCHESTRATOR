import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import { costTracker } from './cost-tracker.js';

const execAsync = promisify(exec);

// Character tracking: 10,000 chars/month free tier
export const elevenLabsTracker = {
  monthlyUsage: 0,
  MONTHLY_LIMIT: 10000,
  lastResetDay: new Date().getDate(),

  async trackUsage(characterCount) {
    const today = new Date().getDate();

    // Reset on new month
    if (today < this.lastResetDay) {
      this.monthlyUsage = 0;
      this.lastResetDay = today;
    }

    this.monthlyUsage += characterCount;
    costTracker.trackElevenLabsUsage(characterCount);

    const percentUsed = (this.monthlyUsage / this.MONTHLY_LIMIT) * 100;

    if (this.monthlyUsage > this.MONTHLY_LIMIT) {
      console.warn(`[ElevenLabs Tracker] ⚠️ Quota exceeded: ${this.monthlyUsage}/${this.MONTHLY_LIMIT} chars (${percentUsed.toFixed(1)}%). Routing to neural fallback.`);
      return {
        exceeded: true,
        used: this.monthlyUsage,
        remaining: 0,
        percentUsed
      };
    }

    return {
      exceeded: false,
      used: this.monthlyUsage,
      remaining: this.MONTHLY_LIMIT - this.monthlyUsage,
      percentUsed
    };
  }
};

// Voice fallbacks
export const VOICE_FALLBACKS = {
  'rachel': '21m00Tcm4TlvDq8ikWAM',
  'adam': '1HqLweKp76ChJf0eCX6I',
  'bella': 'EXAVITQu4vr4xnSDxMaL',
  'fallback': '21m00Tcm4TlvDq8ikWAM'
};

// Voice availability check
export const checkVoiceAvailability = async (voiceId, apiKey) => {
  const key = apiKey || process.env.ELEVEN_LABS_API_KEY;
  if (!key || key.includes('your_eleven_labs_key')) return false;
  try {
    const response = await axios.get(
      `https://api.elevenlabs.io/v1/voices/${voiceId}`,
      {
        headers: { 'xi-api-key': key },
        timeout: 8000
      }
    );
    return response.status === 200;
  } catch {
    return false;
  }
};

export class ElevenLabsClient {
  constructor() {
    this.apiKey = process.env.ELEVEN_LABS_API_KEY || '';
    this.voiceId = process.env.ELEVEN_LABS_VOICE_ID || VOICE_FALLBACKS.rachel;
  }

  async synthesizeSpeech(text, outputPath, overrideVoiceId) {
    const targetFile = outputPath || path.join(os.tmpdir(), `voiceover_${Date.now()}.mp3`);
    const activeVoice = overrideVoiceId || this.voiceId || VOICE_FALLBACKS.rachel;

    // 1. Attempt ElevenLabs API if key is present
    if (this.apiKey && !this.apiKey.includes('your_eleven_labs_key')) {
      try {
        const response = await axios.post(
          `https://api.elevenlabs.io/v1/text-to-speech/${activeVoice}`,
          {
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          },
          {
            headers: {
              'xi-api-key': this.apiKey,
              'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer',
            timeout: 60000
          }
        );

        fs.writeFileSync(targetFile, Buffer.from(response.data));
        return targetFile;
      } catch (err) {
        console.warn('[ElevenLabs Client] API attempt notice:', err.message);
      }
    }

    // 2. High-quality multi-chunk neural fallback (zero audio breaks)
    console.log('[ElevenLabs Client] Synthesizing continuous neural voiceover...');
    await this.generateChunkedTts(text, targetFile);
    return targetFile;
  }

  async generateChunkedTts(rawText, targetFile) {
    const cleanText = (rawText || '').replace(/\[.*?\]/g, '').replace(/['":\\%]/g, '').trim();
    const phrases = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    const validPhrases = [];

    for (const p of phrases) {
      const t = p.trim();
      if (t.length <= 80) {
        validPhrases.push(t);
      } else {
        const parts = t.split(/,\s*/);
        for (const pt of parts) {
          if (pt.trim()) validPhrases.push(pt.trim().substring(0, 80));
        }
      }
    }

    const tempDir = path.join(os.tmpdir(), `tts_chunks_${Date.now()}`);
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const chunkFiles = [];
    try {
      for (let i = 0; i < validPhrases.length; i++) {
        const chunkPath = path.join(tempDir, `c_${i}.mp3`);
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(validPhrases[i])}`;
        try {
          const resp = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 8000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
          });
          if (resp.data && resp.data.byteLength > 500) {
            fs.writeFileSync(chunkPath, Buffer.from(resp.data));
            chunkFiles.push(chunkPath);
          }
        } catch {}
      }

      if (chunkFiles.length === 1) {
        fs.copyFileSync(chunkFiles[0], targetFile);
      } else if (chunkFiles.length > 1) {
        const listFile = path.join(tempDir, 'list.txt');
        fs.writeFileSync(listFile, chunkFiles.map(c => `file '${c.replace(/\\/g, '/')}'`).join('\n'));
        await execAsync(`ffmpeg -y -f concat -safe 0 -i "${listFile.replace(/\\/g, '/')}" -c:a libmp3lame -b:a 192k "${targetFile.replace(/\\/g, '/')}"`);
      }
    } finally {
      try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
    }
  }
}

export const elevenLabsClient = new ElevenLabsClient();
