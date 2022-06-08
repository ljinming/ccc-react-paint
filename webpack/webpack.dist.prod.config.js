const path = require('path');
const webpack = require('webpack');
const {merge} = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');

process.env.NODE_ENV = 'production';

module.exports = merge(webpackBaseConfig, {
  devtool: 'source-map',
  entry: {
    main: './src/entry.tsx',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'paint.min.js',
    library: 'paint',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },

  plugins: [
    // @todo
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
  ],
});
