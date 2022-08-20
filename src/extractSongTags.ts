import type { videoInfo as VideoInfo } from 'ytdl-core';

import { SongTags } from './types';
import { userInput } from './utils';

export default async function extractSongTags(
  videoInfo: VideoInfo
): Promise<SongTags> {
  const songTags = {
    title: videoInfo.videoDetails.media.song,
    artist: videoInfo.videoDetails.media.artist,
    image: null,
  };
  
  if (Object.values(songTags).includes(undefined)) {
    console.log('Unable to extract all song tags from YouTube');
  }

  for (const tag in songTags) {
    if (songTags[tag] === undefined) {
      songTags[tag] = await userInput(`Enter ${tag}: `);
    }
  }

  return songTags;
}
