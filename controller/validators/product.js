// const { validateResult } = require("../../../middleware/utils");
const { check, param, body } = require("express-validator");
const { validationHandler } = require("../validators/validationHandler");

const validateProduct = [
  check("Name")
    .exists()
    .withMessage("Name missing")
    .not()
    .isEmpty()
    .withMessage("Empty"),
  check("Price")
    .exists()
    .withMessage("Price missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isNumeric()
    .withMessage("Quantity should be number value"),
  check("Details")
    .exists()
    .withMessage("Details missing")
    .not()
    .isEmpty()
    .withMessage("Empty"),
  check("Quantity")
    .exists()
    .withMessage("Quantity missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isNumeric()
    .withMessage("Quantity should be number value"),
  check("Sizes")
    .exists()
    .withMessage("Sizes missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isArray()
    .isIn(["s", "m", "xl", "xx"]),
  check("SKU")
    .exists()
    .withMessage("SKU missing")
    .not()
    .isEmpty()
    .withMessage("Empty"),
  check("Product_images")
    .exists()
    .withMessage("Product_images missing")
    .not()
    .isEmpty()
    .withMessage("Empty"),
  (req, res, next) => {
    return validationHandler(req, res, next);
  },
];

const validateUpdateProduct = [
  check("Name").optional().not().isEmpty().withMessage("Empty"),
  check("Price")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isNumeric()
    .withMessage("Price should be number value"),
  check("Details").optional().not().isEmpty().withMessage("Empty"),
  check("Quantity")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isNumeric()
    .withMessage("Quantity should be number value"),
  check("Sizes")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isArray()
    .isIn(["s", "m", "xl", "xx"]),
  check("SKU").optional().not().isEmpty().withMessage("Empty"),
  check("Product_images").optional().not().isEmpty().withMessage("Empty"),
  (req, res, next) => {
    return validationHandler(req, res, next);
  },
];

const validateId = [
  param("id")
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

const validatePayload = [
  check("page").default(0).isNumeric().withMessage("Should be number"),
  check("total").default(10).isNumeric().withMessage("Should be number"),
  check("sortBy").default("Name").isString().withMessage("Should be string"),
  check("sortType")
    .isIn(["asc", "desc"])
    .default("asc")
    .isString()
    .withMessage("Should be string"),
  (req, res, next) => {
    return validationHandler(req, res, next);
  },
];

const validateImportProduct = [
  body("*.Name")
    .exists()
    .withMessage("Name missing")
    .not()
    .isEmpty()
    .withMessage("Empty"),
  body("*.Price")
    .exists()
    .withMessage("Price missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isNumeric()
    .withMessage("Quantity should be number value"),
  body("*.Details")
    .exists()
    .withMessage("Details missing")
    .not()
    .isEmpty()
    .withMessage("Empty"),
  body("*.Quantity")
    .exists()
    .withMessage("Quantity missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isNumeric()
    .withMessage("Quantity should be number value"),
  body("*.Sizes")
    .exists()
    .withMessage("Sizes missing")
    .not()
    .isEmpty()
    .withMessage("Empty")
    .isArray()
    .isIn(["s", "m", "xl", "xx"]),
  body("*.SKU")
    .exists()
    .withMessage("SKU missing")
    .not()
    .isEmpty()
    .withMessage("Empty"),
  body("*.Product_images")
    .exists()
    .withMessage("Product_images missing")
    .not()
    .isEmpty()
    .withMessage("Empty"),
  (req, res, next) => {
    return validationHandler(req, res, next);
  },
];

module.exports = {
  validateProduct,
  validateUpdateProduct,
  validateId,
  validatePayload,
  validateImportProduct,
};
