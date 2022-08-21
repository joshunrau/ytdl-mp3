import cp from 'child_process';
import fs from 'fs';
import ffmpeg from 'ffmpeg-static';

interface Options {
  clean?: boolean;
}

export default function convertVideoToAudio(
  inputFile: string,
  outputFile: string,
  options?: Options
) {
  if (!fs.existsSync(inputFile)) {
    throw new Error('Input file does not exist: ' + inputFile);
  }

  cp.execSync(
    `${ffmpeg} -loglevel 24 -i ${inputFile} -vn -sn -c:a mp3 -ab 192k ${outputFile}`
  );

  if (options?.clean) {
    fs.rmSync(inputFile);
  }
}
