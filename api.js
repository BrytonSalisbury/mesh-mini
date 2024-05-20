const { readFileSync, writeFileSync } = require("fs");

const express = require("express");

const ApiRouter = express.Router();
const bodyParser = require("body-parser");
ApiRouter.use(bodyParser.json({ limit: "10mb" }));

ApiRouter.get("/computerlist", (_req, res) => {
  const computerList = JSON.parse(readFileSync("computers.json"));
  res.json(computerList);
});

ApiRouter.post("/computerlist", (req, res) => {
  writeFileSync("computers.json", JSON.stringify(req.body));
  res.json(req.body);
});

module.exports = ApiRouter;
