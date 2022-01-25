const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const loadConfig = require('./webpack/load-config');
const buildOptimization = require('./webpack/build-optimization');

const commonConfig = require('./webpack.common');

module.exports = (env) => {
  const applicationName = env.APP_NAME;
  const applicationConfig = loadConfig();

  const defaultWebpackConfig = commonConfig(applicationName);

  const config = merge(defaultWebpackConfig, {
    context: __dirname,
    mode: 'production',
    devtool: 'source-map',
    target: 'web',
    output: {
      path: path.resolve(__dirname, 'dist', applicationName),
      filename: `[name].min.js`,
      libraryTarget: 'umd',
    },
    optimization: buildOptimization,
     plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/),
      /* Create HTML template file */
      new HtmlWebpackPlugin({
        inject: true,
        scriptLoading: 'blocking',
        templateParameters: {
          'config': JSON.stringify(applicationConfig)
        },
        template: path.join(__dirname, 'public', `${applicationName}.html`),
       }),
       /* Copy translation files to application distribution */
       new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public', 'locales'),
            to: path.resolve(__dirname, 'dist', 'locales'),
          },
        ],
      }),
    ]
  });

  if (env && env.ANALYZE_BUNDLE) {
    /* Creates artifact with information about application bundle */
    config.plugins.push(
      new BundleAnalyzerPlugin()
    );
  };

  return config;
};
