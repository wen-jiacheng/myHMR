const path = require("path");
const glob = require("glob");

const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// 速度分析
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// 体积分析
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const smp = new SpeedMeasurePlugin();

const setMap = () => {
  const entry = {};
  const HtmlWebpackPlugins: any[] = [];
  const entryFiles = glob.sync(path.join(__dirname, "./src/*"));

  entryFiles.forEach((item) => {
    const fileName = item.split("/").pop();

    entry[fileName] = item;

    HtmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "./template/index.ejs"),
        filename: `${fileName}.html`,
        chunks: [fileName],
      })
    );
  });

  return { entry, HtmlWebpackPlugins };
};

const { entry, HtmlWebpackPlugins } = setMap();

module.exports = smp.wrap({
  mode: "development",

  devtool: "inline-source-map",

  entry,

  devServer: {
    static: "./dist",
    port: 8001,
  },

  output: {
    filename: "[name].[contenthash:8].js",
    path: path.join(__dirname, "./dist"),
  },

  context: path.resolve(__dirname, "./dist"),

  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },

  cache: {
    type: "filesystem",
  },

  module: {
    rules: [
      {
        test: /\.ts|tsx$/,
        use: ["babel-loader", "ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: "[local]_[hash:base64:5]",
            },
          },
          "less-loader",
        ],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    ...HtmlWebpackPlugins,
  ],
});
