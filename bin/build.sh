#!/bin/bash

if [[ -d dist ]]; then
  rm -rf dist
fi

mkdir dist && cp -r app/. dist/
browserify lib/js/main.js > dist/js/bundle.js