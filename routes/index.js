const router = require("express").Router();
const { createUser, getCurrentUser } = require("../controllers/user");

router.post("/signup", createUser);

router.get("/user", getCurrentUser);

router.use((req, res, next) => next(new NotFoundError("Route not found")));

module.exports = router;
