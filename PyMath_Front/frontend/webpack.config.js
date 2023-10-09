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
        test: /\.cur$/,   //address the cur file
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '/useradmin/assets/images/', 
              publicPath: 'assets/images/', // input page
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,  //address js or jsx file
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,  //address css file
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,   //address page file
        type: 'asset/resource',
      },
      {
        test: /.ts$/,  //address ts file
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
  // webpack.config.js
};
