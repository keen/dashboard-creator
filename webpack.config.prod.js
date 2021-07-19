const webpack = require('webpack');
const path = require('path');
const {merge} = require('webpack-merge');

const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const commonConfig = require('./webpack.common');
const { version } = require('./package.json');

module.exports = (env) => {
  const config = merge(commonConfig(env.APP_NAME), {
    context: __dirname,
    mode: 'production',
    devtool: 'source-map',
    target: 'web',
    output: {
      path: path.resolve(__dirname, 'dist', env.APP_NAME),
      filename: `[name].min.js`,
      libraryTarget: 'umd',
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
                  ['@babel/preset-env',
                    {
                      corejs: '3.6',
                      useBuiltIns: 'entry',
                    }]
                ],
                plugins: [
                  "@babel/plugin-proposal-class-properties",
                  "@babel/plugin-transform-runtime",
                ]
              }
            },
          ],
        },
      ]
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
       new webpack.DefinePlugin({
          '__APP_VERSION__': JSON.stringify(version),
        }),
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
