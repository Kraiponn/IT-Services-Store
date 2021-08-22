const { body } = require("express-validator");

const isValidInput = [
  body("products").notEmpty().withMessage("Please provided a product field"),
  body("quantity")
    .notEmpty()
    .withMessage("Please provide a quantity field")
    .isNumeric()
    .withMessage("Quantity field must be only a numbers"),
  body("charges")
    .notEmpty()
    .withMessage("Please provide a charges field")
    .isNumeric()
    .withMessage("Charges field must be only a numbers"),
];

module.exports = { isValidInput };
