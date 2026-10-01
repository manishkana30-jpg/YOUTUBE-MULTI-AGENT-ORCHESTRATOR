import handler from '../pages/api/generate-video.js';

export default async function apiGenerateVideo(req, res) {
  return handler(req, res);
}
