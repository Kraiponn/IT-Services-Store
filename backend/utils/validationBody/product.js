const { body } = require("express-validator");

const isValidInput = [
  body("category").notEmpty().withMessage("Please provide a category field"),
  body("title").notEmpty().withMessage("Please add a title"),
  body("description").notEmpty().withMessage("Please add a description"),
  body("price")
    .notEmpty()
    .withMessage("Please add a price field")
    .isNumeric()
    .withMessage("Price field must only a number"),
  body("instock")
    .notEmpty()
    .withMessage("Please add an instock")
    .isNumeric()
    .withMessage("Instock field must only a number"),
];

module.exports = { isValidInput };
