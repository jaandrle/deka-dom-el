#!/usr/bin/env bash
set -eou pipefail
npx editorconfig-checker -format gcc
npx size-limit
npx jshint index.js src
