var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'public');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
   entry: APP_DIR + '/index.js',
	
   output: {
      path: BUILD_DIR,
      filename: 'bundle.js',
      chunkFilename: '[name].js'
   },
	
   module: {
      loaders: [
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['es2015', 'react']
            }
        },
		{
			test: /\.scss$/,
			exclude: /node_modules/,
			loader: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [ 'css-loader', 'sass-loader', 'svg-loader' ]
			})
		}
      ]
   },
    plugins: [
        new ExtractTextPlugin(APP_DIR + '/styles.css')
    ]
}

module.exports = config;