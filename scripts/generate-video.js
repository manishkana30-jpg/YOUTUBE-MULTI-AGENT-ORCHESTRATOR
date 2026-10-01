import dotenv from 'dotenv';
import { youtubeVideoOrchestrator } from '../dist/agents/video-orchestrator.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const TRENDING_TOPICS = [
  'Learn Python in 10 Minutes (Complete Beginner Guide)',
  'Modern JavaScript Async Mastery: Event Loop & Promises',
  'Building Autonomous Multi-Agent AI Swarms with MCP',
  'Full Stack Web Development in 2026: Roadmap & Architecture',
  'FastAPI vs Next.js: High Performance Backend Showdown',
  'Mastering Docker Containers & Microservices in 10 Minutes'
];

async function main() {
  const customTopic = process.argv.slice(2).join(' ').trim();
  const selectedTopic = customTopic || TRENDING_TOPICS[Math.floor(Math.random() * TRENDING_TOPICS.length)];

  console.log('========================================================================');
  console.log('  🚀 DAILY AUTOMATED YOUTUBE VIDEO GENERATOR (CRON WORKER)               ');
  console.log('========================================================================');
  console.log(`Topic: "${selectedTopic}"`);
  console.log(`Time: ${new Date().toISOString()} (09:00 AM UTC Schedule)\n`);

  try {
    const publishedUrl = await youtubeVideoOrchestrator.generateVideo(selectedTopic);
    const progress = youtubeVideoOrchestrator.getProgress();

    console.log('\n========================================================================');
    console.log('  🎉 VIDEO PUBLISHED SUCCESSFULLY!');
    console.log('========================================================================');
    console.log(`Title: ${progress.script?.title}`);
    console.log(`Duration: ${progress.video?.duration.toFixed(1)}s`);
    console.log(`YouTube URL: ${publishedUrl}`);
    console.log('========================================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal Error in Daily Video Generator:', error);
    process.exit(1);
  }
}

main();
