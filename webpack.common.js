const webpack = require('webpack');
const path =  require('path');

const { version } = require('./package.json');

module.exports = (appName) => {
  const isDevelopmentMode = process.env.NODE_ENV === 'development';

  const babelCodeTranspiler = {
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-typescript',
        '@babel/preset-react',
        /* Include required polyfills */
        ...(isDevelopmentMode ? [] : [
          ['@babel/preset-env',
            {
              corejs: '3.6',
              useBuiltIns: 'entry',
            }]
          ])
      ],
      plugins: [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-runtime",
        /* Use Hot-reload for development mode */
        ...(isDevelopmentMode ? ["react-hot-loader/babel"] : []),
      ]
    }
  };

  return {
    entry: {
      main: `./src/${appName}.ts`,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: [babelCodeTranspiler],
        },
      ]
    },
    plugins: [
      /* Define global webpack variable to tag dashboards with application version */
      new webpack.DefinePlugin({
        '__APP_VERSION__': JSON.stringify(version),
      }),
    ],
  };
}
