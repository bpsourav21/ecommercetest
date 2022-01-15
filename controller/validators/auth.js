const { check } = require("express-validator");
const { validationHandler } = require("../validators/validationHandler");
const UserModel = require("../../models/user");

const validateRegistration = [
  check("name")
    .exists()
    .withMessage("Name missing")
    .not()
    .isEmpty()
    .withMessage("Empty"),
  check("email")
    .exists()
    .withMessage("Email missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isEmail()
    .withMessage("Email is not valid")
    .normalizeEmail()
    .toLowerCase()
    .custom((value) => {
      return UserModel.findOne({ Email: value }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
  check("phone")
    .exists()
    .withMessage("Phone number missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isMobilePhone("bn-BD")
    .withMessage("Not valid phone number"),
  check("occupation")
    .exists()
    .withMessage("Occupation missing")
    .not()
    .isEmpty()
    .withMessage("Empty"),
  (req, res, next) => {
    return validationHandler(req, res, next);
  },
];

const validatePassword = [
  check("password")
    .exists()
    .withMessage("Password missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isLength({ min: 5 })
    .withMessage("Password too short, minimum needs 5 character"),
  check("confirm-password")
    .exists()
    .withMessage("Password missing")
    .not()
    .isEmpty()
    .custom((confirmPassword, { req }) => {
      const password = req.body.password;
      if (password !== confirmPassword) {
        throw new Error("Passwords must be same");
      }
      return true;
    }),
  (req, res, next) => {
    return validationHandler(req, res, next);
  },
];

const validateLogin = [
  check("username")
    .exists()
    .withMessage("username missing")
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage("Empty"),
  check("password")
    .exists()
    .withMessage("Password missing")
    .not()
    .isEmpty()
    .withMessage("Empty"),
  (req, res, next) => {
    return validationHandler(req, res, next);
  },
];

module.exports = {
  validateRegistration,
  validatePassword,
  validateLogin,
};
