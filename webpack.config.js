const path = require("path");
const webpack = require("webpack");

module.exports = {
	entry: {
		app: "./app/app.js",
		testurl: "./examples/testurl/main.js",
		NativeList: "./examples/NativeList/main.js",
		DataController: "./examples/DataController/main.js",
		DataSearch: "./examples/DataSearch/main.js",
		DatePicker: "./examples/DatePicker/main.js",
		DateRange: "./examples/DateRange/main.js",
		SingleDataList: "./examples/SingleDataList/main.js",
		MultiDataList: "./examples/MultiDataList/main.js",
		MultiDropdownList: "./examples/MultiDropdownList/main.js",
		MultiDropdownRange: "./examples/MultiDropdownRange/main.js",
		MultiRange: "./examples/MultiRange/main.js",
		RangeSlider: "./examples/RangeSlider/main.js",
		SingleDropdownList: "./examples/SingleDropdownList/main.js",
		SingleDropdownRange: "./examples/SingleDropdownRange/main.js",
		SingleRange: "./examples/SingleRange/main.js",
		NumberBox: "./examples/NumberBox/main.js",
		TextField: "./examples/TextField/main.js",
		ToggleButton: "./examples/ToggleButton/main.js"
	},
	output: {
		path: path.join(__dirname, "dist"),
		filename: "[name].bundle.js",
		publicPath: "/dist/"
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				use: "babel-loader",
				include: [
					path.resolve(__dirname, "app"),
					path.resolve(__dirname, "examples")
				],
				exclude: /node_modules/
			},
			{
				test: /node_modules\/JSONStream\/index\.js$/,
				use: ["shebang-loader", "babel-loader"]
			}
		]
	},
	externals: ["ws"]
};
