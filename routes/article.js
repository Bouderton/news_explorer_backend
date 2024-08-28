const router = require("express").Router();
const {
  getArticles,
  saveArticle,
  unsaveArticle,
} = require("../controllers/article");
const { validateArticle } = require("../middlewares/validation");

router.get("/", getArticles);

router.post("/saved-articles", validateArticle, saveArticle);

router.delete("/saved-articles", unsaveArticle);

module.exports = router;
