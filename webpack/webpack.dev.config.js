/**
 * 本地预览
 */

const path = require('path');
const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = merge(webpackBaseConfig, {
  devtool: 'eval-source-map',

  // 入口
  entry: {
    main: './demo',
  },
  // 输出
  output: {
    path: path.join(__dirname, '../examples/dist'),
    publicPath: '',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  resolve: {
    alias: {
      Paint: '../src/index',
    },
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({name: 'vendors', filename: 'vendor.bundle.js'}),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'demo/index.html',
    }),
    new FriendlyErrorsPlugin(),
  ],
});
