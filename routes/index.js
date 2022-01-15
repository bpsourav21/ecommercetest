const router = require("express").Router();

// auth routes
router.use("/", require("./auth"));
// product routes
router.use("/", require("./product"));
// order routes
router.use("/", require("./order"));
// swagger docs route
router.use("/swagger", require("./swagger"));

// Other than these show not found
router.use("*", (req, res) => {
  res.status(404).send("Not found");
});

module.exports = router;
