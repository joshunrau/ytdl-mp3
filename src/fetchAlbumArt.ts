import axios from 'axios';

export function fetchAlbumArt(url: string): Promise<Buffer> {
  return axios
    .get(url, { responseType: 'arraybuffer' })
    .then((response) => Buffer.from(response.data as string, 'binary'))
    .catch(() => {
      throw new Error('Failed to fetch album art from endpoint: ' + url);
    });
}
