var express = require("express");
var router = express.Router();

var groupController = require("../controllers/group.controller");
var auth = require("../middlewares/auth.middleware");

/* Register user. */
router.post("/", auth, groupController.createGroup);

module.exports = router;
