const path = require("path");
const { transpile } = require("typescript");

module.exports = {
  mode: "production",
  entry: {
    common: path.resolve(__dirname, "./src/common.ts"),
    dashboard: path.resolve(__dirname, "./src/dashboard.ts"),
    form: path.resolve(__dirname, "./src/form.ts"),
    homepage: path.resolve(__dirname, "./src/homepage.ts"),
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: [
            {
                loader: "ts-loader",
                options: {
                    transpileOnly: true,
                }
            }
        ],
      },
    ],
  },
  resolve: {
    extensions: [ ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "public", "static", "bundle"),
  },
};
