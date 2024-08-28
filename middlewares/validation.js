const { Joi, celebrate } = require("celebrate");

// Validating a URL
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// Validating New User
module.exports.validateNewUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field is required',
    }),
    password: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "password" field is 2',
      "string.max": 'The maximum length of the "password" field is 30',
      "string.empty": 'The "password" field must be filled in',
    }),
    username: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
  }),
});

// Returning user
module.exports.validateReturningUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field is required',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field is required',
    }),
  }),
});

// ID Validation
module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

// Edit Profile Validation

module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    username: Joi.string().optional().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
  }),
});

// Validate Article

module.exports.validateArticle = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(5).max(50).messages({
      "string.min": 'The minimum length of the "title" field is 5',
      "string.max": 'The maximum length of the "title" field is 50',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    desciption: Joi.string().required().max(200).messages({
      "string.empty": "This article has no description",
    }),
  }),
});
