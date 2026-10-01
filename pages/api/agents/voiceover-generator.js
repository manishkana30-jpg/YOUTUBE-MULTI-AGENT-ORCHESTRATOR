import fs from 'fs';
import { elevenLabsClient } from '../../../lib/elevenlabs-client.js';

// 2. VOICE SELECTION: Robust voice mapping
export const VOICE_IDS = {
  'rachel': '21m00Tcm4TlvDq8ikWAM',
  'adam': '1HqLweKp76ChJf0eCX6I',
  'bella': 'EXAVITQu4vr4xnSDxMaL'
};

// 1. AUDIO FILE SIZE
const MAX_VOICEOVER_SIZE = 50 * 1024 * 1024; // 50MB

// 3. CHARACTER LIMIT TRACKING (10,000 chars/month free tier)
let monthlyCharUsage = 0;
const FREE_TIER_LIMIT = 10000;

// 4. FILE ENCODING VALIDATION
export function validateAudioFile(buffer) {
  if (!buffer || buffer.length < 4) {
    throw new Error('Invalid audio: File is empty or corrupted');
  }
  // Check MP3 sync word (0xFF and first 3 bits of 2nd byte are 111 -> 0xE0) or RIFF/WAV/ID3 header
  const isMp3Sync = buffer[0] === 0xFF && (buffer[1] & 0xE0) === 0xE0;
  const isId3 = buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33; // 'ID3'
  const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46; // 'RIFF'

  if (!isMp3Sync && !isId3 && !isRiff) {
    throw new Error('Invalid audio file format (Expected valid MP3/WAV audio stream)');
  }
  return true;
}

export async function generateVoiceover(scriptText, options = {}) {
  if (!scriptText || typeof scriptText !== 'string' || scriptText.trim().length === 0) {
    throw new Error('Voiceover generator requires valid script text.');
  }

  const selectedVoice = options.voice || process.env.ELEVEN_LABS_VOICE_NAME || 'rachel';
  const voiceId = VOICE_IDS[selectedVoice.toLowerCase()] || process.env.ELEVEN_LABS_VOICE_ID || VOICE_IDS.rachel;

  const characterCount = scriptText.length;
  console.log(`[Voiceover Generator] Synthesizing speech (${characterCount} characters, Voice: ${selectedVoice})`);

  // Character limit tracking
  if (monthlyCharUsage + characterCount > FREE_TIER_LIMIT) {
    console.warn(`[Voiceover Generator] Monthly ElevenLabs character limit exceeded (${monthlyCharUsage + characterCount}/${FREE_TIER_LIMIT}). Utilizing chunked neural engine.`);
  } else {
    monthlyCharUsage += characterCount;
  }

  // Synthesize speech via ElevenLabs client (with built-in neural fallback)
  const voiceoverPath = await elevenLabsClient.synthesizeSpeech(scriptText, options.outputPath, voiceId);

  // Validate output file
  if (!fs.existsSync(voiceoverPath)) {
    throw new Error(`Voiceover synthesis failed: Output file not created at ${voiceoverPath}`);
  }

  const stats = await fs.promises.stat(voiceoverPath);
  if (stats.size > MAX_VOICEOVER_SIZE) {
    throw new Error(`Voiceover exceeds max allowed size: ${(stats.size / 1024 / 1024).toFixed(2)}MB > 50MB`);
  }

  // Validate audio buffer headers
  const buffer = await fs.promises.readFile(voiceoverPath);
  validateAudioFile(buffer);

  console.log(`[Voiceover Generator] ✅ Audio verified: ${voiceoverPath} (${(stats.size / 1024).toFixed(1)} KB)`);
  return voiceoverPath;
}
