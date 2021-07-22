const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  /* Creates dedicated runtime chunk */
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
   /* Performs code minification */
   new TerserPlugin({
     terserOptions: {
       keep_classnames: true,
       keep_fnames: true,
     },
   }),
  ],
};
