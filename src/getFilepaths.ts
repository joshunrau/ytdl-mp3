import fs from 'fs';
import path from 'path';

import { removeParenthesizedText } from './utils';

export default function getFilepaths(title: string, outputDir: string) {
  const baseFileName = removeParenthesizedText(title)
    .replace(/[^a-z0-9]/gi, '_')
    .split('_')
    .filter((element) => element)
    .join('_')
    .toLowerCase();

  const filepaths = {
    audioFile: path.join(outputDir, baseFileName + '.mp3'),
    videoFile: path.join(outputDir, baseFileName + '.mp4'),
  };

  Object.values(filepaths).forEach((file) => {
    if (fs.existsSync(file)) {
      fs.rmSync(file);
    }
  });

  return filepaths;
}
