import fs from 'fs';
import path from 'path';
import { PassThrough } from 'stream';

import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import ytdl from 'ytdl-core';

import { Downloader } from '../Downloader';
import { FormatConverter } from '../FormatConverter';
import * as utils from '../utils';

const { YtdlMp3Error } = utils;

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
    let downloader: Downloader;
    let downloadStream: PassThrough;
    let formatConverter: { videoToAudio: Mock };

    beforeEach(() => {
      downloader = new Downloader({ getTags: false, outputDir });
      downloadStream = new PassThrough();
      formatConverter = { videoToAudio: vi.fn() };
      vi.spyOn(ytdl, 'getInfo').mockResolvedValue({ videoDetails: { title: '' } } as any);
      vi.spyOn(ytdl, 'downloadFromInfo').mockReturnValue(downloadStream as any);
      vi.spyOn(FormatConverter.prototype, 'videoToAudio').mockImplementation(formatConverter.videoToAudio);
    });

    it('should throw if the output directory does not exist', async () => {
      vi.spyOn(utils, 'isDirectory').mockReturnValueOnce(false);
      await expect(downloader.downloadSong(url)).rejects.toBeInstanceOf(YtdlMp3Error);
    });
    it('should call ytdl.getInfo', async () => {
      const promise = downloader.downloadSong(url);
      expect(ytdl.getInfo).toHaveBeenCalledOnce();
      downloadStream.end();
      await promise;
    });
    it('should throw a YtdlMp3Error if ytdl.getInfo rejects', async () => {
      vi.spyOn(ytdl, 'getInfo').mockRejectedValueOnce(new Error());
      await expect(() => downloader.downloadSong(url)).rejects.toBeInstanceOf(YtdlMp3Error);
    });
    it('should return the output file', async () => {
      const promise = downloader.downloadSong(url);
      downloadStream.end();
      await expect(promise).resolves.toBeTypeOf('string');
    });
  });
});
