export interface ProgramOptions {
  outputDir: string;
  title?: string;
  artist?: string;
}

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
  image: AlbumArt | null;
}
