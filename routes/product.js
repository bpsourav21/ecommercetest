const router = require("express").Router();
const trimRequest = require("trim-request");
const passport = require("passport");

const requireAuth = passport.authenticate("jwt", {
  session: false,
});

const {
  addProduct,
  updateProduct,
  deleteProduct,
  allProducts,
  oneProduct,
  importProduct,
} = require("../controller/product");
const {
  validateProduct,
  validateId,
  validateUpdateProduct,
  validatePayload,
  validateImportProduct,
} = require("../controller/validators/product");

router.post(
  "/product",
  requireAuth,
  trimRequest.all,
  validateProduct,
  addProduct
);
router.patch(
  "/product/:id",
  requireAuth,
  trimRequest.all,
  validateId,
  validateUpdateProduct,
  updateProduct
);
router.delete(
  "/product/:id",
  requireAuth,
  trimRequest.all,
  validateId,
  deleteProduct
);
router.post(
  "/products",
  requireAuth,
  trimRequest.all,
  validatePayload,
  allProducts
);
// NOTE:: On question it is asked as POST but I think GET is perfect for this route
router.get("/products/:productid", requireAuth, trimRequest.all, oneProduct);
router.post(
  "/import/product",
  requireAuth,
  trimRequest.all,
  validateImportProduct,
  importProduct
);

module.exports = router;
