const Group = require("../models/group.model");
const User = require("../models/user.model");

exports.createGroup = async (req, res) => {
  // Convert request data to group
  var group = req.body;

  // Data Validation
  if (!group.groupName) {
    return res.status(400).send({ message: "Group Name cannot be empty!!" });
  }

  if (!group.users) {
    return res.status(400).send({ message: "Users cannot be empty!!" });
  }

  if (group.users.indexOf(group.username) != -1) {
    return res
      .status(400)
      .send({ message: "You cannot add yourself to a Group!!" });
  }

  if (group.admins) {
    return res.status(400).send({ message: "You cannot add admins!!" });
  }

  group.users.push(group.username);

  group.admins = [];
  group.admins.push(group.username);

  var usersLength = group.users.length;
  if (usersLength < 2) {
    return res
      .status(400)
      .send({ message: "Group cannot be created for less than two users!!" });
  }

  // Check if users sent exists or not
  for (var i = 0; i < usersLength; i++) {
    try {
      var user = await User.getByUsernameEmail(group.users[i], "");
    } catch (err) {
      return res.status(500).send({
        message: "Internal Server Error!!",
      });
    }

    if (!user) {
      return res.status(409).send({
        message: "Users are invalid!!",
      });
    }
  }

  // Create Group
  group = new Group(group);
  try {
    group = await Group.create(group);
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  // Return Groups if successfully created
  return res.status(200).send(group);
};

exports.updateUser = async (req, res) => {
  // Convert request data to group
  var group = req.body;

  // Data Validation
  if (!group.users) {
    return res.status(400).send({ message: "Users cannot be empty!!" });
  }

  if (group.users.indexOf(group.username) != -1) {
    return res
      .status(400)
      .send({ message: "You cannot add yourself to a Group!!" });
  }

  if (!group.id) {
    return res.status(400).send({ message: "Group ID cannot be empty!!" });
  }

  if (group.users.indexOf(group.username) == -1) {
    group.users.push(group.username);
  }

  var usersLength = group.users.length;
  if (usersLength < 2) {
    return res
      .status(400)
      .send({ message: "Group cannot be created for less than two users!!" });
  }

  // Check if users sent exists or not
  for (var i = 0; i < usersLength; i++) {
    try {
      var user = await User.getByUsernameEmail(group.users[i], "");
    } catch (err) {
      return res.status(500).send({
        message: "Internal Server Error!!",
      });
    }

    if (!user) {
      return res.status(409).send({
        message: "Users are invalid!!",
      });
    }
  }

  // Check if group doesn't exist with id provided
  try {
    var existingGroup = await Group.getById(group.id);
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  // Group doesn't exist
  if (!existingGroup) {
    return res.status(404).send({
      message: "Group doesn't exist!!",
    });
  }

  var admins = existingGroup.admins;

  if (admins.indexOf(group.username) == -1) {
    return res.status(404).send({
      message: "You cannot update group users!!",
    });
  }

  // Update Users of Group
  try {
    existingGroup = await Group.updateUsersById(group.id, group.users);
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  // Return Groups if successfully created
  return res.status(200).send(existingGroup);
};

exports.exitGroup = async (req, res) => {
  var group = req.body;

  // Data Validation
  if (!group.id) {
    return res.status(400).send({ message: "Group ID cannot be empty!!" });
  }

  if (!group.username) {
    return res.status(400).send({ message: "Username cannot be empty!!" });
  }

  // Check if group doesn't exist with id provided
  try {
    var existingGroup = await Group.getById(group.id);
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  // Group doesn't exist
  if (!existingGroup) {
    return res.status(404).send({
      message: "Group doesn't exist!!",
    });
  }

  // Check User in the group
  var userIndex = existingGroup.users.indexOf(group.username);
  if (userIndex == -1) {
    return res.status(404).send({
      message: "You aren't a part of this group!!",
    });
  }

  existingGroup.users.splice(userIndex, 1);

  if (existingGroup.users.length > 0) {
    // Update Users of Group
    try {
      existingGroup = await Group.updateUsersById(
        group.id,
        existingGroup.users
      );
    } catch (err) {
      return res.status(500).send({
        message: "Internal Server Error!!",
      });
    }
  } else {
    // Delete Group
    try {
      existingGroup = await Group.deleteGroupById(group.id);
    } catch (err) {
      return res.status(500).send({
        message: "Internal Server Error!!",
      });
    }
  }

  // Return Groups if successfully created
  return res.status(200).send(existingGroup);
};
