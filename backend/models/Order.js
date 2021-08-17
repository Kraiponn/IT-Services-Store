const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requried: [true, "Please provided a review user"],
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    requried: [true, "Please provided a product"],
  },
  amount: {
    total: {
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
    enum: ["order", "shipping", "success", "cancel"],
    default: "order",
  },
});

module.exports = mongoose.model("Order", orderSchema);
