module.exports = {
  optimization: {
    nodeEnv: false, // @link https://github.com/webpack/webpack/issues/7470#issuecomment-394259698
  },
  resolve: {
    alias: {
      axios: require.resolve('axios'),
      debug: require.resolve('debug'),
      require_optional: require.resolve('./mocks/require-optional.mock.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
    ],
  },
};
