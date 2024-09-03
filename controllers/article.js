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
  const owner = req.user._id;
  console.log(req.body);

  Article.create({ author, title, keyword, imageUrl, date, text, owner })
    .then((article) => res.send(article))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(
          new BadRequestError("Invalid Data. Failed to save article")
        );
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Article not found or is incomplete"));
      }
      next(err);
    });
};

module.exports.unsaveArticle = (req, res, next) => {
  const { articleId } = req.params;
  const userId = req.user._id;
  Article.findById({ articleId })
    .select("+owner")
    .orFail(() => new NotFoundError("Article not found"))
    .then((article) => {
      if (userId !== article.owner.toString()) {
        return next(
          new ForbiddenError("You are not the owner of this article")
        );
      }
      return Article.findByIdAndRemove({ articleId })
        .orFail(() => new NotFoundError("Article not found"))
        .then((article) => {
          res.send({ message: `Article removed ${article}` });
        })
        .catch((err) => {
          console.error(err);
          next(err);
        });
    });
};

// .catch((err) => {
//   console.error(err);
//   if (err.name === "DocumentNotFoundError") {
//     return next(new NotFoundError("article not found"));
//   }
//   if (err.name === "CastError") {
//     return next(
//       new BadRequestError("Invalid Data. Failed to dislike article")
//     );
//   }
//   return next(err);
// });
