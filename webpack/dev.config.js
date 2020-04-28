const path = require('path');
const merge = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const common = require('./common.config.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, './'), // where dev server will look for static files, not compiled
    publicPath: '/', //relative path to output path where  devserver will look for compiled files
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: './index.html',
      production: false,
      injectTemplate: '',
      title: 'IoT Platform Admin',
    }),
  ],
});
