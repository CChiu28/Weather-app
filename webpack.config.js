const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.js',
    // api: './src/api.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
        title: 'test',
        template: './src/template.html',
    }),
    new Dotenv(),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     'OPENWEATHER_KEY': JSON.stringify(process.env.OPENWEATHER_KEY)
    //   }
    // })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        },
    ],
  },
};