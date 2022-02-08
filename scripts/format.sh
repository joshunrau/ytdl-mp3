#!/bin/bash

find ./src -name '*.css' | xargs css-beautify -r
find ./src -name '*.html' | xargs html-beautify -r
find ./src -name '*.js' | xargs js-beautify -r