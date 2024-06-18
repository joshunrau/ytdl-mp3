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

/**
 * Checks if the given path corresponds to a directory.
 *
 * @param path - the path to check.
 * @returns `true` if the path exists and is a directory, `false` otherwise.
 */
export function isDirectory(path: string): boolean {
  return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
}

/**
 * Prompts the user for input via stdin and returns a promise that resolves to the user's input.
 *
 * @param prompt - the prompt text displayed to the user.
 * @param defaultInput - optional default input pre-filled in the prompt.
 * @returns a promise that resolves to the user's input
 */
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

/**
 * Custom error class representing unrecoverable errors intentionally thrown by ytdl-mp3
 */
export class YtdlMp3Error extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'YtdlMp3Error';
  }
}
