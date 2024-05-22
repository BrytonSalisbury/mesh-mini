const { readFileSync, writeFileSync } = require("fs");

const express = require("express");

const ApiRouter = express.Router();
const bodyParser = require("body-parser");
ApiRouter.use(bodyParser.json({ limit: "10mb" }));
ApiRouter.use(computerListCheck);

const computerPath = process.env.COMPUTER_PATH
  ? process.env.COMPUTER_PATH
  : "./computers.json";

ApiRouter.get("/computerlist", (_req, res) => {
  const computerList = JSON.parse(readFileSync(computerPath));
  res.json(computerList);
});

ApiRouter.post("/computerlist", (req, res) => {
  writeFileSync(computerPath, JSON.stringify(req.body));
  res.json(req.body);
});

function computerListCheck(_req, _res, next) {
  try {
    readFileSync(computerPath);
  } catch (err) {
    writeFileSync(computerPath, JSON.stringify([]));
  }
  next();
}

module.exports = ApiRouter;
