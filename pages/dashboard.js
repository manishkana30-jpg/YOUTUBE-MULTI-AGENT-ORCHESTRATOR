import { useState } from 'react';

export default function Dashboard() {
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [videos, setVideos] = useState([]);

  const generateVideo = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setResult(data);
        setVideos([data, ...videos]);
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">
        🤖 YouTube Multi-Agent Video Generator
      </h1>

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
        <button
          type="submit"
          disabled={generating}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-bold"
        >
          {generating ? '⏳ Generating Video...' : '🚀 Generate Video'}
        </button>
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
