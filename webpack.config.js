const babelPresetTypescript = require('@babel/preset-typescript');
const path = require('path');

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                babelPresetTypescript,
              ],
            }
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
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
  output: {
    filename: '[name].js',
    path: path.resolve('.', 'dist'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
};
