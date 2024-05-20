const { readFileSync, writeFileSync } = require("fs");

const express = require("express");

const ApiRouter = express.Router();
const bodyParser = require("body-parser");
ApiRouter.use(bodyParser.json({ limit: "10mb" }));
ApiRouter.use(computerListCheck);

ApiRouter.get("/computerlist", (_req, res) => {
  const computerList = JSON.parse(readFileSync("computers.json"));
  res.json(computerList);
});

ApiRouter.post("/computerlist", (req, res) => {
  writeFileSync("computers.json", JSON.stringify(req.body));
  res.json(req.body);
});

function computerListCheck(_req, _res, next) {
  try {
    readFileSync("computers.json");
  } catch (err) {
    writeFileSync("computers.json", JSON.stringify([]));
  }
  next();
}

module.exports = ApiRouter;
