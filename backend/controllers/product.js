const asyncHanler = require("express-async-handler");
const { validationResult } = require("express-validator");
const { cloudinary } = require("../utils/configs/fileUploadConfig");

const {
  validateBodyResults,
} = require("../utils/validationBody/validateResults");

const ErrorResponse = require("../utils/handle/ErrorResponse");
const {
  searchByQueries,
  FIND_BY_DESCRIPTION,
} = require("../services/searchByQuery");
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
    return next(new ErrorResponse(`Please upload an image`, 400));
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
// @route   GET /api/v2021/products
//              /api/v2021/products?select=x,xx&gt[yy]=yy
// @access  Public
exports.getProducts = asyncHanler(async (req, res, next) => {
  // Make sure you will search all or by query string
  if (req.query.search || req.query.page) {
    searchByQueries(Product, FIND_BY_DESCRIPTION, req, res);
  } else {
    const product = await Product.find();

    res.status(200).json({
      success: true,
      data: {
        product,
      },
    });
  }
});

// @desc    Get one product
// @route   GET /api/v2021/products/:productId
// @access  Private
exports.getProduct = asyncHanler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(
      new ErrorResponse(
        `Product not found with id of ${req.params.productId}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: {
      product,
    },
  });
});

// @desc    Update product
// @route   PUT /api/v2021/products/:productId
// @access  Private
exports.updateProduct = asyncHanler(async (req, res, next) => {
  // Validate input
  const error = validationResult(req);
  validateBodyResults(error);

  const _id = req.params.productId;
  const product = await Product.findById(_id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${_id}`, 404));
  }

  let uploadResult;

  // Remove image from cloudinary if user provided new image
  if (req.file) {
    // Delete old image from cloudinary
    await cloudinary.uploader.destroy(product.image.public_id);

    // Upload new image to cloudinary
    uploadResult = await cloudinary.uploader.upload(req.file.path);
  }

  const { title, description } = req.body;

  product.title = title ? title : product.title;
  product.description = description ? description : product.description;

  if (uploadResult) {
    product.image = {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
    };
  }

  // Update new data to db
  await product.save();

  res.status(200).json({
    success: true,
    data: {
      message: "Updated product is successfully.",
      product,
    },
  });
});

// @desc    Delete product
// @route   DELETE /api/v2021/products/:productId
// @access  Private
exports.deleteProduct = asyncHanler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(
      new ErrorResponse(
        `Product not found with id of ${req.params.productId}`,
        404
      )
    );
  }

  // Delete image on cloudinary : {result: 'OK'}
  await cloudinary.uploader.destroy(product.image.public_id);

  await product.remove();

  res.status(200).json({
    success: true,
    data: {
      message: "Deleted product is successfully.",
    },
  });
});
