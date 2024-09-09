const Article = require("../models/article");

const NotFoundError = require("../utils/errors/NotFoundError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");

// Get all articles from db
module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.status(200).send(articles))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};
// Saving/creating the article
module.exports.saveArticle = (req, res, next) => {
  const { keyword, author, title, description, date, urlToImage, url } =
    req.body;

  console.log(req.body);

  Article.create({
    author,
    title,
    keyword,
    urlToImage,
    date,
    url,
    description,
    owner: req.user._id,
  })
    .then((article) => res.status(200).send(article))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data"));
      }
      next(err);
    });
};

module.exports.unsaveArticle = (req, res, next) => {
  const { articleId } = req.params;
  const userId = req.user._id;
  // finding the article by ID
  Article.findById({ _id: articleId })
    .orFail()
    .then((article) => {
      // If article owner and current user Id don't match, forbid it
      if (!article.owner.equals(userId).toString()) {
        return next(
          new ForbiddenError("You are not the owner of this article")
        );
      }
      if (!article) {
        return next(new NotFoundError("Article Not Found"));
      }
      // Actually removing the article
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
