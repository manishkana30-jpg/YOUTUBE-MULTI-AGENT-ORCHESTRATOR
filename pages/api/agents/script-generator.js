import { geminiClient, geminiRateLimiter, trackGeminiCost } from '../../../lib/gemini-client.js';

// 4. PROMPT INJECTION SANITIZATION
export function sanitizeInput(topic) {
  if (!topic || typeof topic !== 'string') return 'Modern Web Development Guide';
  return topic
    .replace(/[<>\"'`$]/g, '') // Remove dangerous chars
    .substring(0, 200) // Limit length
    .trim();
}

// 3. TOKEN LIMITS SAFETY CHECK
export function checkTokenLimit(text, maxChars = 7600) {
  if (!text) return '';
  const estimatedTokens = text.length / 4;
  if (estimatedTokens > 1900) {
    console.warn(`[Script Generator] Script approaching token limit (${estimatedTokens} est tokens), safely truncating.`);
    return text.substring(0, maxChars);
  }
  return text;
}

// Fallback script as specified in audit points
export const getFallbackScript = (topic) => {
  const cleanTopic = sanitizeInput(topic);
  return {
    title: `Learn ${cleanTopic} in 10 Minutes`,
    description: `Complete tutorial on ${cleanTopic}. Master key concepts with step-by-step clarity.\n\nTimestamps:\n0:00 - Introduction\n0:30 - Main Concepts\n9:30 - Call To Action`,
    tags: [cleanTopic.toLowerCase(), 'tutorial', 'learn', 'beginner', 'guide', '2026', 'mastery'],
    script: [
      {
        section: 'intro',
        text: `Hey everyone, welcome. I'm about to teach you ${cleanTopic}. By the end, you'll understand everything. Let's begin.`,
        duration: 30,
        emotion: '[EXCITED]'
      },
      {
        section: 'main',
        text: `Here's what you need to know about ${cleanTopic}. It's actually quite simple once you break it down into core steps.`,
        duration: 540,
        emotion: '[NORMAL]'
      },
      {
        section: 'cta',
        text: 'Subscribe for more tutorials like this. Leave your questions down in the comments below.',
        duration: 30,
        emotion: '[FRIENDLY]'
      }
    ]
  };
};

export async function generateScriptWithFallback(topic) {
  const cleanTopic = sanitizeInput(topic);

  try {
    // 1. Rate Limit check (60 calls/day free tier)
    await geminiRateLimiter.checkLimit();

    // 2. Claude fallback check if configured
    if (process.env.CLAUDE_API_KEY && !process.env.CLAUDE_API_KEY.includes('your_claude_api_key')) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2500,
            messages: [{
              role: 'user',
              content: `Generate a professional YouTube video script for: "${cleanTopic}". Output strictly valid JSON matching schema: {"title": string, "description": string, "tags": string[], "script": [{"section": string, "text": string, "duration": number, "emotion": string}]}`
            }]
          })
        });

        const data = await response.json();
        if (data.content?.[0]?.text) {
          let text = data.content[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
          const first = text.indexOf('{');
          const last = text.lastIndexOf('}');
          if (first !== -1 && last !== -1) {
            const parsed = JSON.parse(checkTokenLimit(text.substring(first, last + 1)));
            if (parsed && parsed.title && Array.isArray(parsed.script) && parsed.script.length > 0) {
              return parsed;
            }
          }
        }
      } catch (claudeErr) {
        console.warn('[Script Generator] Claude notice, falling back to Gemini:', claudeErr.message);
      }
    }

    // 3. Gemini Primary Execution
    const script = await geminiClient.generateStructuredScript(cleanTopic);
    if (script && script.title && Array.isArray(script.script) && script.script.length > 0) {
      return script;
    }

    throw new Error('Gemini script structure verification failed');
  } catch (error) {
    console.warn('[Script Generator] Gemini failed or rate limited, using fallback:', error.message);
    return getFallbackScript(cleanTopic);
  }
}

// Backward-compatible alias
export const generateScript = generateScriptWithFallback;
