const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "http://localhost:3000/",
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      filename: "remoteEntry.js",
      exposes: {
        "./CartContext": "./src/shared/CartContext",
        "./types": "./src/shared/types",
      },
      remotes: {
        header: "header@http://localhost:3001/remoteEntry.js",
        footer: "footer@http://localhost:3002/remoteEntry.js",
        cards: "cards@http://localhost:3003/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.2.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.2.0" },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
};
