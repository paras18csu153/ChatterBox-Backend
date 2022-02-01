var express = require("express");
var router = express.Router();

var groupController = require("../controllers/group.controller");
var auth = require("../middlewares/auth.middleware");

/* Create Group. */
router.post("/", auth, groupController.createGroup);

/* Add users to group. */
router.put("/", auth, groupController.updateUser);

/* Exit Group. */
router.post("/exit", auth, groupController.exitGroup);

module.exports = router;
