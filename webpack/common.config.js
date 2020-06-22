const path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, '..', 'dist'), // base path where to send compiled assets
    publicPath: '/', // base path where referenced files will be look for
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },

      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 25000,
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      react: require.resolve('react'),
      'styled-components': require.resolve('styled-components'),
    },
  },
};
