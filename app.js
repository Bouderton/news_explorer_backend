require("dotenv").config();
const { PORT = 3001 } = process.env;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const { limiter } = require("./utils/rate-limit-config");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorhandler");

const app = express();

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://localhost:27017/news_explorer")
  .then(() => {
    console.log("Connect to MongoDB");
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
