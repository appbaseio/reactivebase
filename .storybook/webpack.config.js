module.exports = {
	module: {
		loaders: [
			{
				test: /node_modules\/JSONStream\/index\.js$/,
				loaders: ['shebang-loader', 'babel-loader']
			},
			{
				test: /\.md$/,
				loader: "raw"
			},
			{
				test: /\.css$/,
				loaders: ["style-loader", "css-loader"]
			},
			{
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
				loader : 'file-loader'
			}
		],
		noParse: ['ws']
	},
	externals: ['ws']
}
