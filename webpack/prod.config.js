const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const common = require('./common.config');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, // instead of style-loader
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: './index.html',
      production: true,
      injectTemplate: '/inject.js',
    }),
    new MiniCssExtractPlugin({
      // plugin for controlling how compiled css will be outputted and named
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
    new CopyPlugin([{from: 'src/inject.template.js', to: ''}]),
  ],
});
