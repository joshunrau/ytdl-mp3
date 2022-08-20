import os from 'os';
import path from 'path';
import readline from 'readline';

export function getDownloadsDirectory() {
  return path.join(os.homedir(), 'Downloads');
}

export async function userInput(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question(prompt, (response) => {
      rl.close();
      if (response) {
        resolve(response);
      } else {
        reject(new Error('Invalid response: ' + response));
      }
    });
  });
}
