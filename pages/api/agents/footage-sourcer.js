import { pexelsClient } from '../../../lib/pexels-client.js';

export async function getStockFootage(keywords) {
  return await pexelsClient.searchAndDownloadVideos(keywords);
}
