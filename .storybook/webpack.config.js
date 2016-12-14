module.exports = {
	module: {
		loaders: [
			{
				test: /node_modules\/JSONStream\/index\.js$/,
				loaders: ['shebang', 'babel']
			},
			{
				test: /\.css$/,
				loaders: ["style-loader", "css-loader"]
			},
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				loader: 'url-loader?limit=100000'
			}
		]
	}
}
