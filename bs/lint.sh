#!/usr/bin/env bash
set -eou pipefail
# if $1=vim -no-color
one=${1:-''}
additional=''
[ "$one" = 'vim' ] && additional='-no-color'
npx editorconfig-checker -format gcc ${additional}
[ "$one" = 'vim' ] && additional='--reporter unix'
npx jshint index.js src ${additional}
[ "$one" = 'vim' ] && exit 0
npx size-limit
npx publint
