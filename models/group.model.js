const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let groupSchema = new Schema(
  {
    users: { type: Array, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

var Group = (module.exports = mongoose.model("Group", groupSchema));
