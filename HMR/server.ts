import fs from "fs";
import path from "path";

import express from "express";

import webpackBuild from "./webpackBuild";

const app = express();

const PORT = process.env.PORT || 8001;
const __dirname = path.resolve();

app.get("*", async (req, res) => {
  let { url } = req;

  const fileName = url.split("/")[1];
  const filesWithSuffixes = fileName.split(".").length > 1;
  const filePath = filesWithSuffixes
    ? path.join(__dirname, `./dist/${fileName}`)
    : path.join(__dirname, `./dist/${fileName}.html`);

  if (!filesWithSuffixes) {
    try {
      const entryPath = url.split("/")[1];
      const pathInSrc = path.join(__dirname, `./src/${entryPath}`);
      const srcHaveFile = fs.existsSync(pathInSrc);

      if (srcHaveFile) {
        await webpackBuild(entryPath);
      } else {
        res
          .status(400)
          .type("application/json")
          .end(`src 下没有名为 ${entryPath} 的目录`);
        return;
      }
    } catch (err) {
      console.log("--- webpack build error ---");
      res.status(400).type("application/json").end(err);
    }
  }

  try {
    const haveFile = fs.existsSync(filePath);

    if (haveFile) {
      const content = fs.readFileSync(filePath);

      res.status(200).end(content);
    } else {
      res.status(400).end("no search file");
    }
  } catch (err) {
    console.log("--- read file error ---");
    console.log(err);
  }
});

app.listen(8001, () => {
  console.log(`服务启动在${PORT}`);
});
