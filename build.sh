#!/bin/bash

git submodule init

cd parser
npm install
#npm run build
cd -

if [ ! -d dist ]; then
  mkdir dist
fi

cp parser/lib/index.js dist/parser.js
cp plugin/index.js dist/plugin.js
