const mongoose = require("mongoose");

const ORDER_PENDING_STATE = "PENDING";
const ORDER_RECEIVE_STATE = "RECEIVED";
const ORDER_SHIPPING_STATE = "SHIPPING";
const ORDER_SUCCESS_STATE = "SUCCESS";
const ORDER_CANCEL_STATE = "CANCEL";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requried: [true, "Please provided an owner order"],
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    requried: [true, "Please provided a product order"],
  },
  amount: {
    quantity: {
      type: Number,
      default: 0,
    },
    charges: {
      type: Number,
      default: 0,
    },
  },
  status: {
    type: String,
    enum: [
      ORDER_PENDING_STATE,
      ORDER_RECEIVE_STATE,
      ORDER_SHIPPING_STATE,
      ORDER_SUCCESS_STATE,
      ORDER_CANCEL_STATE,
    ],
    default: ORDER_PENDING_STATE,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = {
  Order,
  ORDER_PENDING_STATE,
  ORDER_RECEIVE_STATE,
  ORDER_SHIPPING_STATE,
  ORDER_SUCCESS_STATE,
  ORDER_CANCEL_STATE,
};
