const asyncHanler = require("express-async-handler");
const { validationResult } = require("express-validator");
const { cloudinary } = require("../utils/configs/fileUploadConfig");

const ErrorResponse = require("../utils/ErrorResponse");
const {
  validateBodyResults,
} = require("../utils/validationBody/validateResults");

const ErrorRespose = require("../utils/ErrorResponse");
const { searchByQueries } = require("../services/searchByQuery");
const Product = require("../models/Product");

// @desc    Create new product
// @route   POST /api/v2021/products
// @access  Private
exports.createProduct = asyncHanler(async (req, res, next) => {
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
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    instock: req.body.instock,
    image: {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
    },
  };

  const product = await Product.create(fieldsToCreate);

  if (!product) {
    return next(
      new ErrorResponse("Invalid created product. Please try again.", 500)
    );
  }

  res.status(201).json({
    success: true,
    data: {
      message: "Product created is successfully",
      product,
    },
  });
});

// @desc    Get products
// @route   GET /api/v2021/auth/products
//              /api/v2021/auth/products?select=x,xx&gt[yy]=yy
// @access  Public
exports.getProducts = asyncHanler(async (req, res, next) => {
  //
});

// @desc    Get one product
// @route   GET /api/v2021/products/:id
// @access  Private
exports.getProduct = asyncHanler(async (req, res, next) => {
  //
});

// @desc    Update product
// @route   PUT /api/v2021/products/:id
// @access  Private
exports.updateProduct = asyncHanler(async (req, res, next) => {
  //
});

// @desc    Delete product
// @route   DELETE /api/v2021/products/:id
// @access  Private
exports.deleteProduct = asyncHanler(async (req, res, next) => {
  //
});
