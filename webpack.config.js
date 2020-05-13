const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const base = {
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/typescript', '@babel/react'],
            plugins: [['import', { libraryName: 'antd' }], '@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.png$/i,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve('src'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
  },
  optimization: {
    usedExports: true,
  },
};

const development = {
  mode: 'development',
  entry: path.resolve('example/index.jsx'),
  devtool: 'sourcemap',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: path.resolve('example/index.html') })],
  devServer: {
    open: true,
    hot: true,
  },
};

const production = {
  mode: 'production',
  entry: {
    index: path.resolve('src/index.tsx'),
  },
  output: {
    libraryTarget: 'commonjs2',
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: __dirname,
            },
          },
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};

module.exports = ({ production: isProduction }) => {
  if (isProduction) return merge(base, production);
  return merge(base, development);
};
