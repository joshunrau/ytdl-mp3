#!/bin/bash

declare -a sourceDirs=("app" "lib")

for dir in "${sourceDirs[@]}"; do
  find "./${dir}" -name '*.css' | xargs css-beautify -r
  find "./${dir}" -name '*.html' | xargs html-beautify -r
  find "./${dir}" -name '*.js' | xargs js-beautify -r
done
