import { useState } from 'react';

const TRENDING_TOPICS = [
  'Learn Python in 10 Minutes (Complete Beginner Guide)',
  'Modern JavaScript Async Mastery: Event Loop & Promises',
  'Building Autonomous Multi-Agent AI Swarms with MCP',
  'Full Stack Web Development in 2026: Roadmap & Architecture',
  'FastAPI vs Next.js: High Performance Backend Showdown'
];

export default function Dashboard() {
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [videos, setVideos] = useState([]);
  const [dailyScheduled, setDailyScheduled] = useState(false);

  const getTrendingTopic = () => {
    return TRENDING_TOPICS[Math.floor(Math.random() * TRENDING_TOPICS.length)];
  };

  const executeVideoGeneration = async (targetTopic) => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: targetTopic })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setResult(data);
        setVideos((prev) => [data, ...prev]);
        setTopic('');
        alert(`✅ Video published: ${data.videoUrl}`);
      } else {
        alert('❌ Error: ' + (data.message || 'Failed to generate video'));
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const generateVideo = async (e) => {
    e.preventDefault();
    await executeVideoGeneration(topic || getTrendingTopic());
  };

  const scheduleDaily = async () => {
    setDailyScheduled(true);
    alert('⏱️ Daily automation scheduled! Triggering today\'s video now, then every 24 hours (or at 9 AM UTC via Vercel Cron).');
    
    // Trigger today's video immediately
    const randomTopic = getTrendingTopic();
    await executeVideoGeneration(randomTopic);

    // Schedule next daily execution every 24 hours
    setInterval(async () => {
      const nextTopic = getTrendingTopic();
      await executeVideoGeneration(nextTopic);
    }, 24 * 60 * 60 * 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          🤖 YouTube Multi-Agent Video Generator
        </h1>
        {dailyScheduled && (
          <span className="bg-green-800 text-green-200 text-xs px-3 py-1 rounded-full border border-green-500 font-mono">
            ● DAILY CRON 9 AM ACTIVE
          </span>
        )}
      </div>

      {/* Generator Form */}
      <form onSubmit={generateVideo} className="bg-gray-800 p-6 rounded-lg mb-8">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic (e.g., 'Learn Python in 10 Minutes')"
          className="w-full p-3 bg-gray-700 rounded mb-4 text-white"
          disabled={generating}
        />
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={generating}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-bold"
          >
            {generating ? '⏳ Generating Video...' : '🚀 Generate Video'}
          </button>

          {/* Option 3: Manual Dashboard Button */}
          <button
            type="button"
            onClick={scheduleDaily}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold"
          >
            {dailyScheduled ? '✓ Daily Uploads Scheduled' : 'Schedule Daily Videos'}
          </button>
        </div>
      </form>

      {/* Result */}
      {result && (
        <div className="bg-green-900 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">✅ Video Published!</h2>
          <p className="mb-2"><strong>Title:</strong> {result.title}</p>
          <a
            href={result.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Watch on YouTube →
          </a>
        </div>
      )}

      {/* Video History */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">📺 Generated Videos</h2>
        {videos.length === 0 ? (
          <p className="text-gray-400">No videos generated yet</p>
        ) : (
          <div className="grid gap-4">
            {videos.map((video, i) => (
              <div key={i} className="bg-gray-700 p-4 rounded">
                <p className="font-bold">{video.title}</p>
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm"
                >
                  {video.videoUrl}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
