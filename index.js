const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/file");

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/file_sharing")
  .then(() => console.log("Database connection established"))
  .catch((e) => console.log("Error occured", e));

app.use(routes);

app.listen(5000, () => console.log("Server is up and runnning"));
