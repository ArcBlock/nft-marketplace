module.exports = {
  optimization: { minimize: process.env.NODE_ENV === 'production' },
  resolve: {
    alias: {
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
