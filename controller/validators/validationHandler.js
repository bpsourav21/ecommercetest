const { validationResult } = require("express-validator");

const buildErrObject = (code = "", message = "") => {
  return {
    code,
    message,
  };
};

const handleError = (res = {}, err = {}) => {
  // Prints error in console
  if (process.env.NODE_ENV === "development") {
    console.log(err);
  }
  // Sends error to user
  res.status(err.code).json({
    errors: {
      msg: err.message,
    },
  });
};
const validationHandler = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (err) {
    return handleError(res, buildErrObject(400, err.array()));
  }
};

module.exports = {
  validationHandler,
};
