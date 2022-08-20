#!/usr/bin/env node

import { Command } from 'commander';

import main from './main';
import { getDownloadsDirectory } from './utils';
import { name, description, version } from '../package.json';

const program = new Command();
program.name(name);
program.description(description);
program.version(version);
program.allowExcessArguments(false);
program.argument('<url>', 'url of video to download');
program.option('-t --title', 'title of song');
program.option('-a --artist', 'artist of song');
program.option(
  '-o --output-dir',
  'path to output directory',
  getDownloadsDirectory()
);
program.parse();

// Until latest version works
process.env['YTDL_NO_UPDATE'] = '1';

main(program.args[0], program.opts());
