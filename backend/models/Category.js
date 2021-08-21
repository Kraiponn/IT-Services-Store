const mongoose = require("mongoose");

const catSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      mixLength: [255, "Description must be long than 255 characters"],
      index: true,
    },
    image: {
      public_id: String,
      secure_url: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", catSchema);
