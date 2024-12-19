const express = require("express");
const protect = require("../middlewares/auth.middleware");
const {
  getUser,
  changePassword,
  editProfile,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/get-user", protect, getUser);
router.post("/change-password", protect, changePassword);
router.put("/edit-profile", protect, editProfile);

module.exports = router;
