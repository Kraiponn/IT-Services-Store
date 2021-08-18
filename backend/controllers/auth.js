const path = require("path");
const crypto = require("crypto");
const fsExtra = require("fs-extra");
const asyncHanler = require("express-async-handler");
const { validationResult } = require("express-validator");
const ErrorResponse = require("../utils/ErrorResponse");
const checkResults = require("../utils/validationBody/bodyValidateResult");
const sendResponseWithToken = require("../utils/sendTokenResponse");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// @desc    Create new user
// @route   POST /api/v2021/auth/register
// @access  Public
exports.register = asyncHanler(async (req, res, next) => {
  const error = validationResult(req);
  checkResults(error);

  const user = await User.create(req.body);

  if (!user) {
    return next(
      new ErrorResponse("Create new user fail. Please try again.", 500)
    );
  }

  res.status(201).json({
    success: true,
    data: {
      message: "New user created successfully",
    },
  });
});

// @desc    Login
// @route   POST /api/v2021/auth/login
// @access  Public
exports.login = asyncHanler(async (req, res, next) => {
  const error = validationResult(req);
  checkResults(error);

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
// @access  Private
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
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.user._id}`, 404)
    );
  }

  const { username, email, mobile, office, address, age } = req.body;
  // console.log(req.body);

  user.username = username ? username : user.username;
  user.email = email ? email : user.email;

  user.credentials.phone = {
    mobile: mobile ? mobile : "",
    office: office ? office : "",
  };
  user.credentials.address = address ? address : "";
  user.credentials.age = age ? parseInt(age) : 0;

  if (req.files) {
    // console.log("Uploaded: ", req.files.avatar);
    const file = req.files.avatar;

    // Make type of a file to upload is an image
    if (!file.mimetype.startsWith("image/")) {
      return next(
        new ErrorResponse(
          `Please upload an image with (.jpg|.jpeg|.png|.gif) type`,
          400
        )
      );
    }

    const limitfileSize = process.env.FILE_UPLOAD_LIMIT_SIZE;

    // Limit size with 1.5Mb
    if (file.size > limitfileSize) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${limitfileSize} byte`,
          400
        )
      );
    }

    // Create custom file name
    file.name = `${Date.now()}-${user._id}${path.parse(file.name).ext}`;
    const uploadPath = `${process.env.FILE_UPLOAD_PROFILE_PATH}/${file.name}`;

    // Remove old image from server. If exists.
    if (
      await fsExtra.pathExists(
        `${process.env.IMAGE_REMOVE_PATH}/${user.credentials.image}`
      )
    ) {
      fsExtra.remove(
        `${process.env.IMAGE_REMOVE_PATH}/${user.credentials.image}`
      );

      // console.log("Old avarar remove...".red.underline.bold);
    }

    file.mv(uploadPath, function (err) {
      if (err) {
        return next(new ErrorResponse("file error", 500));
      }
    });

    // user.credentials.image = `${req.protocol}://${req.get(
    //   "host"
    // )}/uploads/profiles/${file.name}`;
    user.credentials.image = `${process.env.PROFILE_IMAGE_DB_PATH}/${file.name}`;
  }

  // Update new data to db
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      message: "Profile updated successfully",
      user,
    },
  });
});

// @desc    Edit password
// @route   PUT /api/v2021/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHanler(async (req, res, next) => {
  const error = validationResult(req);
  checkResults(error);

  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.user._id}`, 404)
    );
  }

  const matchPwd = await user.comparedPassword(req.body.currentPassword);
  if (!matchPwd) {
    return next(new ErrorResponse(`Password is incollect`, 400));
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
  checkResults(error);

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
  checkResults(error);

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
  const user = await User.findByIdAndDelete(req.user._id);

  if (!user) {
    return next(
      new ErrorResponse(
        `Can not remove this account. Because, User not found.`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: {
      message: "User removed sucessfully",
    },
  });
});
