const path = require('path');

module.exports = {
  pages: {
    index: {
      entry: 'src/demo/app/index.js',
      template: 'src/demo/app/index.html',
      filename: 'index.html',
      title: 'Demo'
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
      },
      extensions: [
        '.js', '.ts', '.vue'
      ]
    },
    resolveLoader: {
      alias: {
      }
    },
    plugins: [
    ]
  }
};
