const Article = require("../models/article");

const NotFoundError = require("../utils/errors/NotFoundError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");

// get all articles from db
module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.status(200).send(articles))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

module.exports.saveArticle = (req, res, next) => {
  const { author, title, imageUrl, description } = req.body;
  Article.create({
    author,
    title,
    imageUrl,
    description,
    owner: req.user._id,
  })
    .then((article) => res.status(200).send(`Article Saved ${article}`))
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid Data"));
      }
      next(err);
    });
};

module.exports.unsaveArticle = (req, res, next) => {
  Article.findByIdAndRemove({})
    .then((res) => {
      res.status(200).send("Article Deleted");
    })
    .catch((err) => {
      console.err(err);
      if (err.name === "ValidationError") {
        return next(new BadRequest("Invalid Data"));
      }
    });
};
