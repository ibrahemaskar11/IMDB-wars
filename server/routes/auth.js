const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
} = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:resetToken").put(resetPassword);
router.route("/refresh").post(refreshToken);

module.exports = router;
