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

  try {
    await webpackBuild();
  } catch (err) {
    console.log("--- webpack build error ---");
    console.log(err);
  }

  try {
    const filePath = path.join(__dirname, `./dist/${fileName}`);
    const haveFile = fs.existsSync(filePath);

    console.log("haveFile", haveFile);
    console.log(filePath);

    if (haveFile) {
      const content = fs.readFileSync(filePath);
      res.status(200).type("html").send(content);
    } else {
      res.status(400).send("no search file");
    }
  } catch (err) {
    console.log("--- read file error ---");
    console.log(err);
  }
});

app.listen(8001, () => {
  console.log(`服务启动在${PORT}`);
});
