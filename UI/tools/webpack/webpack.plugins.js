const webpack = require('webpack');
const { inDev } = require('./webpack.helpers');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  inDev() && new webpack.HotModuleReplacementPlugin(),
  inDev() && new ReactRefreshWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: 'src/index.html',
    favicon: 'assets/images/logo.png',
    inject: true,
  }),
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[name].chunk.css',
  }),
  new ZipPlugin({
    include: [/\.js$/],
    filename: 'main.js',

    // OPTIONAL: see https://github.com/thejoshwolfe/yazl#addfilerealpath-metadatapath-options
    fileOptions: {
      mtime: new Date(),
      mode: 0o100664,
      compress: true,
      forceZip64Format: false,
    },

    // OPTIONAL: see https://github.com/thejoshwolfe/yazl#endoptions-finalsizecallback
    zipOptions: {
      forceZip64Format: false,
    },
  }),
].filter(Boolean);
