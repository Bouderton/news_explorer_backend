const router = require("express").Router();
const { createUser, getCurrentUser } = require("../controllers/user");
const { NotFoundError } = require("../utils/errors/NotFoundError");

router.post("/signup", createUser);

router.get("/users/me", getCurrentUser);

router.use((req, res, next) => next(new NotFoundError("Route not found")));

module.exports = router;
