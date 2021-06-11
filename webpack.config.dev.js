const path = require('path');
const {merge} = require('webpack-merge');

const commonConfig = require('./webpack.common');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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
    static: path.join(__dirname, 'public'),
    hot: true,
    compress: true,
    port: 8080,
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'umd',
    ...APP_OUTPUT[env.APP_NAME]
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-typescript',
                '@babel/preset-react',
              ],
              plugins: [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-transform-runtime",
                "react-hot-loader/babel"
              ]
            }
          },
        ],
      },
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin()
  ]
});


module.exports = config;
