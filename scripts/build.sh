#!/bin/bash

if [[ -d build ]]; then
  rm -rf build
fi

mkdir build
cp -r src/. build/
cp -r images build/
cp manifest.json build/

browserify src/js/main.js > build/js/bundle.js