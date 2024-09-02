const router = require("express").Router();
const {
  getArticles,
  saveArticle,
  unsaveArticle,
} = require("../controllers/article");
const { validateArticle, validateId } = require("../middlewares/validation");
const { auth } = require("../middlewares/auth");

router.get("/", validateArticle, getArticles);

router.use(auth);

router.post("/:articleId", validateId, saveArticle);

router.delete("/:articleId", validateId, unsaveArticle);

module.exports = router;
