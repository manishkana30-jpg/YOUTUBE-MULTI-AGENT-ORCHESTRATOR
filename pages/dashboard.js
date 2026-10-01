import React, { useState } from 'react';

export default function Dashboard() {
  const [topic, setTopic] = useState('Learn Python in 10 Minutes');
  const [niche, setNiche] = useState('Programming');
  const [uploadToYouTube, setUploadToYouTube] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setLogs([]);

    addLog(`🚀 Initiating 5-Agent video generation for: "${topic}" (${niche})`);
    addLog(`📝 Agent 1: Generating structured script via Gemini API...`);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          niche,
          language: 'English',
          uploadToYouTube
        })
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || data.error || 'Video generation failed');
      }

      addLog(`🎙️ Agent 2: Continuous voiceover synthesized.`);
      addLog(`🎬 Agent 3: B-roll footage clips sourced.`);
      addLog(`✂️ Agent 4: Master video rendered with audio sync.`);
      addLog(`📤 Agent 5: Published to YouTube: ${data.videoUrl}`);
      addLog(`🎉 Pipeline Completed in ${data.generationTime || 12}s!`);

      setResult(data);
    } catch (err) {
      setError(err.message);
      addLog(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 0%, #171A29 0%, #090A0F 100%)',
      color: '#F3F4F6',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem 1.5rem'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Top Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
              🎬 YouTube Multi-Agent Factory
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
              Vercel Automated Video Pipeline & Orchestrator
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a href="/generator" style={{
              background: 'rgba(255,42,85,0.15)',
              border: '1px solid rgba(255,42,85,0.3)',
              color: '#FF6584',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              ⚡ Mission Control
            </a>
            <a href="/smart-video?topic=python" style={{
              background: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.3)',
              color: '#60A5FA',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              💻 Code Studio
            </a>
          </div>
        </header>

        {/* Form Card */}
        <div style={{
          background: 'rgba(18, 20, 29, 0.75)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Generate Automated YouTube Video
          </h2>

          <form onSubmit={handleGenerate}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '0.4rem', fontWeight: 600 }}>
                  TOPIC / KEYWORD
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Learn Python in 10 Minutes"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    color: '#FFF',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '0.4rem', fontWeight: 600 }}>
                  NICHE / CATEGORY
                </label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    color: '#FFF',
                    fontSize: '1rem'
                  }}
                >
                  <option value="Programming">Programming & Code</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Education">Education & Tutorials</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: '#D1D5DB' }}>
                <input
                  type="checkbox"
                  checked={uploadToYouTube}
                  onChange={(e) => setUploadToYouTube(e.target.checked)}
                />
                Automatically upload & publish to YouTube Channel
              </label>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setTopic('Learn Python in 10 Minutes')}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#D1D5DB', padding: '0.35rem 0.75rem', borderRadius: '15px', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  🐍 Python 10m
                </button>
                <button
                  type="button"
                  onClick={() => setTopic('Modern JavaScript Async Mastery')}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#D1D5DB', padding: '0.35rem 0.75rem', borderRadius: '15px', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  ⚡ JS Async
                </button>
                <button
                  type="button"
                  onClick={() => setTopic('Multi-Agent AI Swarms with MCP')}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#D1D5DB', padding: '0.35rem 0.75rem', borderRadius: '15px', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  🤖 AI Swarms
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? 'rgba(255,42,85,0.4)' : 'linear-gradient(135deg, #FF2A55, #E02047)',
                color: '#FFF',
                border: 'none',
                borderRadius: '10px',
                padding: '0.9rem 2rem',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(255,42,85,0.4)'
              }}
            >
              {loading ? '⏳ 5 Sub-Agents Executing...' : '🚀 Start Automated Video Pipeline'}
            </button>
          </form>
        </div>

        {/* Results Card */}
        {result && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(18, 20, 29, 0.9))',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ background: 'rgba(16,185,129,0.2)', color: '#34D399', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                STATUS: SUCCESS
              </span>
              <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{result.timestamp}</span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', marginBottom: '0.5rem' }}>
              {result.title}
            </h3>

            <p style={{ color: '#D1D5DB', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Duration: <strong>{result.videoDuration ? result.videoDuration.toFixed(1) : 60}s</strong> • Generation Time: <strong>{result.generationTime}s</strong>
            </p>

            <div style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '1rem',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <span style={{ color: '#34D399', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                {result.videoUrl}
              </span>
              <a
                href={result.videoUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#EF4444',
                  color: '#FFF',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontSize: '0.85rem'
                }}
              >
                Watch on YouTube ↗
              </a>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            color: '#F87171',
            marginBottom: '2rem'
          }}>
            <strong>Pipeline Error:</strong> {error}
          </div>
        )}

        {/* Live Terminal Logs */}
        <div style={{
          background: '#0B0D14',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            fontSize: '0.8rem',
            color: '#9CA3AF',
            fontFamily: 'monospace'
          }}>
            Terminal Execution Log
          </div>
          <div style={{
            padding: '1.25rem',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            color: '#34D399',
            maxHeight: '260px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6
          }}>
            {logs.length > 0 ? logs.join('\n') : '[System] Ready. Click Start Automated Video Pipeline to execute.'}
          </div>
        </div>

      </div>
    </div>
  );
}
