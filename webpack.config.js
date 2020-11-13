const path = require('path');
const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');

const config = merge(commonConfig, {
  mode: 'development',
  target: 'web',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 8080,
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    library: 'KeenDashboardCreator',
    libraryExport: 'KeenDashboardCreator',
    libraryTarget: 'umd',
  },
});

module.exports = config;
