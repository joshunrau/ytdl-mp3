#!/usr/bin/env node

const { program } = require('commander');
const package = require("../package.json");

const main = require('../src/main');
const utils = require("../src/utils");

program.name(package.name);
program.description(package.description);
program.version(package.version);
program.allowExcessArguments(false);
program.argument("<url>", "url of video to download");
program.option("--output <path>", "output directory", utils.getDownloadsDirectory());
program.parse();

main(program.args[0], program.opts());