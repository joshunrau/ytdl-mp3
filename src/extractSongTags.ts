import type { videoInfo as VideoInfo } from 'ytdl-core';

import fetchAlbumArt from './fetchAlbumArt';
import fetchSearchResults from './fetchSearchResults';

import { SongTags } from './types';
import { removeParenthesizedText } from './utils';

export default async function extractSongTags(videoInfo: VideoInfo): Promise<SongTags> {

  const searchTerm = removeParenthesizedText(videoInfo.videoDetails.title);
  const results = await fetchSearchResults(searchTerm);

  // In the future, add option to allow user to verify result
  const result = results[0];

  const artworkUrl = result.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg');
  const albumArt = await fetchAlbumArt(artworkUrl);

  return {
    title: result.trackName,
    artist: result.artistName,
    image: {
      mime: 'image/png',
      type: {
        id: 3,
        name: 'front cover',
      },
      description: 'Album Art',
      imageBuffer: albumArt,
    }
  };
}