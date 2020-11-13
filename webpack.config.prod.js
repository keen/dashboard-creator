const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const commonConfig = require('./webpack.common');

const FILE_NAME = 'dashboard-creator';

module.exports = (env) => {
  const config = merge(commonConfig, {
    context: __dirname,
    mode: 'production',
    devtool: 'source-map',

    entry: {
      main: `./src/index.ts`,
    },
    target: 'web',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `${FILE_NAME}.min.js`,
      libraryTarget: 'umd',
    },

    optimization: {
       minimizer: [
         new TerserPlugin({
           terserOptions: {
             keep_classnames: true,
             keep_fnames: true,
           },
         }),
       ],
     },

     plugins: [
       new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
       new webpack.optimize.ModuleConcatenationPlugin(),
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
    config.plugins.push(
      new BundleAnalyzerPlugin()
    );
  };

  return config;
};
