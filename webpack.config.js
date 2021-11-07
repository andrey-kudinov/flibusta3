const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'output.bundle.js',
  },
  plugins: [new HtmlWebPackPlugin()],
  node: {
    child_process: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
