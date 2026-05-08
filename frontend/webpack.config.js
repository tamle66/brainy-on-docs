const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const WebpackBar = require('webpackbar');
const webpack = require('webpack');
require('dotenv').config(); // Load from current dir (.env)
require('dotenv').config({ path: '../.env' }); // Fallback to root .env if needed
const {
  docsAddonDevMiddleware,
  docsAddonWebpackPlugin,
} = require('@lark-opdev/block-docs-addon-webpack-utils');

const cwd = process.cwd();
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: './src/index.tsx',
  devtool: isProduction ? false : 'inline-source-map',
  mode: isDevelopment ? 'development' : 'production',
  stats: 'errors-only',
  output: {
    path: path.resolve(__dirname, './dist'),
    clean: true,
    publicPath: isDevelopment ? '/block/' : './',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [/node_modules\/@lark-open/],
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        oneOf: [
          {
            test: /\.[jt]sx?$/,
            include: [path.join(cwd, 'src')],
            exclude: /node_modules/,
            use: [
              {
                loader: require.resolve('esbuild-loader'),
                options: {
                  loader: 'tsx',
                  target: 'es2015',
                },
              },
            ],
          },
          {
            test: /\.css$/,
            use: [
              isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
              'css-loader',
              'postcss-loader',
            ],
          },
          {
            test: /\.less$/,
            use: [
              isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
              'css-loader',
              'less-loader',
            ],
          },
          {
            test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
            type: 'asset/resource',
            generator: {
              filename: 'assets/[name][ext][query]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...(isDevelopment
      ? [new ReactRefreshWebpackPlugin() /*, new WebpackBar()*/]
      : [new MiniCssExtractPlugin()]),
    new docsAddonWebpackPlugin({
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      publicPath: isDevelopment ? '/block/' : './',
    }),
    new webpack.DefinePlugin({
      'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL || process.env.ngrokURL),
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: {
    minimize: isProduction,
    minimizer: [new ESBuildMinifyPlugin({ target: 'es2015', css: true })],
    moduleIds: 'deterministic',
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
        },
      },
    },
  },
  devServer: isProduction
    ? undefined
    : {
        headers: {
          'Access-Control-Allow-Private-Network': true
        },
        hot: true,
        client: {
          logging: 'error',
        },
        setupMiddlewares: (middlewares, devServer) => {
          if (!devServer || !devServer.app) {
            throw new Error('webpack-dev-server is not defined');
          }
          docsAddonDevMiddleware(devServer).then((middleware) => {
            devServer.app.use(middleware);
          });
          return middlewares;
        },
      },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
};
module.exports = config;
