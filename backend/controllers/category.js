const asyncHanler = require("express-async-handler");
const { validationResult } = require("express-validator");
const { cloudinary } = require("../utils/configs/fileUploadConfig");

const ErrorResponse = require("../utils/handle/ErrorResponse");
const {
  validateBodyResults,
} = require("../utils/validationBody/validateResults");

const ErrorRespose = require("../utils/handle/ErrorResponse");
const { searchByQueries, FIND_BY_TITLE } = require("../services/searchByQuery");
const Category = require("../models/Category");

// @desc    Create new category
// @route   POST /api/v2021/auth/categories
// @access  Private
exports.createCategory = asyncHanler(async (req, res, next) => {
  // Validate input
  const error = validationResult(req);
  validateBodyResults(error);

  // Make sure user must upload image
  if (!req.file) {
    return next(new ErrorRespose(`Please upload an image`, 400));
  }

  // console.log(req.file);

  const uploadResult = await cloudinary.uploader.upload(req.file.path);

  const fieldsToCreate = {
    title: req.body.title,
    description: req.body.description,
    image: {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
    },
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
    },
  });
});

// @desc    Get categories
// @route   GET /api/v2021/categories
//          GET /api/v2021/categories?select=x,xx&gt[yy]=yy
// @access  Public
exports.getCategories = asyncHanler(async (req, res, next) => {
  // Make sure you will search all or by query string
  if (req.query.search || req.query.page) {
    searchByQueries(Category, FIND_BY_TITLE, req, res);
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

// @desc    Get one category
// @route   GET /api/v2021/categories/:id
// @access  Private
exports.getCategory = asyncHanler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {
      category,
    },
  });
});

// @desc    Update category
// @route   PUT /api/v2021/categories/:id
// @access  Private
exports.updateCategory = asyncHanler(async (req, res, next) => {
  // Validate input
  const error = validationResult(req);
  validateBodyResults(error);

  const _id = req.params.id;
  const category = await Category.findById(_id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  let uploadResult;

  // Remove image from cloudinary if user provided new image
  if (req.file) {
    // Delete old image from cloudinary
    await cloudinary.uploader.destroy(category.image.public_id);

    // Upload new image to cloudinary
    uploadResult = await cloudinary.uploader.upload(req.file.path);
  }

  const { title, description } = req.body;

  category.title = title ? title : category.title;
  category.description = description ? description : category.description;

  if (uploadResult) {
    category.image = {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
    };
  }

  // Update new data to db
  await category.save();

  res.status(200).json({
    success: true,
    data: {
      message: "Updated category is successfully.",
      category,
    },
  });
});

// @desc    Delete category
// @route   DELETE /api/v2021/categories/:id
// @access  Private
exports.deleteCategory = asyncHanler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  // Delete image on cloudinary : {result: 'OK'}
  await cloudinary.uploader.destroy(category.image.public_id);

  await category.remove();

  res.status(200).json({
    success: true,
    data: {
      message: "Deleted category is successfully.",
    },
  });
});
