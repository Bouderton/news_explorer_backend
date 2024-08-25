const router = require("express").Router();
const { createUser, getCurrentUser, login } = require("../controllers/user");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const userRouter = require("./user");
const { auth } = require("../middlewares/auth");

router.post("/signup", createUser);

router.post("/signin", login);

router.use(auth);

router.use("/users", userRouter);

router.use((req, res, next) => next(new NotFoundError("Route not found")));

module.exports = router;
