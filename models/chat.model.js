const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let chatSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  chattingWith: { type: Array, required: true },
});

var Chat = (module.exports = mongoose.model("Chat", chatSchema));

// Create chat
module.exports.create = async (chat) => {
  chat = await chat.save();
  return chat;
};

// Get Chat By ID
module.exports.getChatById = async (chat) => {
  chat = await Chat.findOne({
    user_id: chat.user_id,
  });
  return chat;
};

// Update Chat By ID
module.exports.updateChatById = async (chat) => {
  chat = await Chat.findByIdAndUpdate(chat._id, { $set: chat }, { new: true });
  return chat;
};
