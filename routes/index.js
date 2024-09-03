const router = require("express").Router();
const { createUser, login } = require("../controllers/user");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const userRouter = require("./user");
const { auth } = require("../middlewares/auth");
const {
  validateNewUser,
  validateReturningUser,
} = require("../middlewares/validation");

const articlesRouter = require("./article");

router.post("/signup", validateNewUser, createUser);

router.post("/signin", validateReturningUser, login);

router.use("/articles", articlesRouter);

router.use(auth);

router.use("/users", userRouter);

// router.use((req, res, next) => next(new NotFoundError("Route not found")));

module.exports = router;
