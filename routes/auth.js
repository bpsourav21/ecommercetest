const router = require("express").Router();
const trimRequest = require("trim-request");

const {
  registration,
  setPassword,
  login,
  logout,
} = require("../controller/auth");
const {
  validateRegistration,
  validatePassword,
  validateLogin,
} = require("../controller/validators/auth");

router.post("/registration", trimRequest.all, validateRegistration, registration);
router.post("/set-password", trimRequest.all, validatePassword, setPassword);
router.post("/login", trimRequest.all, validateLogin, login);
router.post("/logout", logout);

module.exports = router;
