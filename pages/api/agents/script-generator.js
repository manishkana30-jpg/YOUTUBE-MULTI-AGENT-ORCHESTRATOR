import { geminiClient } from '../../../lib/gemini-client.js';

// 2. API QUOTA MONITORING
let dailyTokensUsed = 0;
let lastResetDate = new Date().toDateString();
const DAILY_TOKEN_LIMIT = 500000;

function trackUsage(tokensUsed = 500) {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    dailyTokensUsed = 0;
    lastResetDate = today;
  }
  dailyTokensUsed += tokensUsed;
  if (dailyTokensUsed > DAILY_TOKEN_LIMIT) {
    console.warn(`[Script Generator] Daily token limit warning: ${dailyTokensUsed}/${DAILY_TOKEN_LIMIT}`);
  }
}

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

// Helper: Rich fallback script
export function generateFallbackScript(sanitizedTopic) {
  return {
    title: `${sanitizedTopic}: The Complete 10-Minute Masterclass`,
    description: `Complete guide to ${sanitizedTopic}. Master key concepts with step-by-step clarity. Timestamps:\n0:00 - Introduction\n0:20 - Core Problem\n0:45 - Key Solution\n1:15 - Practical Examples\n1:40 - Summary & Action Steps`,
    tags: [sanitizedTopic.toLowerCase(), 'tutorial', 'guide', 'mastery', 'overview', 'education', 'quickstart', '2026', 'productivity', 'best practices'],
    script: [
      {
        section: 'intro',
        text: `Hey everyone! Today we're diving deep into ${sanitizedTopic}. By the end of this video, you'll understand exactly how to master this with zero confusion. Let's get straight into it!`,
        duration: 18,
        emotion: '[EXCITED]'
      },
      {
        section: 'problem',
        text: `Most people get overwhelmed when starting with ${sanitizedTopic} because there is too much noise. But when you break it down into fundamental building blocks, everything clicks immediately.`,
        duration: 20,
        emotion: '[SERIOUS]'
      },
      {
        section: 'solution',
        text: `Here is the first core rule: focus on consistency and clean execution. When you understand the underlying workflow, you can solve complex problems in minutes instead of hours.`,
        duration: 22,
        emotion: '[CONFIDENT]'
      },
      {
        section: 'cta',
        text: `If you found this breakdown valuable, smash that subscribe button for daily tutorials. Drop your questions in the comments below!`,
        duration: 15,
        emotion: '[URGENT]'
      }
    ]
  };
}

export async function generateScript(topic) {
  const sanitizedTopic = sanitizeInput(topic);
  trackUsage(800);

  // 1. Anthropic Claude (if configured)
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
            content: `Generate a professional YouTube video script for: "${sanitizedTopic}". Output strictly valid JSON matching schema: {"title": string, "description": string, "tags": string[], "script": [{"section": string, "text": string, "duration": number, "emotion": string}]}`
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
          // 1. JSON PARSING & SCHEMA VALIDATION
          if (parsed && parsed.title && Array.isArray(parsed.script) && parsed.script.length > 0) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('[Script Generator] Anthropic call notice, proceeding to Gemini API:', e.message);
    }
  }

  // 2. Google Gemini API (Primary Engine)
  try {
    const script = await geminiClient.generateStructuredScript(sanitizedTopic);
    // 1. JSON VALIDATION
    if (script && script.title && Array.isArray(script.script) && script.script.length > 0) {
      return script;
    }
    throw new Error('Gemini script output failed schema validation');
  } catch (err) {
    console.error('[Script Generator] Script parsing/generation error:', err.message);
    return generateFallbackScript(sanitizedTopic);
  }
}
