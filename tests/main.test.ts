import main from '../src/main';
import { NotADirectoryError, VideoInfoFetchError } from '../src/exceptions';
import { getDownloadsDir } from '../src/utils';

const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

test('main', async () => {
  await expect(main(url, {outputDir: 'probably/not/a/directory'})).rejects.toThrowError(NotADirectoryError);
  await expect(main('https://www.google.com', {outputDir: getDownloadsDir()})).rejects.toThrowError(VideoInfoFetchError);
  await expect(main(url, {outputDir: getDownloadsDir()})).resolves.not.toThrowError();
}, 120000);

