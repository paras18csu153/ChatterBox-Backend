var jwt = require("jsonwebtoken");

function tokenValidator(tokenName, secret) {
  // Verify JWT token
  var validatedToken = jwt.verify(tokenName, secret, function (err, decoded) {
    if (err) {
      return null;
    }
    return decoded.username;
  });

  return validatedToken;
}

module.exports = tokenValidator;
