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
      var user = await User.getByUsernameEmail(group.users[0], "");
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
