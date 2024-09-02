const router = require("express").Router();
const {
  getArticles,
  saveArticle,
  unsaveArticle,
} = require("../controllers/article");
const { validateArticle } = require("../middlewares/validation");
const { auth } = require("../middlewares/auth");

router.get("/saved-articles", getArticles);

router.use(auth);

router.post("/saved-articles", validateArticle, saveArticle);

router.delete("/saved-articles", unsaveArticle);

module.exports = router;
