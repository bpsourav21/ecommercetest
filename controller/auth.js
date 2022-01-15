const UserModel = require("../models/user");
const utils = require("../lib/utils");

const registration = (req, res, next) => {
  const { name, email, phone, occupation } = req.body;
  const newUser = new UserModel({
    Name: name,
    Email: email,
    Phone: phone,
    Occupation: occupation,
  });

  try {
    newUser.save().then((user) => {
      const tokenObject = utils.issueJWT(user, "30d");
      res.status(200).json({
        success: true,
        user: user,
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
};

const setPassword = async (req, res, next) => {
  const { password } = req.body;
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(401).json({
      success: false,
      msg: "A token is required for setting password",
    });
  } else {
    try {
      const decoded = await utils.verifyJWT(token);
      UserModel.findOne({ _id: decoded.sub }).then((user) => {
        if (!user) {
          return res
            .status(401)
            .json({ success: false, msg: "Could not find user" });
        }
        user.Password = password;
        user.save((err, result) => {
          if (err) {
            res.status(500).json({ success: false, msg: err });
          }
          res.status(200).json({ success: true, result });
        });
      });
    } catch (err) {
      res.status(401).json({ success: false, msg: "Token in not valid" });
    }
  }
};

const login = (req, res, next) => {
  UserModel.findOne({ Email: req.body.username })
    .then(async (user) => {
      if (!user) {
        return res
          .status(401)
          .json({ success: false, msg: "could not find user" });
      }

      var isValid = await checkPassword(req.body.password, user);
      if (isValid) {
        const tokenObject = utils.issueJWT(user);
        const refreshTokenObject = utils.issueJWT(user, "1y");
        res.cookie("authToken", tokenObject.token, { maxAge: 90 * 60 * 1000 });
        res.status(200).json({
          success: true,
          accessToken: tokenObject.token,
          refreshToken: refreshTokenObject.token,
        });
      } else {
        res
          .status(401)
          .json({ success: false, msg: "you entered the wrong password" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const logout = (req, res, next) => {
  req.logout();
  res.cookie("authToken", "", { maxAge: 0 });
  res.status(200).json({
    success: true,
  });
};

const checkPassword = (password = "", user = {}) => {
  return user.comparePassword(password);
};

module.exports = {
  registration,
  login,
  setPassword,
  logout,
};
