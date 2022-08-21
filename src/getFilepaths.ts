import fs from 'fs';
import path from 'path';

import { getDownloadsDir } from './utils';

export default function getFilepaths(title: string, outputDir?: string) {
  const baseFileName = title
    .replace(/[^a-z0-9]/gi, '_')
    .split('_')
    .filter((element) => element)
    .join('_')
    .toLowerCase();

  const filepaths = {
    audioFile: path.join(outputDir || getDownloadsDir(), baseFileName + '.mp3'),
    videoFile: path.join(outputDir || getDownloadsDir(), baseFileName + '.mp4'),
  };

  Object.values(filepaths).forEach((file) => {
    if (fs.existsSync(file)) {
      fs.rmSync(file);
    }
  });

  return filepaths;
}
