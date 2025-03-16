## bs: Build system based on executables
This project uses [jaandrle/bs: The simplest possible build system using executable/bash scripts](
https://github.com/jaandrle/bs).

#### bs/build.js [main|signals] [--no-types|--help]
Generates alternative versions of the project (other than native ESM code).
Also generates typescript definitions.

#### bs/docs.js
Generates documentation, from `docs/`. Uses “SSR” technique, using deka-dom-el itself.

For running use `npx serve dist/docs`.

#### bs/lint.sh
Lints size of the project, jshint. See configs:

- `package.json`: key `size-limit`
- `package.json`: key `jshintConfig`
- `.editorconfig`
