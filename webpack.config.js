var path = require('path');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var webpack = require('webpack');
var env = process.env.NODE_ENV;

var dev_config = {
	entry: {
		app: './app/app.js',
		testurl: './examples/testurl/main.js',
		NativeList: './examples/NativeList/main.js',
		DataController: './examples/DataController/main.js',
		DataSearch: './examples/DataSearch/main.js',
		DatePicker: './examples/DatePicker/main.js',
		DateRange: './examples/DateRange/main.js',
		SingleDataList: './examples/SingleDataList/main.js',
		MultiDataList: './examples/MultiDataList/main.js',
		MultiDropdownList: './examples/MultiDropdownList/main.js',
		MultiDropdownRange: './examples/MultiDropdownRange/main.js',
		MultiRange: './examples/MultiRange/main.js',
		RangeSlider: './examples/RangeSlider/main.js',
		SingleDropdownList: './examples/SingleDropdownList/main.js',
		SingleDropdownRange: './examples/SingleDropdownRange/main.js',
		SingleRange: './examples/SingleRange/main.js',
		NumberBox: './examples/NumberBox/main.js',
		TextField: './examples/TextField/main.js',
		ToggleButton: './examples/ToggleButton/main.js'
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

var main_config = {
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


let config = dev_config;

if (env === "production") {
	config = main_config;
}

module.exports = config;
