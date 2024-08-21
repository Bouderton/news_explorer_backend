const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const {JWT_SECRET} = require
const User = require("../models/user");

const NotFoundError = require("../utils/errors");
const BadRequestError = require("../utils/errors");
const ConflictError = require("../utils/errors");
const UnauthorizedError = require("../utils/errors");

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { username, email, password } = req.body;

  // Hashing the Password and Creating User Email
  User.findOne({ email }).then((user) => {
    if (user) {
      return next(new ConflictError("User already exists"));
    }
    return bcrypt
      .hash(password, 10)
      .then((hash) => {
        User.create({
          email,
          password: hash,
          username,
        })
          .then(() => res.status(200).send({ email, username }))
          .catch((err) => {
            console.error(err);
            if (err.name === "ValidationError") {
              return next(new BadRequestError("Invalid Data"));
            }
            return next(err);
          });
      })
      .catch((err) => {
        console.error(err);
        return next(err);
      });
  });
};
