const path = require("path");
const webpack = require("webpack");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
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
	resolve: {
		alias: {
			react: path.resolve(__dirname, "./node_modules/react"),
			"react-dom": path.resolve(__dirname, "./node_modules/react-dom")
		}
	},
	externals: {
		react: {
			root: "React",
			commonjs2: "react",
			commonjs: "react",
			amd: "react"
		},
		"react-dom": {
			root: "ReactDOM",
			commonjs2: "react-dom",
			commonjs: "react-dom",
			amd: "react-dom"
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify("production"),
		}),
		new LodashModuleReplacementPlugin({
			collections: true,
			shorthands: true,
			paths: true
		}),
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
		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.(js|html)$/,
			threshold: 10240,
			minRatio: 0.8
		})
	]
}
