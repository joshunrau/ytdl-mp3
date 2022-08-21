export interface AlbumArt {
  mime: string;
  type: {
    id: number;
    name: string;
  };
  description: string;
  imageBuffer: Buffer;
}

export interface SongTags {
  title: string;
  artist: string;
  image: AlbumArt;
}

export interface SearchResult {
  artistName: string
  trackName: string
  artworkUrl100: string
}