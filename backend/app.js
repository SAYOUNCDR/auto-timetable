const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Ok server is healthy and running fine" });
});
module.exports = app;
