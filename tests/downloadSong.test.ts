import downloadSong from '../src/downloadSong';
import { NotADirectoryError, VideoInfoFetchError } from '../src/exceptions';
import { getDownloadsDir } from '../src/utils';

const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

test('downloadSong', async () => {
  await expect(
    downloadSong(url, { outputDir: 'probably/not/a/directory' })
  ).rejects.toThrowError(NotADirectoryError);
  await expect(
    downloadSong('https://www.google.com', { outputDir: getDownloadsDir() })
  ).rejects.toThrowError(VideoInfoFetchError);
  await expect(
    downloadSong(url, { outputDir: getDownloadsDir() })
  ).resolves.not.toThrowError();
}, 120000);
