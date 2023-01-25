import downloadSong from '../src/downloadSong';
import { NotADirectoryError, VideoInfoFetchError } from '../src/exceptions';
import { getDownloadsDir } from '../src/utils';

const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

describe('Test of function downloadSong', () => {

  test('It should return an error. the directory no exists!', async () => {

    await expect(downloadSong(url, { outputDir: 'probably/not/a/directory' })
    ).rejects.toThrowError(NotADirectoryError);

  });

  test('It should return an error. The URL no is valide or no exists', async () => {
    await expect(
      downloadSong('https://www.google.com', { outputDir: getDownloadsDir() })
    ).rejects.toThrowError(VideoInfoFetchError);
  });

  test('It should download of file audio and return name file of audio ', async () => {
    await expect(
      downloadSong(url, { outputDir: getDownloadsDir() })
    ).resolves.not.toBeUndefined();
  }, 12000);


});
