const router = require("express").Router();
const { getCurrentUser, editProfile } = require("../controllers/user");
const { validateUpdateUser } = require("../middlewares/validation");

router.get("/me", getCurrentUser);

router.patch("/me", validateUpdateUser, editProfile);

module.exports = router;
