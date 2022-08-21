import axios from 'axios';

export default function fetchAlbumArt(url: string): Promise<Buffer> {
  return axios
    .get(url, { responseType: 'arraybuffer' })
    .then((response) => response.data)
    .catch(() => {
      throw new Error('Failed to fetch album art from endpoint: ' + url);
    });
}
