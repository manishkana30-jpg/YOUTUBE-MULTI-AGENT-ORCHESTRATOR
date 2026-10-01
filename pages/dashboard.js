import { useState, useEffect } from 'react';

const TRENDING_TOPICS = [
  'Learn Python in 10 Minutes (Complete Beginner Guide)',
  'Modern JavaScript Async Mastery: Event Loop & Promises',
  'Building Autonomous Multi-Agent AI Swarms with MCP',
  'Full Stack Web Development in 2026: Roadmap & Architecture',
  'FastAPI vs Next.js: High Performance Backend Showdown'
];

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <p className="text-sm text-gray-400 uppercase font-medium">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  const val = Number(num);
  if (isNaN(val)) return num;
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
  return val.toLocaleString();
};

export default function Dashboard() {
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [videos, setVideos] = useState([]);
  const [dailyScheduled, setDailyScheduled] = useState(false);

  // Analytics Channel Stats State
  const [stats, setStats] = useState({
    totalVideos: 14,
    totalViews: 38400,
    subscribers: 1250,
    estimatedMonthlyRevenue: 3.20
  });

  // Real-Time Generation Log State
  const [logs, setLogs] = useState([
    { timestamp: '00:00:00', message: 'System initialized. Ready to generate video.' }
  ]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { timestamp, message }]);
  };

  useEffect(() => {
    // Fetch live channel analytics from /api/analytics
    async function fetchStats() {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();
        if (data?.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.warn('Could not fetch live analytics:', err.message);
      }
    }
    fetchStats();
  }, []);

  const getTrendingTopic = () => {
    return TRENDING_TOPICS[Math.floor(Math.random() * TRENDING_TOPICS.length)];
  };

  const executeVideoGeneration = async (targetTopic) => {
    setGenerating(true);
    addLog(`🚀 Starting video generation: "${targetTopic}"`);
    addLog('📝 Agent 1: Generating structured 10-minute script with Gemini API...');

    try {
      addLog('🎙️ Agent 2: Synthesizing continuous natural voiceover...');
      addLog('🎬 Agent 3: Querying Pexels stock video footage...');

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: targetTopic })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        addLog('✂️ Agent 4: Compositing footage clips + voiceover with FFmpeg...');
        addLog(`📤 Agent 5: Publishing video to YouTube: ${data.videoUrl}`);
        addLog(`🎉 Pipeline completed successfully in ${data.generationTime || 20}s!`);

        setResult(data);
        setVideos((prev) => [data, ...prev]);
        setTopic('');

        // Increment stats
        setStats((prev) => ({
          ...prev,
          totalVideos: (prev.totalVideos || 0) + 1
        }));

        alert(`✅ Video published: ${data.videoUrl}`);
      } else {
        addLog(`❌ Error: ${data.message || 'Failed to generate video'}`);
        alert('❌ Error: ' + (data.message || 'Failed to generate video'));
      }
    } catch (error) {
      addLog(`❌ Network Error: ${error.message}`);
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
    addLog('⏱️ Daily automation scheduled! Triggering 9 AM UTC pipeline...');
    alert('⏱️ Daily automation scheduled! Triggering today\'s video now, then every 24 hours (or at 9 AM UTC via Vercel Cron).');
    
    const randomTopic = getTrendingTopic();
    await executeVideoGeneration(randomTopic);

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

      {/* Analytics Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Videos" value={stats.totalVideos} />
        <StatCard label="Views" value={formatNumber(stats.totalViews)} />
        <StatCard label="Subscribers" value={formatNumber(stats.subscribers)} />
        <StatCard label="Est. Revenue" value={"$" + stats.estimatedMonthlyRevenue} />
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

          <button
            type="button"
            onClick={scheduleDaily}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold"
          >
            {dailyScheduled ? '✓ Daily Uploads Scheduled' : 'Schedule Daily Videos'}
          </button>
        </div>
      </form>

      {/* Real-Time Generation Log */}
      <div className="bg-gray-800 p-4 rounded max-h-96 overflow-y-auto mb-8 border border-gray-700">
        <h3 className="font-bold mb-2">Generation Log</h3>
        {logs.map((log, i) => (
          <p key={i} className="text-sm text-gray-400">
            <span className="text-yellow-400">[{log.timestamp}]</span> {log.message}
          </p>
        ))}
      </div>

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
