var express = require("express");
var router = express.Router();

var groupController = require("../controllers/group.controller");
var auth = require("../middlewares/auth.middleware");

/* Create Group. */
router.post("/", auth, groupController.createGroup);

/* Update users to group. */
router.put("/", auth, groupController.updateUsers);

/* Update admins to group. */
router.put("/admins", auth, groupController.updateAdmins);

/* Exit Group. */
router.post("/exit", auth, groupController.exitGroup);

module.exports = router;
