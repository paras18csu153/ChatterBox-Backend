const Chat = require("../models/chat.model");
const Group = require("../models/group.model");
const User = require("../models/user.model");

exports.createChat = async (req, res) => {
  // Convert request data to chat
  var chat = req.body;

  // Data Validation
  try {
    var existingUser = await User.getByUsernameEmail(chat.username, "");
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  if (!existingUser) {
    return res.status(409).send({
      message: "User doesn't exist!!",
    });
  }

  if (chat.chattingWith.indexOf(chat.username) > -1) {
    return res.status(409).send({
      message: "You cannot chat with yourself!!",
    });
  }

  chat.user_id = existingUser._id;
  if (!chat.chattingWith) {
    chat.chattingWith = [];
  }

  var chattingWithLength = chat.chattingWith.length;
  chat.chattingWith = chat.chattingWith.filter(function (elem, pos) {
    return chat.chattingWith.indexOf(elem) == pos;
  });

  // Check if users sent exists or not
  for (var i = 0; i < chattingWithLength; i++) {
    try {
      var user = await User.getByUsernameEmail(chat.chattingWith[i], "");
    } catch (err) {
      return res.status(500).send({
        message: "Internal Server Error!!",
      });
    }

    var existingGroup = null;
    // Check if group doesn't exist with id provided
    if (chat.chattingWith[i].match(/^[0-9a-fA-F]{24}$/)) {
      try {
        existingGroup = await Group.getById(chat.chattingWith[i]);
        chat.chattingWith[i] = {
          groupName: existingGroup.groupName,
          groupId: chat.chattingWith[i],
        };
      } catch (err) {
        return res.status(500).send({
          message: "Internal Server Error!!",
        });
      }
    }

    if (!user && !existingGroup) {
      return res.status(409).send({
        message: "Chats are invalid!!",
      });
    }
  }

  // Create Chat
  chat = new Chat(chat);
  try {
    var existingChat = await Chat.getChatById(chat);
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  if (existingChat) {
    return res.status(409).send({
      message: "Chat already exists!!",
    });
  }

  try {
    chat = await Chat.create(chat);
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  // Return Group if successfully created
  return res.status(200).send(chat);
};

exports.getChats = async (req, res) => {
  // Convert request data to chat
  var chat = req.body;

  // Data Validation
  try {
    var existingUser = await User.getByUsernameEmail(chat.username, "");
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  if (!existingUser) {
    return res.status(404).send({
      message: "User doesn't exist!!",
    });
  }

  chat.user_id = existingUser._id;
  chat = new Chat(chat);
  try {
    existingChat = await Chat.getChatById(chat);
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  if (!existingChat) {
    try {
      chat = await Chat.create(chat);
    } catch (err) {
      return res.status(500).send({
        message: "Internal Server Error!!",
      });
    }
  }

  // Return All Chats
  return res.status(200).send(chat);
};

exports.updateChat = async (req, res) => {
  // Convert request data to chat
  var chat = req.body;

  // Data Validation
  if (!chat.chattingWith) {
    return res.status(400).send({ message: "Chats cannot be empty!!" });
  }

  chat.chattingWith = chat.chattingWith.filter(function (elem, pos) {
    return chat.chattingWith.indexOf(elem) == pos;
  });

  try {
    var existingUser = await User.getByUsernameEmail(chat.username, "");
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  if (!existingUser) {
    return res.status(404).send({
      message: "User doesn't exist!!",
    });
  }

  chat.user_id = existingUser._id;

  chat = new Chat(chat);
  try {
    var existingChat = await Chat.getChatById(chat);
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }

  if (!existingChat) {
    return res.status(404).send({
      message: "Chat Not Found!!",
    });
  }

  var chattingWithLength = chat.chattingWith.length;

  // Check if users sent exists or not
  for (var i = 0; i < chattingWithLength; i++) {
    try {
      var user = await User.getByUsernameEmail(chat.chattingWith[i], "");
    } catch (err) {
      return res.status(500).send({
        message: "Internal Server Error!!",
      });
    }

    var existingGroup = null;
    // Check if group doesn't exist with id provided
    if (chat.chattingWith[i].match(/^[0-9a-fA-F]{24}$/)) {
      try {
        existingGroup = await Group.getById(chat.chattingWith[i]);
        chat.chattingWith[i] = {
          groupName: existingGroup.groupName,
          groupId: chat.chattingWith[i],
        };
      } catch (err) {
        return res.status(500).send({
          message: "Internal Server Error!!",
        });
      }
    }

    if (!user && !existingGroup) {
      return res.status(409).send({
        message: "Chats are invalid!!",
      });
    }
  }

  try {
    existingChat.chattingWith = chat.chattingWith;
    chat = await Chat.updateChatById(existingChat);
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }
  // Return Chat if successfully updated
  return res.status(200).send(chat);
};
