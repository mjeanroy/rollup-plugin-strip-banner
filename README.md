# rollup-plugin-strip-banner

[![Greenkeeper badge](https://badges.greenkeeper.io/mjeanroy/rollup-plugin-strip-banner.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/mjeanroy/rollup-plugin-strip-banner.svg?branch=master)](https://travis-ci.org/mjeanroy/rollup-plugin-strip-banner)
[![Npm version](https://badge.fury.io/js/rollup-plugin-strip-banner.svg)](https://badge.fury.io/js/rollup-plugin-strip-banner)

A plugin for [rollup](http://rollupjs.org) that can be used to remove banners (such as license
headers) from modules files before generating the final bundle.

## Installation

```npm install --save-dev rollup-plugin-strip-banner```

## Configuration and usage

Add the plugin in your rollup configuration file:

```js
const stripBanner = require('rollup-plugin-strip-banner');

module.exports = {
  entry: 'src/index.js',
  dest: 'dist/index.js',
  plugins: [
    stripBanner()
  ]
}
```

As other rollup plugins, `include` and `exclude` can be configured:

```js
const stripBanner = require('rollup-plugin-strip-banner');

module.exports = {
  entry: 'src/index.js',
  dest: 'dist/index.js',
  plugins: [
    stripBanner({
      include: '**/*.js',
      exclude: 'node_modules/**/*'
    })
  ]
}
```

## ChangeLogs

- 3.1.0
  - Add support for rollup ^4.0.0
  - Dependency upgrades
- 3.0.0
  - Add support for rollup ^3.0.0
  - Dependency upgrades
  - Remove support of node < 14
- 2.0.0
  - Add support for rollup ^2.0.0.
  - Remove support of node < 10.
- 1.2.0
  - Make rollup peer dependency explicit.
  - Make support of node >= 6 explicit.
- 1.1.0
  - Dependency updates.
- 1.0.0
  - Fix issue with sourcemap generation.
  - Dependency updates.
- 0.3.0
  - Dependency updates.
- 0.2.0
  - Dependency update (`magic-string`).
  - Dependency update (`rollup-pluginutils`).
- 0.1.0 : First release

## License

MIT License (MIT)

## Contributing

If you find a bug or think about enhancement, feel free to contribute and submit an issue or a pull request.
