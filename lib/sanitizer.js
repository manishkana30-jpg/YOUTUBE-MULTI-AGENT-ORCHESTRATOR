import fs from 'fs';

// 2. INPUT SANITIZATION & PROMPT INJECTION DEFENSE
export function sanitize(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>\"'`$]/g, '')            // Remove dangerous HTML & script chars
    .replace(/javascript:/gi, '')         // Remove pseudo JS protocols
    .replace(/data:/gi, '')               // Strip data URLs
    .substring(0, 500)                    // Safe maximum length
    .trim();
}

// 6. FILE DOWNLOAD & BUFFER VALIDATION
export function validateDownloadedFile(filePath, maxSize = 100 * 1024 * 1024) {
  if (!fs.existsSync(filePath)) {
    throw new Error('Downloaded file does not exist on disk.');
  }

  const stats = fs.statSync(filePath);
  if (stats.size === 0) {
    throw new Error('Downloaded file is empty (0 bytes).');
  }

  if (stats.size > maxSize) {
    throw new Error(`Downloaded file exceeds maximum allowed size: ${(stats.size / 1024 / 1024).toFixed(2)}MB > ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
  }

  // Verify file format via magic bytes
  const buffer = Buffer.alloc(12);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buffer, 0, 12, 0);
  fs.closeSync(fd);

  const hex = buffer.toString('hex').toLowerCase();

  // Valid MP4 (ftyp at offset 4), MP3 (sync word ff fb / ff f3 / ID3), or WAV (RIFF...WAVE)
  const isMp4 = hex.includes('66747970'); // 'ftyp'
  const isMp3Sync = buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
  const isId3 = hex.startsWith('494433'); // 'ID3'
  const isRiff = hex.startsWith('52494646'); // 'RIFF'

  if (!isMp4 && !isMp3Sync && !isId3 && !isRiff) {
    throw new Error('Downloaded file header does not match authorized media signatures (MP4, MP3, WAV).');
  }

  return true;
}

// 7. SENSITIVE CREDENTIAL MASKING IN LOGS
export function maskSecrets(obj) {
  if (!obj) return obj;
  try {
    const text = typeof obj === 'string' ? obj : JSON.stringify(obj);
    const masked = text
      .replace(/(AIzaSy[A-Za-z0-9_-]{33})/g, 'AIzaSy***[MASKED]***')
      .replace(/(sk-ant-[A-Za-z0-9_-]{20,})/g, 'sk-ant-***[MASKED]***')
      .replace(/(1\/\/[A-Za-z0-9_-]{20,})/g, '1//***[REFRESH_TOKEN_MASKED]***')
      .replace(/(GOCSPX-[A-Za-z0-9_-]{20,})/g, 'GOCSPX-***[MASKED]***');
    return typeof obj === 'string' ? masked : JSON.parse(masked);
  } catch {
    return '[Log data masked]';
  }
}

// 4. API AUTHENTICATION MIDDLEWARE
export function authenticateRequest(req, res, next) {
  const secretKey = process.env.API_SECRET_KEY;
  // If API_SECRET_KEY is not configured in env, allow access (open public/local mode)
  if (!secretKey) {
    return next ? next() : true;
  }

  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
  const cronHeader = req.headers['x-vercel-cron'];

  // Allow Vercel Cron or authenticated clients
  if (cronHeader === '1' || apiKey === secretKey) {
    return next ? next() : true;
  }

  const errRes = {
    status: 'error',
    error: 'Unauthorized: Invalid or missing API key',
    code: 'UNAUTHORIZED'
  };

  if (res && typeof res.status === 'function') {
    return res.status(401).json(errRes);
  }
  return false;
}
