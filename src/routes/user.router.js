const express = require("express");
const protect = require("../middlewares/auth.middleware");
const { getUser } = require("../controllers/user.controller");

const router = express.Router();

router.get("/get-user", protect, getUser);

module.exports = router;
