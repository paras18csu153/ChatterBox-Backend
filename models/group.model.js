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

// Get Group By ID
module.exports.getById = async (id) => {
  group = await Group.findById(id);
  return group;
};

// Update Users By ID
module.exports.updateUsersById = async (id, users) => {
  var existingGroup = await Group.findByIdAndUpdate(
    id,
    { $set: { users: users } },
    { new: true }
  );
  return existingGroup;
};

// Update Admins By ID
module.exports.updateAdminsById = async (id, admins) => {
  var existingGroup = await Group.findByIdAndUpdate(
    id,
    { $set: { admins: admins } },
    { new: true }
  );
  return existingGroup;
};

// Update Group By ID
module.exports.updateGroupById = async (id, existingGroup) => {
  existingGroup = await Group.findByIdAndUpdate(
    id,
    { $set: existingGroup },
    { new: true }
  );
  return existingGroup;
};

// Delete Group
module.exports.deleteGroupById = async (id) => {
  var existingGroup = await Group.findByIdAndDelete(id);
  return existingGroup;
};
