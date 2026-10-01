import fs from 'fs';
import {
  elevenLabsClient,
  elevenLabsTracker,
  VOICE_FALLBACKS,
  checkVoiceAvailability
} from '../../../lib/elevenlabs-client.js';

const MAX_VOICEOVER_SIZE = 50 * 1024 * 1024; // 50MB

export function validateAudioFile(buffer) {
  if (!buffer || buffer.length < 4) {
    throw new Error('Invalid audio: File is empty or corrupted');
  }
  const isMp3Sync = buffer[0] === 0xFF && (buffer[1] & 0xE0) === 0xE0;
  const isId3 = buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33;
  const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;

  if (!isMp3Sync && !isId3 && !isRiff) {
    throw new Error('Invalid audio file format (Expected valid MP3/WAV audio stream)');
  }
  return true;
}

export async function generateVoiceoverWithFallback(script, options = {}) {
  if (!script || typeof script !== 'string' || script.trim().length === 0) {
    throw new Error('Voiceover generator requires valid script text.');
  }

  const charCount = script.length;
  const usage = await elevenLabsTracker.trackUsage(charCount);
  console.log(`[Voiceover Generator] ElevenLabs character usage: ${usage.percentUsed.toFixed(1)}% (${charCount} chars)`);

  const requestedVoice = options.voice || 'rachel';
  const primaryVoiceId = VOICE_FALLBACKS[requestedVoice.toLowerCase()] || VOICE_FALLBACKS.rachel;

  try {
    const voiceoverPath = await elevenLabsClient.synthesizeSpeech(script, options.outputPath, primaryVoiceId);
    if (fs.existsSync(voiceoverPath)) {
      const stats = await fs.promises.stat(voiceoverPath);
      if (stats.size > MAX_VOICEOVER_SIZE) {
        throw new Error(`Voiceover exceeds max allowed size: ${(stats.size / 1024 / 1024).toFixed(2)}MB`);
      }
      const buffer = await fs.promises.readFile(voiceoverPath);
      validateAudioFile(buffer);
      return voiceoverPath;
    }
  } catch (error) {
    console.warn('[Voiceover Generator] Primary synthesis notice, retrying with fallback voice:', error.message);
    const fallbackVoice = VOICE_FALLBACKS.fallback;
    try {
      const fallbackPath = await elevenLabsClient.synthesizeSpeech(script, options.outputPath, fallbackVoice);
      if (fs.existsSync(fallbackPath)) {
        return fallbackPath;
      }
    } catch (fallbackError) {
      console.warn('[Voiceover Generator] Fallback voice notice:', fallbackError.message);
    }
  }

  // Final fallback to high-motion neural chunked TTS
  return await elevenLabsClient.synthesizeSpeech(script, options.outputPath);
}

// Backward-compatible export
export const generateVoiceover = generateVoiceoverWithFallback;
