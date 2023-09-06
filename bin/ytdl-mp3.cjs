#!/usr/bin/env node

const { Command } = require('commander');
const { Downloader, YtdlMp3Error } = require('../dist/index.cjs');
const { name, description, version } = require('../package.json');

const program = new Command();
program.name(name);
program.description(description);
program.version(version);
program.allowExcessArguments(false);
program.argument('<url>', 'url of video to download');
program.option('-o --output-dir <path>', 'path to output directory', Downloader.defaultDownloadsDir);
program.option('-n --no-get-tags', 'skip extracting/applying id3 tags');
program.option('-v --verify-tags', 'verify id3 tags fetched from itunes');
program.option('--verbose', 'enable verbose mode');
program.parse();

async function main() {
  const options = program.opts();
  try {
    const downloader = new Downloader(options);
    await downloader.downloadSong(program.args[0]);
  } catch (err) {
    if (err instanceof YtdlMp3Error) {
      if (options.verbose) {
        console.error(err.cause)
        console.error(err.stack);
      }
      console.error(`ERROR: ${err.message}`);
      process.exit(1);
    }
    throw err;
  }
}

main();
