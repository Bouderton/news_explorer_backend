const Article = require("../models/article");

const NotFoundError = require("../utils/errors/NotFoundError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const article = require("../models/article");

// get all articles from db
module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.status(200).send(articles))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

module.exports.saveArticle = (req, res, next) => {
  const { keyword, author, title, text, date, imageUrl } = req.body;

  console.log(req.body);

  Article.create({
    author,
    title,
    keyword,
    imageUrl,
    date,
    text,
    owner: req.user._id,
  })
    .then((article) => res.send(article))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data"));
      }
      next(err);
    });
};

module.exports.unsaveArticle = (req, res, next) => {
  console.log(req.user._id);
  const { articleId } = req.params;
  const userId = req.user._id;
  Article.findById({ _id: articleId })
    .orFail()
    .then((article) => {
      if (!article.owner.equals(userId).toString()) {
        return next(
          new ForbiddenError("You are not the owner of this article")
        );
      }
      if (!article) {
        return next(new NotFoundError("Article Not Found"));
      }
      return Article.findByIdAndRemove({ _id: articleId })
        .orFail()
        .then((article) => {
          res.send({ message: `Article removed: ${article.title}` });
        })
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
    });
};
