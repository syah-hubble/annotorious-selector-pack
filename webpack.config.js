const path = require('path');
const fs = require('fs');

const APP_DIR = fs.realpathSync(process.cwd());

const resolveAppPath = relativePath => path.resolve(APP_DIR, relativePath);

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: resolveAppPath('src'),
  output: {
    filename: 'annotorious-selector-pack.js',
    library: ['Annotorious', 'SelectorPack'],
    libraryTarget: 'umd',
    libraryExport: 'default',
    pathinfo: true
  },
  performance: {
    hints: false
  },
  devtool: 'source-map',
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: ['.js' ]
  },
  module: {
    rules: [
      { 
        test: /\.js$/, 
        use: { 
          loader: 'babel-loader' ,
          options: {
            "presets": [
              "@babel/preset-env"
            ],
            "plugins": [
              [
                "@babel/plugin-proposal-class-properties"
              ]
            ]
          }
        }
      },
      { test: /\.scss$/, use: [ 'style-loader', 'css-loader', 'sass-loader' ] }
    ]
  },  
  devServer: {
    compress: true,
    hot: true,
    host: process.env.HOST || 'localhost',
    port: 4000,
    static: [{
      directory: resolveAppPath('public'),
      publicPath: '/'
    },{
      directory: resolveAppPath('../../public'),
      publicPath: '/'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin ({
      template: resolveAppPath('public/index.html')
    })
  ]
}