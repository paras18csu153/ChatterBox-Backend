const Token = require("../models/token.model");

const tokenValidator = require("../helpers/tokenValidator");

module.exports = async function (req, res, next) {
  // Get Token From Header
  var token = req.headers["authorization"];

  // Get Username from body
  var username = req.body.username;
  var paramUsername = req.params["username"];

  // Data Validation
  if (!token) {
    return res.status(403).send({ message: "Unauthorized Access!!" });
  }

  if (!username && !paramUsername) {
    return res.status(400).send({ message: "Username cannot be empty!!" });
  }

  if (paramUsername && !username) {
    username = req.params["username"];
    req.body.username = req.params["username"];
  }

  // Check if token exists or not
  try {
    var existingToken = await Token.getByToken(token);
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  if (!existingToken) {
    return res.status(403).send({ message: "Unauthorized Access!!" });
  }

  // Verify whether the token is valid and belongs to current user or not
  var secret = process.env.SECRET;
  var validatedToken = tokenValidator(token, secret);

  if (!validatedToken) {
    return res.status(403).send({ message: "Unauthorized Access!!" });
  }

  if (validatedToken != username) {
    return res.status(403).send({ message: "Unauthorized Access!!" });
  }

  // Set Token in Request
  req.token = token;
  next();
};
