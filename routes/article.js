const router = require("express").Router();
const {
  getArticles,
  saveArticle,
  unsaveArticle,
} = require("../controllers/article");
const { validateId } = require("../middlewares/validation");
const { auth } = require("../middlewares/auth");

router.get("/", getArticles);

router.use(auth);

router.post("/", saveArticle);

router.delete("/:articleId", validateId, unsaveArticle);

module.exports = router;
