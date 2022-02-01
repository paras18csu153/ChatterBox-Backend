const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let groupSchema = new Schema(
  {
    groupName: { type: String, required: true },
    description: { type: String },
    users: { type: Array, required: true },
    admins: { type: Array, required: true },
  },
  { timestamps: true }
);

var Group = (module.exports = mongoose.model("Group", groupSchema));

// Create Group
module.exports.create = async (group) => {
  group = await group.save();
  return group;
};
