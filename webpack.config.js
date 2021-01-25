const path = require('path');
const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');

const APP_OUTPUT = {
  'dashboard-creator': {
    library: 'KeenDashboardCreator',
    libraryExport: 'KeenDashboardCreator',
  },
  'public-dashboard': {
    library: 'KeenPublicDashboard',
    libraryExport: 'KeenPublicDashboard',
  },
};

const config = (env) => merge(commonConfig(env.APP_NAME), {
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
    libraryTarget: 'umd',
    ...APP_OUTPUT[env.APP_NAME]
  },
});


module.exports = config;
