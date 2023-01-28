import path from "path";
import glob from "glob";

import { CleanWebpackPlugin } from "clean-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

// 速度分析
import SpeedMeasurePlugin from "speed-measure-webpack-plugin";
// 体积分析
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const smp = new SpeedMeasurePlugin();

const config = {
  mode: "development",

  devtool: "inline-source-map",

  output: {
    filename: "[name].[contenthash:8].js",
    path: path.join(__dirname, "../dist"),
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
  ],
};

export default smp.wrap(config);
