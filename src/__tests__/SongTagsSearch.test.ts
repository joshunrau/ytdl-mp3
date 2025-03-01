import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

import { SongTagsSearch } from '../SongTagsSearch';

describe('SongTagsSearch', () => {
  describe('search', () => {
    it('should handle an http status code of 500', async () => {
      vi.spyOn(axios, 'get').mockRejectedValueOnce({ response: { status: 500 } });
      const searcher = new SongTagsSearch('My Video');
      await expect(() => searcher.search()).rejects.toThrow('Call to iTunes API returned status code 500');
    });
    it('should handle an undefined http status code', async () => {
      vi.spyOn(axios, 'get').mockRejectedValueOnce({});
      const searcher = new SongTagsSearch('My Video');
      await expect(() => searcher.search()).rejects.toThrow('Call to iTunes API failed and did not return a status');
    });
    it('should handle a results count of zero', async () => {
      vi.spyOn(axios, 'get').mockResolvedValueOnce({ data: { resultCount: 0 } });
      const searcher = new SongTagsSearch('My Video');
      await expect(() => searcher.search()).rejects.toThrow('Call to iTunes API did not return any results');
    });
  });
});
