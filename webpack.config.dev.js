const path = require('path');
const { merge } = require('webpack-merge');

const loadConfig = require('./webpack/load-config');
const commonConfig = require('./webpack.common');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = (env) => {
  const applicationName = env.APP_NAME;
  const applicationConfig = loadConfig();

  const defaultWebpackConfig = commonConfig(applicationName);

  return merge(defaultWebpackConfig, {
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
    },
    plugins: [
      /* Create HTML template file */
      new HtmlWebpackPlugin({
        inject: true,
        scriptLoading: 'blocking',
        templateParameters: {
          'config': JSON.stringify(applicationConfig)
        },
        template: path.join(__dirname, 'public', `${applicationName}.html`),
       }),
      /* Fork TypeScript process */
      new ForkTsCheckerWebpackPlugin(),
      /* Display TypeScript compilation notifications */
      new ForkTsCheckerNotifierWebpackPlugin({ excludeWarnings: true }),
    ]
  });
};

module.exports = config;
