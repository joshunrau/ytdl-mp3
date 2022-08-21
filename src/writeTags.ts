import NodeID3 from 'node-id3';
import { SongTags } from './types';

export default function writeTags(tags: SongTags, audioFile: string) {
  NodeID3.write(tags, audioFile);
}
