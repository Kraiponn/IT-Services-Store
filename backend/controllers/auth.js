const crypto = require("crypto");
const asyncHanler = require("express-async-handler");
const { validationResult } = require("express-validator");

const ErrorResponse = require("../utils/ErrorResponse");
const {
  validateBodyResults,
} = require("../utils/validationBody/validateResults");

const sendResponseWithToken = require("../services/sendTokenResponse");
const sendEmail = require("../services/sendEmail");
const { cloudinary } = require("../utils/configs/fileUploadConfig");
const User = require("../models/User");

// @desc    Create new user
// @route   POST /api/v2021/auth/register
// @access  Public
exports.register = asyncHanler(async (req, res, next) => {
  const error = validationResult(req);
  validateBodyResults(error);

  const user = await User.create(req.body);

  if (!user) {
    return next(
      new ErrorResponse("Create new user fail. Please try again.", 500)
    );
  }

  res.status(201).json({
    success: true,
    data: {
      message: "Created new user is successfully",
    },
  });
});

// @desc    Login
// @route   POST /api/v2021/auth/login
// @access  Public
exports.login = asyncHanler(async (req, res, next) => {
  const error = validationResult(req);
  validateBodyResults(error);

  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user) {
    return next(
      new ErrorResponse(
        `There is no user with that email: ${req.body.email}`,
        404
      )
    );
  }

  // Check match password
  const matchPwd = await user.comparedPassword(req.body.password);
  if (!matchPwd) {
    return next(new ErrorResponse(`Password is incorrect`, 400));
  }

  sendResponseWithToken(user, 200, res);
});

// @desc    Get user profile
// @route   GET /api/v2021/auth/:uerId
// @access  Public
exports.getProfile = asyncHanler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(
      new ErrorResponse(`There is no user with id of ${req.user._id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

// @desc    Edit user
// @route   PUT /api/v2021/auth/updateprofile
// @access  Private
exports.updateProfile = asyncHanler(async (req, res, next) => {
  const error = validationResult(req);
  validateBodyResults(error);

  // console.log("body", req.body);

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.user._id}`, 404)
    );
  }

  const { username, email, mobile, office, address, age } = req.body;

  user.username = username ? username : user.username;
  user.email = email ? email : user.email;
  user.credentials = {
    phone: {
      mobile: mobile ? mobile : "",
      office: office ? mobile : "",
    },
    address: address ? address : "",
    age: age ? parseInt(age) : 0,
  };

  if (req.file) {
    // Remove old image on cloudinary
    if (user.image.public_id) {
      await cloudinary.uploader.destroy(user.image.public_id);
    }

    // Update new image to cloudinary
    const newUploadResult = await cloudinary.uploader.upload(req.file.path);

    user.image = {
      public_id: newUploadResult.public_id,
      secure_url: newUploadResult.secure_url,
    };
  }

  // Update new data to db
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      message: "Profile updated is successfully",
      user,
    },
  });
});

// @desc    Edit password
// @route   PUT /api/v2021/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHanler(async (req, res, next) => {
  const error = validationResult(req);
  validateBodyResults(error);

  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.user._id}`, 404)
    );
  }

  const matchPwd = await user.comparedPassword(req.body.currentPassword);
  if (!matchPwd) {
    return next(new ErrorResponse(`Your current password is incollect`, 400));
  }

  user.password = req.body.newPassword;

  // Update new password
  await user.save();

  sendResponseWithToken(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/v2021/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHanler(async (req, res, next) => {
  const error = validationResult(req);
  validateBodyResults(error);

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse(
        `There is no user with that email ${req.body.email}`,
        404
      )
    );
  }

  // Create token id
  const tokenId = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const mailOptions = {
    subject: "Reset Password",
    senderName: "Admin",
    senderEmail: "admin@gmail.com",
    receiverEmail: "kraipon.na10@gmail.com",
    mailContent: `
      <h1>Hello kraipon.na10@gmail.com!</h1>
      <p>Someone has requested a link to change your password. You can do this through the button below.</p>
      <a href="${tokenId}">Reset Password</a>
      <br />
      <p>Or link to reset password: ${req.protocol}://${req.get(
      "host"
    )}/api/v2021/resetpassword/${tokenId}</p>

      <br />
      <p>If you didn't request this, please ignore this email. Your password will stay safe and won't be changed.</p>
    `,
  };

  try {
    // Send email to reset password link
    sendEmail(mailOptions);

    res.status(200).json({
      success: true,
      data: {
        message: "Email was send",
      },
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse(`Email cloud not be send`, 500));
  }
});

// @desc    Reset password by using token Id
// @route   POST /api/v2021/auth/resetpassword/:tokenId
// @access  Private
exports.resetPassword = asyncHanler(async (req, res, next) => {
  const error = validationResult(req);
  validateBodyResults(error);

  // Generate reset token id
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.tokenId)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse(`Invalid token`, 401));
  }

  // Set new password
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.password = req.body.password;

  await user.save();

  sendResponseWithToken(user, 200, res);
});

// @desc    Remove account
// @route   POST /api/v2021/auth/removedaccount
// @access  Private
exports.removedAccount = asyncHanler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(
      new ErrorResponse(`There is no user with id of ${req.user._id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {
      message: "User removed sucessfully",
    },
  });
});
