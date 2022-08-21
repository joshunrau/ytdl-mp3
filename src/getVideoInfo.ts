import { getInfo, videoInfo as VideoInfo } from 'ytdl-core';

export default async function getVideoInfo(url: string): Promise<VideoInfo> {
  try {
    return await getInfo(url);
  } catch (error) {
    throw new Error('Unable to fetch info for video with URL: ' + url);
  }
}