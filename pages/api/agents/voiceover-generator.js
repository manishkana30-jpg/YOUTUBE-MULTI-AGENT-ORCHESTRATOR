import { elevenLabsClient } from '../../../lib/elevenlabs-client.js';

export async function generateVoiceover(scriptText) {
  return await elevenLabsClient.synthesizeSpeech(scriptText);
}
