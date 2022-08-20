import axios from 'axios';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { AlbumArt, SongTags } from './types';

async function getArtworkURL(iTunesURL: URL): Promise<string> {
  const response = await axios.get(iTunesURL.href);
  if (response.status !== 200) {
    throw new Error(
      `Call to iTunes API returned status code ${response.status}`
    );
  } else if (response.data.resultCount === 0) {
    throw new Error('Call to iTunes API did not return any results');
  }

  for (const result of response.data.results) {
    if (result.artworkUrl100) {
      return result.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg');
    }
  }
}

export default async function fetchAlbumArt(
  songTags: SongTags
): Promise<AlbumArt> {
  const iTunesURL = new URL(
    'https://itunes.apple.com/search?country=US&media=music'
  );
  iTunesURL.searchParams.set('term', `$${songTags.artist} ${songTags.title}`);

  const artworkFilepath = path.join(os.homedir(), 'Downloads', 'album_art.jpg');
  const artworkURL = await getArtworkURL(iTunesURL);

  const response = await axios.get(artworkURL, { responseType: 'stream' });

  if (response.status !== 200) {
    throw new Error(
      `Request to endpoint ${artworkURL} returned status ${response.status}'`
    );
  }

  const fileStream = response.data.pipe(fs.createWriteStream(artworkFilepath));

  return new Promise((resolve, reject) => {
    fileStream.on('close', () => {
      const imageBuffer = fs.readFileSync(artworkFilepath);
      fs.rmSync(artworkFilepath);
      resolve({
        mime: 'image/png',
        type: {
          id: 3,
          name: 'front cover',
        },
        description: 'Album Art',
        imageBuffer: imageBuffer,
      });
    });
    fileStream.on('error', (error) => reject(error));
  });
}
