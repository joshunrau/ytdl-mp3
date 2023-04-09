import { downloadSong } from '../src/downloadSong';
import { getDownloadsDir } from '../src/utils';

const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

describe('Test of function downloadSong', () => {
  it('should return an error. the directory no exists!', async () => {
    await expect(downloadSong(url, { outputDir: 'probably/not/a/directory' })).rejects.toThrow();
  });

  it('should return an error. The URL no is valide or no exists', async () => {
    await expect(downloadSong('https://www.google.com', { outputDir: getDownloadsDir() })).rejects.toThrow();
  });

  it('should download of file audio and return name file of audio ', async () => {
    await expect(downloadSong(url, { outputDir: getDownloadsDir() })).resolves.not.toBeUndefined();
  }, 12000);
});
