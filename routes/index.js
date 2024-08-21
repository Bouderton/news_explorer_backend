const router = require("express").Router();
const { createUser } = require("../controllers/user");

router.post("/signup", createUser);

// router.get("/user".getCurrentUser);

module.exports = router;
