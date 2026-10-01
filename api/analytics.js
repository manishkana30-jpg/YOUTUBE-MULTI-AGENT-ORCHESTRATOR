import handler from '../pages/api/analytics.js';

export default async function apiAnalytics(req, res) {
  return handler(req, res);
}
