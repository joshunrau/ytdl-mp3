import axios, { AxiosError } from 'axios';
import type { MoreVideoDetails } from 'ytdl-core';

import { removeParenthesizedText, userInput } from './utils';

export interface SearchResult {
  artistName: string;
  trackName: string;
  artworkUrl100: string;
}

export interface SearchData {
  resultCount: number;
  results: SearchResult[];
}

export interface AlbumArt {
  mime: string;
  type: {
    id: number;
    name: string;
  };
  description: string;
  imageBuffer: Buffer;
}

export interface SongTags {
  title: string;
  artist: string;
  image: AlbumArt;
}

export class SongTagsSearch {
  private searchTerm: string;
  private url: URL;

  constructor(videoDetails: MoreVideoDetails) {
    this.searchTerm = removeParenthesizedText(videoDetails.title);
    this.url = new URL('https://itunes.apple.com/search?');
    this.url.searchParams.set('media', 'music');
    this.url.searchParams.set('term', this.searchTerm);
  }

  async search(verify = false): Promise<SongTags> {
    const searchResults = await this.fetchResults();
    const result = verify ? await this.getVerifiedResult(searchResults) : searchResults[0];
    const artworkUrl = result.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg');
    const albumArt = await this.fetchAlbumArt(artworkUrl);
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
      },
    };
  }

  private async fetchResults(): Promise<SearchResult[]> {
    const response = await axios.get<SearchData>(this.url.href).catch((error: AxiosError) => {
      if (error.response?.status) {
        throw new Error(`Call to iTunes API returned status code ${error.response.status}`);
      }
      throw new Error('Call to iTunes API failed and did not return a status');
    });

    if (response.data.resultCount === 0) {
      throw new Error('Call to iTunes API did not return any results');
    }

    return response.data.results;
  }

  private async getVerifiedResult(searchResults: SearchResult[]): Promise<SearchResult> {
    for (const result of searchResults) {
      console.log('The following tags were extracted from iTunes:');
      console.log('Title: ' + result.trackName);
      console.log('Artist: ' + result.artistName);

      const validResponses = ['Y', 'YES', 'N', 'NO'];
      let userSelection = (await userInput('Please verify (Y/N): ')).toUpperCase();
      while (!validResponses.includes(userSelection)) {
        console.error('Invalid selection, try again!');
        userSelection = (await userInput('Please verify (Y/N): ')).toUpperCase();
      }
      if (userSelection === 'Y' || userSelection === 'YES') {
        return result;
      }
    }
    throw new Error('End of results');
  }

  private async fetchAlbumArt(url: string): Promise<Buffer> {
    return axios
      .get(url, { responseType: 'arraybuffer' })
      .then((response) => Buffer.from(response.data as string, 'binary'))
      .catch(() => {
        throw new Error('Failed to fetch album art from endpoint: ' + url);
      });
  }
}
