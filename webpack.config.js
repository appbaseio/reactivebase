var path = require('path');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var webpack = require('webpack');
var env = process.env.NODE_ENV;
var CHOOSE_CONFIG = process.env.CHOOSE_CONFIG;

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
		preLoaders: [
				{ test: /\.json$/, exclude: /node_modules/, loader: 'json'},
		],
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
		]
	},
};

// for examples build
var examples_config = {
	entry: {
		main: './main.js',
		meetupblast: './examples/meetupblast/main.js',
		now: './examples/now/main.js',
		heatmap: './examples/heatmap/main.js',
		transport: './examples/transport/main.js',
		earthquake: './examples/earthquake/main.js',
		weather: './examples/weather/main.js',
		list: './examples/list/main.js',
		nearby: './examples/nearby/main.js',
		events: './examples/events/main.js',
		CustomQuery: './examples/CustomQuery/main.js',
		direction: './examples/direction/main.js'
	},
	output: {
		path: path.join(__dirname, "dist"),
		publicPath: "/dist/",
		filename: '[name].bundle.js'
	},
	module: {
		preLoaders: [
				{ test: /\.json$/, exclude: /node_modules/, loader: 'json'},
		],
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
		]
	},
};

var final_config;
switch(CHOOSE_CONFIG) {
	case 'LIB':
		final_config = lib_config;
	break;
	case 'EXAMPLES':
	default:
		final_config = examples_config;
	break;
}
module.exports = final_config;
