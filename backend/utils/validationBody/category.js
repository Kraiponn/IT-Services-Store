const { body } = require("express-validator");

const isValidInput = [
  body("title").notEmpty().withMessage("Please add a title"),
  body("description").notEmpty().withMessage("Please add a description"),
];

module.exports = { isValidInput };
