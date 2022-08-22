import main from '../src/main';
import { NotADirectoryError } from '../src/exceptions';

const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

test('main', () => {
  expect(main(url, {outputDir: 'probably/not/a/directory'})).rejects.toThrowError(NotADirectoryError);
  expect(5 + 5).toBe(10);
});