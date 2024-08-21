const { PORT = 3001 } = process.env;
const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connect to MongoDB");
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
