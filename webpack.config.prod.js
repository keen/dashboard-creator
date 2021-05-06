const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const commonConfig = require('./webpack.common');

module.exports = (env) => {
  const config = merge(commonConfig(env.APP_NAME), {
    context: __dirname,
    mode: 'production',
    devtool: 'source-map',

    entry: {
      main: `./src/${env.APP_NAME}.ts`,
    },
    target: 'web',

    output: {
      path: path.resolve(__dirname, 'dist', env.APP_NAME),
      filename: `[name].min.js`,
      /* Isolates jsonp context for multiple webpack apps */
      // @TODO: Remove after migration to Webpack 5
      jsonpFunction: 'keen-dashboard-creator',
      libraryTarget: 'umd',
    },

    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /node_modules/,
            chunks: 'all',
            name: 'vendors',
            enforce: true,
          },
        },
      },
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
