// Cost & Quota Tracking Engine for YouTube Multi-Agent Video Generator

class CostTracker {
  constructor() {
    this.geminiCost = 0;
    this.geminiTokensInput = 0;
    this.geminiTokensOutput = 0;
    this.elevenLabsCharsUsed = 0;
    this.pexelsRequestsCount = 0;
    this.youtubeUploadsCount = 0;
    this.lastResetMonth = new Date().getMonth();
  }

  checkMonthlyReset() {
    const currentMonth = new Date().getMonth();
    if (currentMonth !== this.lastResetMonth) {
      console.log('[CostTracker] 🔄 New month detected. Resetting monthly usage quotas.');
      this.elevenLabsCharsUsed = 0;
      this.geminiCost = 0;
      this.lastResetMonth = currentMonth;
    }
  }

  // GEMINI PRICING: $0.075 / 1M input tokens, $0.30 / 1M output tokens
  trackGeminiUsage(inputTokens = 1500, outputTokens = 1200) {
    this.checkMonthlyReset();
    this.geminiTokensInput += inputTokens;
    this.geminiTokensOutput += outputTokens;
    const cost = (inputTokens / 1000000) * 0.075 + (outputTokens / 1000000) * 0.30;
    this.geminiCost += cost;
    console.log(`[CostTracker] 🤖 Gemini cost: +$${cost.toFixed(5)} (Month total: $${this.geminiCost.toFixed(4)})`);
    return cost;
  }

  trackElevenLabsUsage(chars) {
    this.checkMonthlyReset();
    this.elevenLabsCharsUsed += chars;
    const percentUsed = (this.elevenLabsCharsUsed / 10000) * 100;
    console.log(`[CostTracker] 🎙️ ElevenLabs usage: ${this.elevenLabsCharsUsed}/10000 chars (${percentUsed.toFixed(1)}%)`);
    return {
      used: this.elevenLabsCharsUsed,
      remaining: Math.max(0, 10000 - this.elevenLabsCharsUsed),
      percentUsed
    };
  }

  trackPexelsRequest() {
    this.pexelsRequestsCount++;
  }

  trackYouTubeUpload() {
    this.youtubeUploadsCount++;
  }

  getCostSummary() {
    this.checkMonthlyReset();
    const costs = {
      gemini: parseFloat(this.geminiCost.toFixed(4)),
      elevenlabs: 0.00, // Free tier up to 10k chars
      pexels: 0.00,     // Free tier
      youtube: 0.00,    // Free tier
      vercel: 0.00      // Free tier
    };
    const total = parseFloat(Object.values(costs).reduce((a, b) => a + b, 0).toFixed(4));
    console.log('[CostTracker] 📊 Monthly costs:', costs, `Total: $${total.toFixed(2)}`);
    return { costs, total };
  }
}

export const costTracker = new CostTracker();
