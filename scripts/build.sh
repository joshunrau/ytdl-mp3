#!/bin/bash

if [[ -d build ]]; then
  rm -rf build
fi

mkdir build && cp -r src/. build/
browserify src/js/main.js > build/js/bundle.js
cp manifest.json build/