import path from "path";
import config from "./webpack.config";

import HtmlWebpackPlugin from "html-webpack-plugin";

const createConfig = (entryPath) => {
  const entry = path.join(__dirname, `../src/${entryPath}`);
  const HtmlWebpackPlugins = new HtmlWebpackPlugin({
    template: path.join(__dirname, "../template/index.ejs"),
    filename: `${entryPath}.html`,
  });

  config.entry = entry;
  config.plugins.push(HtmlWebpackPlugins);

  return config;
};

export default createConfig;
