#!/usr/bin/env bash
set -eou pipefail
# if $1=vim -no-color
additional=''
[ "$1" = 'vim' ] && additional='-no-color'
npx editorconfig-checker -format gcc ${additional}
[ "$1" = 'vim' ] && additional='--reporter unix'
npx jshint index.js src ${additional}
[ "$1" = 'vim' ] && exit 0
npx size-limit
