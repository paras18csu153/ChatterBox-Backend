var express = require("express");
var router = express.Router();

var chatController = require("../controllers/chat.controller");
var auth = require("../middlewares/auth.middleware");

/* Create Chat. */
router.post("/", auth, chatController.createChat);

/* Get Chat by ID. */
router.get("/", auth, chatController.getChats);

/* Update Chat by ID. */
router.put("/", auth, chatController.updateChat);

module.exports = router;
