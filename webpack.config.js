const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/js/uppy.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'uppyBundle.js',
  },
  plugins: [new webpack.ProgressPlugin()],

  module: {
    rules: [
      {
        test: /.css$/,
        // I had to remove the entry for MiniCSSLoader because it was failing when it was being used
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',

            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },

  optimization: {
    minimizer: [new TerserPlugin()],

    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
        },
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: true,
    },
  },
};
