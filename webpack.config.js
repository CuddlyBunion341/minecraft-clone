const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	mode: "production",
	entry: "./src/main.js",
	output: {
		path: path.resolve(__dirname, "public"),
		filename: "bundle.js",
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin({ extractComments: false })],
	},
	devServer: {
		compress: true,
		port: 9000,
		hot: true,
	},
};