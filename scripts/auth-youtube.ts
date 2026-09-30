import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { exec } from 'child_process';

dotenv.config();

const PORT = 3002;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly'
];

function promptInput(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

function openBrowser(authUrl: string) {
  const start = process.platform === 'win32' ? 'start ""' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  exec(`${start} "${authUrl}"`);
}

async function startOAuthFlow() {
  console.log('========================================================================');
  console.log('  🔐 ANTIGRAVITY YOUTUBE OAUTH 2.0 CHANNEL AUTHORIZATION WIZARD         ');
  console.log('========================================================================\n');

  let clientId = process.env.GOOGLE_CLIENT_ID || '';
  let clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

  // Check if existing YOUTUBE_OAUTH_CLIENT has partial client_id
  if (process.env.YOUTUBE_OAUTH_CLIENT && !clientId) {
    try {
      const parsed = JSON.parse(process.env.YOUTUBE_OAUTH_CLIENT);
      clientId = parsed.client_id || '';
      clientSecret = parsed.client_secret || '';
    } catch {}
  }

  if (!clientId || clientId.includes('your_client_id')) {
    console.log('To upload videos automatically to YouTube, Google requires OAuth 2.0:');
    console.log('1. Visit: https://console.cloud.google.com/apis/credentials');
    console.log('2. Enable "YouTube Data API v3"');
    console.log('3. Click "+ CREATE CREDENTIALS" -> "OAuth client ID"');
    console.log('   - Application type: "Desktop app" (or "Web application" with redirect: ' + REDIRECT_URI + ')');
    console.log('4. Paste your Client ID and Client Secret below:\n');

    clientId = await promptInput('Enter your Google Client ID: ');
    clientSecret = await promptInput('Enter your Google Client Secret: ');
  }

  if (!clientId || !clientSecret) {
    console.error('[Error] Client ID and Client Secret are required.');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });

  const server = http.createServer(async (req, res) => {
    try {
      if (req.url && req.url.startsWith('/oauth2callback')) {
        const queryParams = new url.URL(req.url, `http://localhost:${PORT}`).searchParams;
        const code = queryParams.get('code');

        if (!code) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end('<h1>Error: No authorization code found in request.</h1>');
          return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <div style="font-family: sans-serif; text-align: center; padding: 3rem;">
            <h1 style="color: #10B981;">🎉 YouTube Channel Successfully Connected!</h1>
            <p>You can close this tab now and return to your terminal.</p>
          </div>
        `);

        console.log('[OAuth] Authorization code received. Exchanging for tokens...');
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Verify channel information
        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
        let channelName = 'YouTube Channel';
        try {
          const channelRes = await youtube.channels.list({ part: ['snippet'], mine: true });
          channelName = channelRes.data.items?.[0]?.snippet?.title || 'YouTube Channel';
        } catch {}

        console.log(`[OAuth] ✅ Authenticated successfully for channel: "${channelName}"`);

        // Save to .env
        const oauthConfig = {
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: tokens.refresh_token,
          channel_title: channelName
        };

        const envPath = path.resolve(process.cwd(), '.env');
        let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';

        const oauthString = JSON.stringify(oauthConfig);
        if (envContent.includes('YOUTUBE_OAUTH_CLIENT=')) {
          envContent = envContent.replace(/YOUTUBE_OAUTH_CLIENT=.*(\r?\n|$)/, `YOUTUBE_OAUTH_CLIENT=${oauthString}\n`);
        } else {
          envContent += `\nYOUTUBE_OAUTH_CLIENT=${oauthString}\n`;
        }

        fs.writeFileSync(envPath, envContent, 'utf-8');
        console.log(`[OAuth] 💾 Saved active credentials and refresh_token to .env!`);
        console.log(`\nReady! Run: npm run test:pipeline to post your first video to YouTube.`);

        setTimeout(() => {
          server.close();
          process.exit(0);
        }, 1500);
      }
    } catch (err: any) {
      console.error('[OAuth Error]', err?.message || err);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('<h1>Authentication Failed. Check terminal logs.</h1>');
    }
  });

  server.listen(PORT, () => {
    console.log(`[OAuth] Local authentication listener started on ${REDIRECT_URI}`);
    console.log(`[OAuth] Opening Google authorization page in your browser...\n`);
    console.log(`If the browser does not open automatically, visit this URL:`);
    console.log(authUrl + '\n');
    openBrowser(authUrl);
  });
}

startOAuthFlow().catch((err) => {
  console.error('[Fatal OAuth Error]', err);
  process.exit(1);
});
