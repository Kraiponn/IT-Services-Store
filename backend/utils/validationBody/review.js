const { body } = require("express-validator");

const isValidInput = [
  body("title").notEmpty().withMessage("Please provide a title"),
  body("description").notEmpty().withMessage("Please provide a description"),
  body("rating")
    .notEmpty()
    .withMessage("Please add a rating")
    .isNumeric()
    .withMessage("Rating field must be only a number between 1 and 5 stars"),
];

module.exports = { isValidInput };
