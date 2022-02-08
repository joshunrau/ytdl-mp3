#!/bin/bash

declare -a sourceDirs=("app" "lib")

for dir in "${sourceDirs[@]}"; do
  find "./${dir}" -name '*.css' | xargs ./node_modules/.bin/css-beautify -r
  find "./${dir}" -name '*.html' | xargs ./node_modules/.bin/html-beautify --r
  find "./${dir}" -name '*.js' | xargs ./node_modules/.bin/js-beautify -r
done
