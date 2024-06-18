import fs from 'fs';
import path from 'path';

import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import ytdl from 'ytdl-core';

import { Downloader } from '../Downloader';
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

    beforeEach(() => {
      downloader = new Downloader({
        getTags: false,
        outputDir
      });
    });

    it('should throw if the output directory does not exist', async () => {
      vi.spyOn(utils, 'isDirectory').mockReturnValueOnce(false);
      await expect(downloader.downloadSong(url)).rejects.toBeInstanceOf(YtdlMp3Error);
    });
    // it('should call ytdl.getInfo', async () => {
    //   vi.spyOn(ytdl, 'getInfo').mockResolvedValueOnce({} as any);
    //   await downloader.downloadSong(url);
    //   expect(ytdl.getInfo).toHaveBeenCalledOnce();
    // });
    // it('should throw a YtdlMp3Error if ytdl.getInfo rejects', async () => {
    //   vi.spyOn(ytdl, 'getInfo').mockRejectedValueOnce(new Error());
    //   await expect(() => downloader.downloadSong(url)).rejects.toBeInstanceOf(YtdlMp3Error);
    // });
  });
});
