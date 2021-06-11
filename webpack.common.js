const path =  require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const loadAppConfig = () => {
  if (process.env.NODE_ENV === 'development') {
    return require('./config');
  }
  return {};
};

module.exports = (appName) => ({
  entry: {
    main: `./src/${appName}.ts`,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      scriptLoading: "blocking",
      templateParameters: {
        'config': JSON.stringify(
          loadAppConfig()
        )
      },
      template: path.join(__dirname, 'public', `${appName}.html`),
    }),
  ],
})
