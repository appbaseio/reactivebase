const path = require("path");
const webpack = require("webpack");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

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
	externals: ["ws"],
	plugins: [
		new LodashModuleReplacementPlugin({
			collections: true,
			shorthands: true,
			paths: true
		})
	]
}

module.exports = config;
