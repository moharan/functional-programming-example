const path = require('path');
const fs = require('fs');

module.exports = env => {
  return {
    mode: 'development',
    entry: {
      main: path.resolve(__dirname, 'scripts', 'main.js')
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].dist.js'
    },
    devServer: {
      port: 1337,
      contentBase: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      index: 'index.html'
    }
  };
};
