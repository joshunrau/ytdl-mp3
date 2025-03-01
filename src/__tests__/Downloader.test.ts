import fs from 'fs';
import path from 'path';
import { PassThrough } from 'stream';

import ytdl from '@distube/ytdl-core';
import NodeID3 from 'node-id3';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

import { Downloader } from '../Downloader';
import { FormatConverter } from '../FormatConverter';
import { SongTagsSearch } from '../SongTagsSearch';
import * as utils from '../utils';

const { YtdlMp3Error } = utils;

vi.mock('node-id3', () => ({ default: { write: vi.fn() } }));
vi.mock('../SongTagsSearch', () => ({ SongTagsSearch: vi.fn() }));

describe('Downloader', () => {
  const outputDir = path.resolve(import.meta.dirname, '__output__');
  const url = 'https://www.youtube.com/watch?v=7jgnv0xCv-k';

  beforeAll(() => {
    fs.mkdirSync(outputDir);
  });

  afterAll(() => {
    fs.rmSync(outputDir, { force: true, recursive: true });
  });

  describe('downloadSong', () => {
    let downloadStream: PassThrough;
    let formatConverter: { videoToAudio: Mock };

    beforeEach(() => {
      downloadStream = new PassThrough();
      formatConverter = { videoToAudio: vi.fn() };
      vi.spyOn(ytdl, 'getInfo').mockResolvedValue({ videoDetails: { title: '' } } as any);
      vi.spyOn(ytdl, 'downloadFromInfo').mockReturnValue(downloadStream as any);
      vi.spyOn(FormatConverter.prototype, 'videoToAudio').mockImplementation(formatConverter.videoToAudio);
    });

    it('should throw if the output directory does not exist', async () => {
      const downloader = new Downloader({ getTags: false, outputDir });
      vi.spyOn(utils, 'isDirectory').mockReturnValueOnce(false);
      await expect(downloader.downloadSong(url)).rejects.toBeInstanceOf(YtdlMp3Error);
    });
    it('should throw a YtdlMp3Error if ytdl.getInfo rejects', async () => {
      const downloader = new Downloader({ getTags: false, outputDir });
      vi.spyOn(ytdl, 'getInfo').mockRejectedValueOnce(new Error());
      await expect(() => downloader.downloadSong(url)).rejects.toBeInstanceOf(YtdlMp3Error);
    });
    it('should call ytdl.getInfo', async () => {
      const downloader = new Downloader({ getTags: false, outputDir });
      const promise = downloader.downloadSong(url);
      expect(ytdl.getInfo).toHaveBeenCalledOnce();
      downloadStream.emit('data', Buffer.from([1, 2, 3]));
      downloadStream.end();
      await promise;
    });
    it('should call NodeID3 with the return value of songTagsSearch.search, if getTags is set to true', async () => {
      const id = crypto.randomUUID();
      const search = vi.fn(() => id);
      vi.mocked(SongTagsSearch).mockImplementationOnce(() => ({ search }) as any);
      const downloader = new Downloader({ getTags: true, outputDir });
      const promise = downloader.downloadSong(url);
      downloadStream.end();
      await promise;
      expect(search).toHaveBeenCalledOnce();
      expect(NodeID3.write).toHaveBeenCalledOnce();
      expect(NodeID3.write).toBeCalledWith(id, expect.any(String));
    });
    it('should return the downloader information', async () => {
      const downloader = new Downloader({ getTags: false, outputDir });
      const promise = downloader.downloadSong(url);
      downloadStream.end();
      await expect(promise).resolves.toMatchObject({
        outputFile: expect.any(String)
      });
    });
  });
});
