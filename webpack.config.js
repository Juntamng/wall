// webpack.config.js
const webpack = require('webpack')
const path = require('path')

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: './app.js',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '.'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: './js/bundle.js'
  },
  module: {
    rules: [
    {
      test: /\.js$/,
      include: path.resolve(__dirname, 'src'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { modules: false }]
          ]
        }
      }]
    },
    {
      test: /\.scss$/,
      use: [{
          loader: "style-loader"
      }, {
          loader: "css-loader", options: {
              sourceMap: true
          }
      }, {
          loader: "sass-loader", options: {
              sourceMap: true
          }
      }]
    },
    {
        test: /\.(png|jpg)$/,
        use: [{
            loader: 'url-loader',
            options: { limit: 10000 } // Convert images < 10k to base64 strings
        }]
    },
    {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {loader: 'html-loader'}
    }
   ]
  }
}

module.exports = config