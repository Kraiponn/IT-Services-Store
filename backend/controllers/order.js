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
const {
  Order,
  ORDER_RECEIVE_STATE,
  ORDER_SHIPPING_STATE,
  ORDER_SUCCESS_STATE,
  ORDER_CANCEL_STATE,
} = require("../models/Order");

// @desc    Create new Order
// @route   POST /api/v2021/orders
// @access  Private
exports.createOrder = asyncHanler(async (req, res, next) => {
  // Validate input
  const error = validationResult(req);
  validateBodyResults(error);

  const fieldsToCreate = {
    user: req.user._id,
    products: req.body.products,
    amount: {
      quantity: req.body.quantity,
      charges: req.body.charges,
    },
  };

  const order = await Order.create(fieldsToCreate);

  if (!order) {
    return next(
      new ErrorResponse("Invalid created order. Please try again.", 500)
    );
  }

  res.status(201).json({
    success: true,
    data: {
      message: "Order created is successfully",
      order,
    },
  });
});

// @desc    Get Orders
// @route   GET /api/v2021/orders
//          GET /api/v2021/orders?select=x,xx&gt[yy]=yy
// @access  Public
exports.getOrders = asyncHanler(async (req, res, next) => {
  // Make sure you will search all or by query string
  if (req.query.search || req.query.page) {
    searchByQueries(Order, null, req, res);
  } else {
    const orders = await Order.find();

    res.status(200).json({
      success: true,
      data: {
        count: orders.length,
        orders,
      },
    });
  }
});

// @desc    Get one order
// @route   GET /api/v2021/orders/:orderId
// @access  Private
exports.getOrder = asyncHanler(async (req, res, next) => {
  const id = req.params.orderId;

  // const order = await Order.findById(id).populate({
  //   path: "products",
  //   select: "title description price image.secure_url",
  // });

  const order = await Order.findById(id).populate(
    "products",
    "title description price image.secure_url"
  );

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {
      order,
    },
  });
});

// @desc    Update Order
// @route   PUT /api/v2021/orders/:orderId
// @access  Private
exports.updateOrder = asyncHanler(async (req, res, next) => {
  // Validate input
  const error = validationResult(req);
  validateBodyResults(error);

  const _id = req.params.orderId;
  const order = await Order.findById(_id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${_id}`, 404));
  }

  const { products, quantity, charges, status, createdAt } = req.body;

  // Create update fields
  order.products = products ? products : order.products;
  order.amount = {
    quantity: quantity ? quantity : order.amount.quantity,
    charges: charges ? charges : order.amount.charges,
  };
  order.status = status ? status : order.status;
  order.createdAt = createdAt ? createdAt : order.createdAt;

  // Update new data to db
  await order.save();

  res.status(200).json({
    success: true,
    data: {
      message: "Order updated is successfully.",
      order,
    },
  });
});

// @desc    Delete Order
// @route   DELETE /api/v2021/products/:productId
// @access  Private
exports.deleteOrder = asyncHanler(async (req, res, next) => {
  const product = await Order.findById(req.params.productId);

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
