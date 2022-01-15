const { check, param } = require("express-validator");
const { validationHandler } = require("./validationHandler");
const mongoose = require("mongoose");
const ProductModel = require("../../models/product");

const validateOrder = [
  check("Name")
    .exists()
    .withMessage("Name missing")
    .not()
    .isEmpty()
    .withMessage("Empty"),
  check("Email")
    .exists()
    .withMessage("Email missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isEmail()
    .withMessage("Email is not valid")
    .normalizeEmail()
    .toLowerCase(),
  // .custom((value) => {
  //   return UserModel.findOne({ Email: value }).then((user) => {
  //     if (user) {
  //       return Promise.reject("E-mail already in use");
  //     }
  //   });
  // }),
  check("Phone")
    .exists()
    .withMessage("Phone number missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isMobilePhone("bn-BD")
    .withMessage("Not valid phone number"),
  check("ProductList.*.ProductId")
    .exists()
    .withMessage("ProductId missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .custom(async (id) => {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error("ProductId is not valid");
      }
      return true;
    }),
  check("ProductList.*.Quantity")
    .exists()
    .withMessage("Quantity missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isNumeric()
    .withMessage("Quantity should be number value"),
  check("ProductList.*.TotalPrice")
    .exists()
    .withMessage("Total Price missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isNumeric()
    .withMessage("Total Price should be number value"),
  check("ProductList.*.Size")
    .exists()
    .withMessage("Size missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isIn(["s", "m", "xl", "xx"]),
  (req, res, next) => {
    return validationHandler(req, res, next);
  },
];

const validateOrderId = [
  param("orderId")
    .exists()
    .withMessage("Missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isAlphanumeric()
    .withMessage("No special character allowed"),
  (req, res, next) => {
    validationHandler(req, res, next);
  },
];

const validateClientsId = [
  param("clientsId")
    .exists()
    .withMessage("Missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isAlphanumeric()
    .withMessage("No special character allowed"),
  (req, res, next) => {
    validationHandler(req, res, next);
  },
];

module.exports = {
  validateOrder,
  validateOrderId,
  validateClientsId
};
