const path = require("path");
const webpack = require("webpack");
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
	entry: "./app/app.js",
	output: {
		path: path.resolve(__dirname, "umd"),
		filename: "reactivebase.js",
		library: "ReactiveBase",
		libraryTarget: "umd"
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				include: [
					path.resolve(__dirname, "app")
				],
				exclude: /node_modules/,
				loader: "babel-loader"
			},
			{
				test: /node_modules\/JSONStream\/index\.js$/,
				loaders: ["shebang-loader"]
			},
		],
		noParse: /ws/
	},
	externals: {
		"react-dom": "react-dom"
	},
	plugins: [
		new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				conditionals: true,
				unused: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				evaluate: true,
				join_vars: true,
				if_return: true
			},
			output: {
				comments: false
			}
		}),
		new LodashModuleReplacementPlugin({
			collections: true,
			shorthands: true,
			paths: true
		}),
		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.(js|html)$/,
			threshold: 10240,
			minRatio: 0.8
		})
	]
}
