const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.cur$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/images/', // 输出到images文件夹
              publicPath: 'assets/images/', // 从public文件夹访问
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ],
  },
  resolve: {
    fallback: {
      fs: require.resolve('browserify-fs'),
      path: require.resolve('path-browserify'),
      util: require.resolve("util/"),
      buffer: require.resolve("buffer/"),
      stream: require.resolve("stream-browserify")
    },
    extensions: ['.js', '.jsx', '.ts', '.js'],
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['python']
    }),
    new HtmlWebpackPlugin({
        template: './public/index.html', // path to your index.html
        publicPath: '/', // the public URL of the output directory when referenced in a browser
      }),
  ],
};
