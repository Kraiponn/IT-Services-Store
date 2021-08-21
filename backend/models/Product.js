const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    requried: [true, "Please provided a category of product"],
  },
  title: {
    type: String,
    required: [true, "Please add a product title"],
    index: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    mixLength: [255, "Description must be long than 255 characters"],
  },
  image: {
    public_id: String,
    secure_url: String,
  },
  price: {
    type: Number,
    required: [true, "Please add a product price"],
  },
  instock: {
    type: Number,
    required: [true, "Please add a product in stock"],
  },
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
});

module.exports = mongoose.model("Product", productSchema);
