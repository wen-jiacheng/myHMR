import webpack from "webpack";

// import config from "../webpack.config.ts";
import config from "../webpackConfigTS";

const webpackBuild = () => {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.hasErrors()) {
        reject(stats.toJson().errors.join("\n"));
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
