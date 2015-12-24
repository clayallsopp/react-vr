var webpack = require('webpack');
var path    = require('path');

module.exports = {
  devServer: {
    historyApiFallback: true,
    inline: true,
    progress: true,
    port: 8080
  },
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    path.resolve(__dirname, 'examples/index.js')
  ],
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: './bundle.js'
  },
  module: {
    loaders:[
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ]
  }
};
