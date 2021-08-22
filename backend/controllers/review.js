const asyncHanler = require("express-async-handler");
const { validationResult } = require("express-validator");

const {
  validateBodyResults,
} = require("../utils/validationBody/validateResults");

const ErrorResponse = require("../utils/handle/ErrorResponse");
const { searchByQueries, FIND_BY_TITLE } = require("../services/searchByQuery");

const Review = require("../models/Review");

// @desc      Create new Review
// @route #1  POST /api/v2021/reviews
// @route #2  POST api/v2021/products/:productId/reviews ✅
// @access    Private
exports.createdOrUpdatedReview = asyncHanler(async (req, res, next) => {
  // Validate input
  const error = validationResult(req);
  validateBodyResults(error);

  const fieldsToCreate = {
    title: req.body.title,
    description: req.body.description,
    rating: parseInt(req.body.rating),
    product: req.params.productId,
    user: req.user._id,
  };

  const everReview = await Review.findOne({
    product: req.params.productId,
    user: req.user._id,
  });

  let review;

  // Make sure user never reviewed this productId
  if (!everReview) {
    // Create new review
    review = await Review.create(fieldsToCreate);

    if (!review) {
      return next(
        new ErrorResponse("Invalid created review. Please try again.", 500)
      );
    }
  } else {
    everReview.title = req.body.title;
    everReview.description = req.body.description;
    everReview.rating = req.body.rating;
    everReview.product = req.params.productId;
    everReview.user = req.user._id;

    // Updating review
    await everReview.save();
  }

  res.status(201).json({
    success: true,
    data: {
      message: `Review ${review ? "created" : "updated"} is successfully`,
      review: review || everReview,
    },
  });
});

// @desc    Get Reviews
// @route   GET /api/v2021/reviews
//          GET /api/v2021/reviews?select=x,xx&gt[yy]=yy
// @access  Public
exports.getReviews = asyncHanler(async (req, res, next) => {
  // Make sure you will search all or by query string
  if (req.query.search || req.query.page) {
    searchByQueries(Review, FIND_BY_TITLE, req, res, [
      {
        path: "user",
        select: "username email image.secure_url createdAt -_id",
      },
    ]);
  } else {
    const review = await Review.find().populate({
      path: "user",
      select: "username email image.secure_url createdAt -_id",
    });

    res.status(200).json({
      success: true,
      data: {
        review,
      },
    });
  }
});

// @desc    Get one review
// @route   GET /api/v2021/reviews/:reviewId
// @access  Public
exports.getReview = asyncHanler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return next(
      new ErrorResponse(
        `Review not found with id of ${req.params.reviewId}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: {
      review,
    },
  });
});

// @desc    Update review
// @route   PUT /api/v2021/reviews/:productId
// @access  Private
exports.updateReview = asyncHanler(async (req, res, next) => {
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

// @desc    Delete review
// @route   DELETE /api/v2021/reviews/:reviewId
// @access  Private
exports.deleteReview = asyncHanler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return next(
      new ErrorResponse(
        `Review not found with id of ${req.params.reviewId}`,
        404
      )
    );
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {
      message: "Review deleted is successfully.",
    },
  });
});
