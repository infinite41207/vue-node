const appConfig = require('./src/app.config')
const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    // We provide the app's title in Webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: appConfig.title,
    plugins: [new NodePolyfillPlugin()],
    resolve: {
      // ...
      fallback: {
        child_process: false,
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      externals: ['serialport', 'leveldown'],
      nodeIntegration: true,
      chainWebpackRendererProcess(config) {
        config.plugins.delete('workbox')
        config.plugins.delete('pwa')
      },
      customFileProtocol: './',
    },
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true,
  },
  devServer: {
    port: process.env.VUE_APP_PORT,
  },
})
