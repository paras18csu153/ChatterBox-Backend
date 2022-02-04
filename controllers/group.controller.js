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

  group.users = group.users.filter(function (elem, pos) {
    return group.users.indexOf(elem) == pos;
  });

  group.admins = group.admins.filter(function (elem, pos) {
    return group.admins.indexOf(elem) == pos;
  });

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

  // Return Group if successfully created
  return res.status(200).send(group);
};

exports.getGroup = async (req, res) => {
  // Convert request data to group
  var id = req.params["id"];

  // Data Validation
  if (!id) {
    return res.status(400).send({ message: "Group ID cannot be empty!!" });
  }

  // Check if group doesn't exist with id provided
  try {
    var existingGroup = await Group.getById(id);
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

  // Return Group if exists
  return res.status(200).send(existingGroup);
};

exports.updateUsers = async (req, res) => {
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

  group.users = group.users.filter(function (elem, pos) {
    return group.users.indexOf(elem) == pos;
  });

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

  // Return Group if successfully updated
  return res.status(200).send(existingGroup);
};

exports.updateAdmins = async (req, res) => {
  // Convert request data to group
  var group = req.body;

  // Data Validation
  if (!group.admins) {
    return res.status(400).send({ message: "Admins cannot be empty!!" });
  }

  group.admins = group.admins.filter(function (elem, pos) {
    return group.admins.indexOf(elem) == pos;
  });

  if (group.admins.indexOf(group.username) != -1) {
    return res
      .status(400)
      .send({ message: "You cannot add yourself to a Group!!" });
  }

  if (!group.id) {
    return res.status(400).send({ message: "Group ID cannot be empty!!" });
  }

  if (group.admins.indexOf(group.username) == -1) {
    group.admins.push(group.username);
  }

  var adminsLength = group.admins.length;
  if (adminsLength == 0) {
    return res.status(400).send({ message: "Admins cannot be empty!!" });
  }

  // Check if admins sent exists or not
  for (var i = 0; i < adminsLength; i++) {
    try {
      var user = await User.getByUsernameEmail(group.admins[i], "");
    } catch (err) {
      return res.status(500).send({
        message: "Internal Server Error!!",
      });
    }

    if (!user) {
      return res.status(409).send({
        message: "Admins are invalid!!",
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

  // Update Admins of Group
  try {
    existingGroup = await Group.updateAdminsById(group.id, group.admins);
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  // Return Group if successfully updated
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

  // Check User is admin of the group
  var adminIndex = existingGroup.admins.indexOf(group.username);
  if (adminIndex != -1) {
    existingGroup.admins.splice(adminIndex, 1);
  }

  existingGroup.users.splice(userIndex, 1);

  if (existingGroup.users.length > 0) {
    // Update Admins of Group
    if (existingGroup.admins.length == 0) {
      existingGroup.admins.push(existingGroup.users[0]);
    }

    try {
      existingGroup = await Group.updateGroupById(group.id, existingGroup);
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

  // Return Group if successfully updated
  return res.status(200).send(existingGroup);
};
