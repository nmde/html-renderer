/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @file Webpack config.
 */
const frontend = require('nmde-common/config/frontend');
const path = require('path');

module.exports = frontend(
  path.resolve('.', 'src', 'index.ts'),
  path.resolve('.', 'dist'),
);
