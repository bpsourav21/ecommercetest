const router = require("express").Router();
const trimRequest = require("trim-request");
const passport = require("passport");

const requireAuth = passport.authenticate("jwt", {
  session: false,
});

const { placeOrder, findOrder, findClient } = require("../controller/order");
const {
  validateOrder,
  validateOrderId,
  validateClientsId,
} = require("../controller/validators/order");

router.post("/order", requireAuth, trimRequest.all, validateOrder, placeOrder);
router.post(
  "/orders/:orderId",
  requireAuth,
  trimRequest.all,
  validateOrderId,
  findOrder
);
router.post(
  "/clients/:clientsId",
  requireAuth,
  trimRequest.all,
  validateClientsId,
  findClient
);

module.exports = router;
