import path from "path";
import glob from "glob";

import webpack from "webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

// 速度分析
import SpeedMeasurePlugin from "speed-measure-webpack-plugin";
// 体积分析
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const smp = new SpeedMeasurePlugin();

const setMap = () => {
  const entry = {};
  const HtmlWebpackPlugins = [];
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

const config = {
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
};

export default smp.wrap(config);
