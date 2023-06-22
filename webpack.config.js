const webpack = require('webpack');
const path = require('path');
const ZipPlugin = require('zip-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {

  entry: {
    manifest : './source/manifest.json',
    background: './source/background.js'
  },

  output: {
    path: path.resolve(__dirname, './test'),
    filename: '[name].js'
  },

  watch: !isProd,
  devtool: isProd ? false : "source-map",

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'esbuild-loader',
        options: {
          target: 'chrome88',
        },
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /[/\\]manifest\.json$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          },
          {
            loader: "extract-loader",
            options: {
              publicPath: "",
            }
          },
          {
            loader: 'chrome-manifest-loader',
            options: {
              mapVersion: isProd,
              mapMinimumChromeVersion: true
            }
          }
        ],
        type: 'javascript/auto'
      }
    ]
  }
};


if (isProd) {
  module.exports.output.path = path.resolve(__dirname, './dist');
  module.exports.plugins = [
    new ZipPlugin({
      path: './../',
      filename: require("./package.json").version + '.zip'
    })
  ]
}