var path = require('path');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var webpack = require('webpack');
var env = process.env.NODE_ENV;

// for lib build
var lib_config = {
	entry: {
		app: './app/app.js'
	},
	output: {
		path: path.join(__dirname, "dist"),
		publicPath: "/dist/",
		filename: '[name].bundle.js'
	},
	module: {
		loaders: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['es2015','stage-0', 'react']
				}
			},
			{
				test: /node_modules\/JSONStream\/index\.js$/,
				loaders: ['shebang', 'babel']
			}
		],
		noParse: ['ws']
	},
	externals: ['ws']
};

module.exports = lib_config;