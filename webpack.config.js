const path = require('path');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    library: 'alhambra',
    libraryTarget: 'umd',
    globalObject: "(typeof window !== 'undefined' ? window : this)",
  },
};
