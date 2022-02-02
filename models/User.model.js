const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  blocklist: { type: Array },
});

var User = (module.exports = mongoose.model("User", userSchema));

// Create user
module.exports.create = async (user) => {
  user = await user.save();
  return user;
};

// Check if user already exists with same username or email
module.exports.getByUsernameEmail = async (username, email) => {
  var existingUser = await User.findOne({
    $or: [
      {
        username: username,
      },
      {
        email: email,
      },
    ],
  });
  return existingUser;
};

// Update User Verification
module.exports.updateVerification = async (email) => {
  var existingUser = await User.findOneAndUpdate(
    { email: email },
    { $set: { verified: true } },
    { new: true }
  );
  return existingUser;
};

// Change Password
module.exports.changePassword = async (email, password) => {
  var existingUser = await User.findOneAndUpdate(
    { email: email },
    { $set: { password: password } }
  );
  return existingUser;
};

// Update User's Blocklist
module.exports.updateBlocklistById = async (id, blocklist) => {
  var existingUser = await User.findByIdAndUpdate(
    id,
    { $set: { blocklist: blocklist } },
    { new: true }
  );
  return existingUser;
};
