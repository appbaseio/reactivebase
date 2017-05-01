const path = require("path");
const webpack = require("webpack");
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

const config = {
	entry: "./app/app.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "app.bundle.js",
		publicPath: "/dist/",
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
				loaders: ["shebang-loader", "babel-loader"]
			},
		]
	},
	externals: {
		ws: "ws",
		jquery: "jQuery",
		lodash: "lodash",
		react: "react",
		classnames: "classnames",
		moment: "moment",
		"fbemitter": "fbemitter",
		"react-moment-proptypes": "react-moment-proptypes",
		"appbase-js": "appbase-js",
		"react-dom": "react-dom",
		"react-select": "react-select",
		"react-dates": "react-dates",
		"rc-slider": "rc-slider"
	},
	plugins: [
		new LodashModuleReplacementPlugin({
			collections: true,
			shorthands: true,
			paths: true
		})
	]
}

if (process.env.NODE_ENV === "production") {
	config.plugins = [
		new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
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
	];
}

module.exports = config;
