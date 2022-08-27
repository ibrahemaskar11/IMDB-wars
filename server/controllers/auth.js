const User = require("../models/User");
const ErrorResponse = require("../utlis/errorResponse");
const crypto = require("crypto");
const sendEmail = require("../utlis/sendEmail");
const jwt = require("jsonwebtoken");
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};
exports.forgotPassword = async (req, res, next) => {
  // Send Email to email provided but first check if user exists
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("No email could not be sent", 404));
    }

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset url to email to provided email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    console.log(resetToken);
    // HTML Message
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};
exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new ErrorResponse("not authorized to access this route", 401));
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorResponse("No user found with this id", 404));
    }
    sendToken(user, 201, res);
    next();
  } catch (error) {
    return next(new ErrorResponse("not authorized to access this route", 401));
  }
};

const sendToken = async (user, statusCode, res) => {
  const token = await user.getSignedToken();
  const refreshTokn = await user.getSignedRefreshToken();
  return res.status(statusCode).json({
    success: true,
    message: "Logged in successfully",
    user,
    expireIn: 60*60*1000,
    token,
  });
};
