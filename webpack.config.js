/* eslint-disable @typescript-eslint/no-var-requires */
const frontend = require('nmde-common/config/frontend');
const path = require('path');

module.exports = frontend(
  path.resolve('.', 'src', 'index.ts'),
  path.resolve('.', 'dist'),
  {
    module: {
      rules: [
        {
          test: /\.stl/,
          use: [
            {
              loader: 'file-loader',
              options: {
                publicPath: 'dist',
              },
            },
          ],
        },
      ],
    },
  },
);
