import axios, { AxiosError } from 'axios';
import { SearchResult } from './types';

export default async function fetchSearchResults(searchTerm: string): Promise<SearchResult[]> {
  const url = new URL('https://itunes.apple.com/search?');
  url.searchParams.set('media', 'music');
  url.searchParams.set('term', searchTerm);

  const response = await axios.get(url.href).catch((error: AxiosError) => {
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
