const express = require("express");
const app = express();

app.use("/api", require("./api"));

app.listen(8081, () => {
  console.log("running on port 8081");
});
