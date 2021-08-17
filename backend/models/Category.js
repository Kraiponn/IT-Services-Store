const mongoose = require("mongoose");

const catSchema = new mongoose.Schema({
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
  image: {
    type: String,
    default: "nopic.jpg",
  },
});

module.exports = mongoose.model("Category", catSchema);
