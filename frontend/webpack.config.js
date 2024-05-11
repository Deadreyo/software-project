const path = require("path");
const { transpile } = require("typescript");

module.exports = {
  mode: "production",
  entry: {
    common: path.resolve(__dirname, "./src/common/main.ts"),
    dashboard: path.resolve(__dirname, "./src/dashboard/main.ts"),
    form: path.resolve(__dirname, "./src/form/main.ts"),
    homepage: path.resolve(__dirname, "./src/homepage/main.ts"),
    login: path.resolve(__dirname, "./src/login/main.ts"),
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
