import { geminiClient } from '../../../lib/gemini-client.js';

export async function generateScript(topic) {
  // If Anthropic SDK or CLAUDE_API_KEY is configured, can invoke Claude
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
            content: `Generate a professional 10-minute video script for: ${topic}

Output ONLY valid JSON:
{
  "title": "Video title",
  "description": "SEO description",
  "tags": ["tag1", "tag2", ...],
  "script": [
    {
      "section": "intro",
      "text": "Hook text. Short sentences.",
      "duration": 20,
      "emotion": "[EXCITED]"
    }
  ]
}`
          }]
        })
      });

      const data = await response.json();
      if (data.content?.[0]?.text) {
        let text = data.content[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
        const first = text.indexOf('{');
        const last = text.lastIndexOf('}');
        if (first !== -1 && last !== -1) {
          return JSON.parse(text.substring(first, last + 1));
        }
      }
    } catch (e) {
      console.warn('[Script Generator] Anthropic call notice, switching to Gemini API:', e.message);
    }
  }

  // Default to Gemini API
  return await geminiClient.generateStructuredScript(topic);
}
