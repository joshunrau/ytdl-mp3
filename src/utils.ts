import fs from 'fs';
import readline from 'readline';

/**
 * Removes content within square brackets or parentheses, including the brackets and
 * parentheses themselves, along with any surrounding whitespace, from the given string.
 *
 * @param input the input string from which to remove content within brackets and parentheses.
 * @returns a new string with content within brackets and parentheses removed.
 */
export function removeParenthesizedText(s: string): string {
  // This loop is to handle nested nested brackets (see test for examples)
  const regex = /\s*([[(][^[\]()]*[\])])\s*/g;
  while (regex.test(s)) {
    s = s.replace(regex, '');
  }
  return s;
}

export function isDirectory(dirPath: string): boolean {
  return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
}

export async function userInput(prompt: string, defaultInput?: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve, reject) => {
    rl.question(prompt, (response) => {
      rl.close();
      if (response) {
        resolve(response);
      } else {
        reject(new YtdlMp3Error('Invalid response: ' + response));
      }
    });
    rl.write(defaultInput ?? '');
  });
}

export class YtdlMp3Error extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'YtdlMp3Error';
  }
}
