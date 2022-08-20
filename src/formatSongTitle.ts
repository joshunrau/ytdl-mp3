export default function formatSongTitle(title: string) {
  return title
    .replace(/[^a-z0-9]/gi, '_')
    .split('_')
    .filter((element) => element)
    .join('_')
    .toLowerCase();
}