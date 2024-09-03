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
  console.log(req.params._id);
  Article.findByIdAndUpdate(
    req.params.articleId,
    { $addToSet: { saved: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((article) => res.send(article))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Article not found"));
      }
      if (err.name === "CastError") {
        return next(
          new BadRequestError("Invalid Data. Failed to save article")
        );
      }
      return next(err);
    });
};

module.exports.unsaveArticle = (req, res, next) => {
  Article.findByIdAndUpdate(
    req.params.articleId,
    { $pull: { saved: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((article) => res.send({ message: "Article Unsaved", article }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("article not found"));
      }
      if (err.name === "CastError") {
        return next(
          new BadRequestError("Invalid Data. Failed to dislike article")
        );
      }
      return next(err);
    });
};
