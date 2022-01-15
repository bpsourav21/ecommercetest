const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const pathToKeyPriv = path.join(__dirname, "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKeyPriv, "utf8");
const pathToKeyPub = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKeyPub, 'utf8');


const issueJWT = (user, expiresIn = "1d") => {
  const _id = user._id;
  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    expires: expiresIn,
    token: signedToken,
  };
};

const verifyJWT = (token) => {
  return jsonwebtoken.verify(token, PUB_KEY, { algorithm: "RS256" });
};

module.exports = {
  issueJWT,
  verifyJWT,
};
