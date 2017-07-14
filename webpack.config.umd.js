const path = require("path");
const webpack = require("webpack");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const BabiliPlugin = require("babili-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
	cache: true,
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
				use: "babel-loader",
				exclude: /node_modules/
			},
			{
				test: /node_modules\/JSONStream\/index\.js$/,
				use: ["shebang-loader", "babel-loader"]
			}
		]
	},
	resolve: {
		alias: {
			react: path.resolve(__dirname, "./node_modules/react"),
			"react-dom": path.resolve(__dirname, "./node_modules/react-dom")
		},
	},
	externals: [
		{
			react: {
				root: "React",
				commonjs2: "react",
				commonjs: "react",
				amd: "react",
			},
			"react-dom": {
				root: "ReactDOM",
				commonjs2: "react-dom",
				commonjs: "react-dom",
				amd: "react-dom",
			}
		},
		"ws"
	],
	plugins: [
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": "production",
		}),
		new LodashModuleReplacementPlugin({
			collections: true,
			shorthands: true,
			paths: true
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
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
		new BabiliPlugin(),
		new BrotliPlugin({
			asset: "[path].br[query]",
			test: /\.(js|css)$/,
			mode: 0,
			quality: 11
		}),
		new CompressionPlugin({
			asset: "[path].gzip[query]",
			algorithm: "zopfli",
			test: /\.(js|css)$/
		})
	]
};
