const path = require("path");
const fsExtra = require("fs-extra");
const asyncHanler = require("express-async-handler");
const { validationResult } = require("express-validator");

const ErrorResponse = require("../utils/ErrorResponse");
const checkResults = require("../utils/validationBody/bodyValidateResult");

const Category = require("../models/Category");
const { search } = require("../services/search");

// @desc    Create new category
// @route   POST /api/v2021/auth/categories
// @access  Public
exports.create = asyncHanler(async (req, res, next) => {
  // Validate input
  const error = validationResult(req);
  checkResults(error);

  // Make sure user must upload image
  if (!req.files) {
    return next(new ErrorResponse("Please upload an image", 400));
  }

  const file = req.files.avatar;

  if (!file.mimetype.startsWith("image/")) {
    return next(
      new ErrorResponse(
        `Please upload file type in (.jpg|.jpeg|.png|.gif)`,
        400
      )
    );
  }

  // Check over file size
  if (file.size > process.env.FILE_UPLOAD_LIMIT_SIZE) {
    return next(
      new ErrorResponse(
        `Image size must be less than ${
          process.env.FILE_UPLOAD_LIMIT_SIZE / 1000000
        } byte`,
        400
      )
    );
  }

  file.name = `${Date.now()}${path.parse(file.name).ext}`;
  const uploadPath = `${process.env.FILE_UPLOAD_CATEGORY_PATH}/${file.name}`;
  const avatarField = `${process.env.CATEGORY_IMAGE_DB_PATH}/${file.name}`;

  // Save file to server path
  file.mv(uploadPath);

  const fieldsToCreate = {
    title: req.body.title,
    description: req.body.description,
    avatar: avatarField,
  };

  const category = await Category.create(fieldsToCreate);

  if (!category) {
    return next(
      new ErrorResponse("Invalid created category. Please try again.", 500)
    );
  }

  res.status(201).json({
    success: true,
    data: {
      message: "New category created successfully",
      category,
      // uploadPath,
      // avatar: avatarField,
    },
  });
});

// @desc    Get categories
// @route   GET /api/v2021/auth/categories
//              /api/v2021/auth/categories?select=xx,xx&gt[xx]=xx&page=xx&sort=xx&limit=xx
// @access  Public
exports.getCategories = asyncHanler(async (req, res, next) => {
  // console.log(req.query);

  if (req.query.search) {
    // console.log("If loop..");

    search(req, res, Category);
  } else {
    const category = await Category.find();

    res.status(200).json({
      success: true,
      data: {
        category,
      },
    });
  }
});
