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
reviewSchema.statics.getUpdateAvgRating = async function (productId, msg) {
  try {
    const isProducts = await this.find({ product: productId }).countDocuments();

    if (!isProducts) {
      // console.log("Remove last review for this product");

      return await this.model("Product").findByIdAndUpdate(productId, {
        avgRating: 0,
      });
    }

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

    // console.log(`Rating ${msg}`, obj[0].avgRating, Math.ceil(obj[0].avgRating));

    await this.model("Product").findByIdAndUpdate(productId, {
      avgRating: Math.ceil(obj[0].avgRating),
    });
  } catch (error) {
    console.log(
      "Update rating to product model is error:".red.underline.bold,
      error
    );
  }
};

// Call get getUpdateAvgRating after save
reviewSchema.post("save", function () {
  this.constructor.getUpdateAvgRating(this.product, "create");
});

// Call get getUpdateAvgRating after remove
reviewSchema.pre("remove", function () {
  this.constructor.getUpdateAvgRating(this.product, "remove");
});

module.exports = mongoose.model("Review", reviewSchema);
