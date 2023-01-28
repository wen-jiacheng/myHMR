import webpack from "webpack";

import createConfig from "./createConfig";

const webpackBuild = (entryPath) => {
  const config = createConfig(entryPath);

  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        console.log("err");
        reject(err);
      } else if (stats.hasErrors()) {
        reject(stats.toJson().errors);
      } else {
        process.stdout.write(
          stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false,
          }) + "\n\n"
        );

        resolve(stats);
      }
    });
  });
};

export default webpackBuild;
