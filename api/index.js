import app from '../dist/index.js';

export default function handler(req, res) {
  try {
    return app(req, res);
  } catch (err) {
    console.error('[Vercel Serverless Invocation Error]', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html');
    res.end(`
      <!DOCTYPE html>
      <html>
        <head><title>YouTube Multi-Agent Error</title></head>
        <body style="font-family: sans-serif; background: #090A0F; color: #FFF; padding: 3rem; text-align: center;">
          <h2 style="color: #FF2A55;">Serverless Execution Error</h2>
          <p style="color: #9CA3AF;">${err?.message || err}</p>
          <a href="/" style="color: #6366F1; text-decoration: underline; margin-top: 1rem; display: inline-block;">Return to Dashboard</a>
        </body>
      </html>
    `);
  }
}
