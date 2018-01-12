const webpack = require('webpack');
const path = require('path');
const isProd = process.env.NODE_ENV === 'production';
let ZipPlugin = require('zip-webpack-plugin');

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

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].css'
            }
          },
          'extract-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: isProd
            }
          },
          'sass-loader'
        ]
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
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          },
          'extract-loader',
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href'],
              minimize: isProd
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
          'extract-loader',
          {
            loader: 'chrome-manifest-loader',
            options: {
              mapVersion: isProd
            }
          }
        ]
      }
    ]
  }
};


if (isProd) {
  module.exports.output.path = path.resolve(__dirname, './dist');
  module.exports.plugins = [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new ZipPlugin({
      path: './../',
      filename: require("./package.json").version + '.zip'
    })
  ]
}