const path = require('path');

module.exports = {
  configureWebpack: {
    optimization: {
      splitChunks: false,
      minimize: true
    }
  },
  filenameHashing: false
}