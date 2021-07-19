const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const loadConfig = require('./webpack/load-config');
const buildOptimization = require('./webpack/build-optimization');

const commonConfig = require('./webpack.common');

module.exports = (env) => {
  const applicationName = env.APP_NAME;
  const artifactName = env.ARTIFACT_NAME;

  const applicationConfig = loadConfig();

  const defaultWebpackConfig = commonConfig(applicationName);

  const config = merge(defaultWebpackConfig, {
    context: __dirname,
    mode: 'production',
    devtool: 'source-map',
    target: 'web',
    entry: {
      main: path.resolve(__dirname, 'src', `${applicationName}.ts`),
    },
    output: {
      path: path.resolve(__dirname, 'artifact'),
      filename: `[name].min.js`,
      libraryTarget: 'umd',
    },
    optimization: buildOptimization,
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      /* Create HTML template file */
      new HtmlWebpackPlugin({
        inject: true,
        scriptLoading: 'blocking',
        templateParameters: {
          'config': JSON.stringify(applicationConfig),
          'artifactName': artifactName,
        },
        template: path.join(__dirname, 'webpack', 'index.html'),
       }),
       /* Copy translation files to application distribution */
       new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public', 'locales'),
            to: path.resolve(__dirname, 'artifact', 'locales'),
          },
        ],
      }),
    ]
  });

  return config;
};
