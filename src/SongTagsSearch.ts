import axios, { type AxiosError } from 'axios';

import { YtdlMp3Error, removeParenthesizedText, userInput } from './utils';

export type SearchResult = {
  artistName: string;
  artworkUrl100: string;
  collectionName: string;
  primaryGenreName: string;
  releaseDate: string;
  trackName: string;
  trackNumber: number;
};

export type SearchData = {
  resultCount: number;
  results: SearchResult[];
};

export type AlbumArt = {
  description: string;
  imageBuffer: Buffer;
  mime: string;
  type: number;
};

export type SongTags = {
  APIC: AlbumArt;
  TRCK: number;
  album: string;
  artist: string;
  genre: string;
  title: string;
  year: string;
};

export class SongTagsSearch {
  private searchTerm: string;
  private url: URL;

  constructor(searchTerm: string) {
    this.searchTerm = removeParenthesizedText(searchTerm);
    this.url = new URL('https://itunes.apple.com/search?');
    this.url.searchParams.set('media', 'music');
    this.url.searchParams.set('term', this.searchTerm);
  }

  async search(verify = false): Promise<SongTags> {
    console.log(`Attempting to query iTunes API with the following search term: ${this.searchTerm}`);
    const searchResults = await this.fetchResults();
    const result = verify ? await this.getVerifiedResult(searchResults) : searchResults[0]!;
    const artworkUrl = result.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg');
    const albumArt = await this.fetchAlbumArt(artworkUrl);
    return {
      APIC: {
        description: 'Album Art',
        imageBuffer: albumArt,
        mime: 'image/jpeg',
        type: 3
      },
      TRCK: result.trackNumber,
      album: result.collectionName,
      artist: result.artistName,
      genre: result.primaryGenreName,
      title: result.trackName,
      year: result.releaseDate.substring(0, 4)
    };
  }

  private async fetchAlbumArt(url: string): Promise<Buffer> {
    return axios
      .get(url, { responseType: 'arraybuffer' })
      .then((response) => Buffer.from(response.data as string, 'binary'))
      .catch(() => {
        throw new YtdlMp3Error('Failed to fetch album art from endpoint: ' + url);
      });
  }

  private async fetchResults(): Promise<SearchResult[]> {
    const response = await axios.get<SearchData>(this.url.href).catch((error: AxiosError) => {
      if (error.response?.status) {
        throw new YtdlMp3Error(`Call to iTunes API returned status code ${error.response.status}`);
      }
      throw new YtdlMp3Error('Call to iTunes API failed and did not return a status');
    });

    if (response.data.resultCount === 0) {
      throw new YtdlMp3Error('Call to iTunes API did not return any results');
    }

    return response.data.results;
  }

  private async getVerifiedResult(searchResults: SearchResult[]): Promise<SearchResult> {
    for (const result of searchResults) {
      console.log('The following tags were extracted from iTunes:');
      console.log('Title: ' + result.trackName);
      console.log('Artist: ' + result.artistName);
      console.log('Album: ' + result.collectionName);
      console.log('Genre: ' + result.primaryGenreName);

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
    throw new YtdlMp3Error('End of results');
  }
}
