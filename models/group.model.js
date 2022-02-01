const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let groupSchema = new Schema({});

var Group = (module.exports = mongoose.model("Group", groupSchema));
