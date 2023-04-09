import cp from 'child_process';
import fs from 'fs';

import ffmpeg from 'ffmpeg-static';

export function convertVideoToAudio(inputFile: string, outputFile: string): void {
  if (!fs.existsSync(inputFile)) {
    throw new Error('Input file does not exist: ' + inputFile);
  }

  if (!ffmpeg) {
    throw new Error(`Failed to resolve ffmpeg binary`);
  }

  cp.execSync(`${ffmpeg} -loglevel 24 -i ${inputFile} -vn -sn -c:a mp3 -ab 192k ${outputFile}`);

  fs.rmSync(inputFile);
}
