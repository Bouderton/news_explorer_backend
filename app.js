const { PORT = 3001 } = process.env;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");

const app = express();

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/news_explorer")
  .then(() => {
    console.log("Connect to MongoDB");
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

app.use(cors());
app.use(express.json);
app.use("/", mainRouter);
app.use(errors());
