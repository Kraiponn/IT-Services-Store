const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    index: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    mixLength: [255, "Description must be long than 255 characters"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requried: [true, "Please provided a review user"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    requried: [true, "Please provided a product review"],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
});

// Add new rating and sum to update everage in product collection
reviewSchema.statics.getUpdateAvgRating = async function (productId) {
  // Filter and Group for product rating
  const obj = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("Product").findByIdAndUpdate(productId, {
      avgRating: obj[0].avgRating,
    });
  } catch (error) {
    console.log("Update rating error:".red.underline.bold, error);
  }
};

// Call get getUpdateAvgRating after save
reviewSchema.post("save", function (next) {
  this.constructor.getUpdateAvgRating(this.product);
  next();
});

// Call get getUpdateAvgRating after remove
reviewSchema.pre("remove", function (next) {
  this.constructor.getUpdateAvgRating(this.product);
  next();
});

module.exports = mongoose.model("Review", reviewSchema);
