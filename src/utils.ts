import fs from 'fs';
import os from 'os';
import path from 'path';

export function getDownloadsDir() {
  return path.join(os.homedir(), 'Downloads');
}

export function removeParenthesizedText(s: string): string {
  return s.replace(/\s*[([].*?[)\]]\s*/g, '');
}

export function isDirectory(dirPath: string): boolean {
  return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
}
