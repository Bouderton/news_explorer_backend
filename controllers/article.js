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
  console.log(req.params);
  const { articleId } = req.params;

  Article.findById({ _id: articleId })
    .orFail()
    .then((item) => {
      // No item = No delete
      if (!item) {
        return next(new NotFoundError("Article does not exist."));
      }
      // Actually deleting the item
      return Article.findByIdAndRemove({ _id: articleId })
        .then(() =>
          res.status(200).send({ message: "Article Successfully Unsaved" })
        )
        .catch((err) => {
          console.error(err);
          next(err);
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Article does not exist"));
      }
      return next(err);
    });
};
