const mongoose = require("mongoose");
const validator = require("validator");

const articleSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    maxLength: 30,
  },
  title: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  description: {
    type: String,
    required: true,
    maxLength: 200,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Article", articleSchema);
