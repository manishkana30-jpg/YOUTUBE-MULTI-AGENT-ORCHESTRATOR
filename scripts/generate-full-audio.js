import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

const TOPIC_SCRIPTS = {
  python: [
    "Hey everyone! I am about to show you Python basics. By the end of this video, you will be able to write your first program. Let's go!",
    "Most people give up on Python because they think it is too hard. But I am going to show you it is actually simple. Here is what I see people struggling with. They try to memorize syntax instead of building real projects.",
    "Step 1: Writing clean functions and handling data. Watch how I write this in the code editor on screen. Now here is the common mistake: indentation errors and unhandled exceptions. Let me show you the right way to structure your code cleanly.",
    "Look at this! I just ran this Python script and it executed on the first try. See the terminal output on screen? Output 200 OK, latency 140 milliseconds. That is exactly what we wanted to achieve.",
    "Here is why this matters to me personally. Five years ago, I didn't know Python at all. Then I learned it step by step, and it completely changed my software engineering career. If I can do it, you can too.",
    "I want you to try coding today. Open your terminal, write your first script, and comment below what you built! Don't forget to subscribe for weekly Python lessons. I will see you in the next video!"
  ],

  javascript: [
    "Welcome back everyone! Today we are mastering modern JavaScript from the ground up. In just a few minutes, you will understand how modern web apps really work. Let's dive in!",
    "A lot of developers get frustrated with JavaScript because of asynchronous event loops and promise rejections. But once you understand the execution order, everything becomes clear. Here is where most people get tripped up.",
    "Step 1: Async functions and microtasks. Look at the code on screen. Promises resolve before the next browser render tick. Notice how avoiding long tasks keeps the user interface fluid at sixty frames per second.",
    "Check out this live benchmark! When we run this optimized JavaScript code, our interaction to next paint score drops under forty milliseconds. Zero frame drops and buttery smooth rendering.",
    "Early in my career, UI lag and broken scripts cost our team major conversions. Taking the time to master JavaScript internals transformed our web apps and my confidence as a developer.",
    "Now it is your turn! Open your browser devtools, test this code today, and subscribe to the channel for more full-stack web development deep dives!"
  ],

  ai: [
    "Welcome everyone! Today I am going to show you how autonomous AI agent swarms actually work in production. By the end of this, you will understand how to build resilient AI systems.",
    "Most developers struggle with AI because single prompt chains get stuck in infinite retries. When context drifts, the agent burns tokens and fails silently. Here is the better architectural pattern.",
    "Step 1: Supervisor-worker multi-agent swarms. Look at the live diagram and terminal on screen. The supervisor agent delegates subtasks to specialized tools using the Model Context Protocol.",
    "Look at these production metrics! The multi-agent swarm executed the entire task in twelve seconds with zero errors and one hundred percent verified test passes.",
    "I spent months battling fragile prompt chains before switching to hierarchical supervisor swarms. It completely revolutionized our automated engineering workflows.",
    "Start building your own AI swarms today! Check out the starter repo, comment your questions below, and subscribe for daily production AI blueprints!"
  ]
};

async function downloadChunk(text, outputPath) {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(text)}`;
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 10000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });
  fs.writeFileSync(outputPath, Buffer.from(response.data));
}

async function generateContinuousAudio(topic, sentences) {
  console.log(`\n[Audio Generator] Generating continuous voiceover for: ${topic}...`);
  const tempDir = path.resolve('data', 'renders', `audio_temp_${topic}`);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const chunkPaths = [];

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    // Split into smaller phrases if sentence > 80 chars
    const phrases = sentence.match(/[^.!?]+[.!?]+/g) || [sentence];
    
    for (let j = 0; j < phrases.length; j++) {
      const phrase = phrases[j].trim();
      if (!phrase) continue;
      const chunkPath = path.join(tempDir, `chunk_${i}_${j}.mp3`);
      try {
        await downloadChunk(phrase, chunkPath);
        if (fs.existsSync(chunkPath) && fs.statSync(chunkPath).size > 1000) {
          chunkPaths.push(chunkPath);
        }
      } catch (err) {
        console.warn(`Warning downloading phrase "${phrase.substring(0, 30)}...":`, err.message);
      }
    }
  }

  if (chunkPaths.length === 0) {
    console.error(`Failed to download any chunks for ${topic}`);
    return;
  }

  // Concatenate all chunks using FFmpeg concat filter
  const targetOutput = path.resolve('assets', 'audio', `${topic}_voiceover.mp3`);
  const concatListFile = path.join(tempDir, 'concat_list.txt');
  const concatContent = chunkPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n');
  fs.writeFileSync(concatListFile, concatContent);

  // Concatenate and normalize audio level to -6dB peak
  const ffmpegCmd = `ffmpeg -y -f concat -safe 0 -i "${concatListFile}" -af "loudnorm=I=-16:TP=-3:LRA=11,afade=t=in:st=0:d=0.2" -c:a libmp3lame -b:a 192k "${targetOutput}"`;
  
  await execAsync(ffmpegCmd);

  if (fs.existsSync(targetOutput)) {
    const stats = fs.statSync(targetOutput);
    const { stdout } = await execAsync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${targetOutput}"`);
    console.log(`[Audio Generator] ✅ Generated ${targetOutput}: ${(stats.size / 1024).toFixed(1)} KB, Duration: ${parseFloat(stdout).toFixed(1)}s`);
  }

  // Clean up temp
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch {}
}

async function main() {
  for (const [topic, sentences] of Object.entries(TOPIC_SCRIPTS)) {
    await generateContinuousAudio(topic, sentences);
  }
  console.log('\n[Audio Generator] All continuous voiceover audio tracks generated successfully!');
}

main().catch(err => {
  console.error('[Audio Generator Failed]', err);
  process.exit(1);
});
