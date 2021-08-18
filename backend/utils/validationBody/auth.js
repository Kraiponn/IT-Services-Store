const { body } = require("express-validator");
const ErrorResponse = require("../ErrorResponse");

const regisBody = [
  body("username").notEmpty().withMessage("Please provide a username"),
  body("email")
    .notEmpty()
    .withMessage("Please provide an email")
    .isEmail()
    .withMessage("Please add a valid type of email"),
  body("password")
    .notEmpty()
    .withMessage("Please provide a password")
    .isLength({ min: 6, max: 18 })
    .withMessage("Password must be between 6 and 18 characters"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Please provide a confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new ErrorResponse(
          "Confirm password does not match with password",
          400
        );
      }

      return true;
    }),
];

const loginBody = [
  body("email")
    .notEmpty()
    .withMessage("Please provide an email")
    .isEmail()
    .withMessage("Please add a valid type of email"),
  body("password")
    .notEmpty()
    .withMessage("Please provide a password")
    .isLength({ min: 6, max: 18 })
    .withMessage("Password must be between 6 and 18 characters"),
];

const updatePwdBody = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Please provide a current password")
    .isLength({ min: 6, max: 18 })
    .withMessage("Current password must be between 6 and 18 characters"),
  body("newPassword")
    .notEmpty()
    .withMessage("Please provide a new password")
    .isLength({ min: 6, max: 18 })
    .withMessage("New password must be between 6 and 18 characters"),
];

const forgotPwdBody = [
  body("email")
    .notEmpty()
    .withMessage("Please provide an email")
    .isEmail()
    .withMessage("Please add a valid type of email"),
];

const resetPwdBody = [
  body("password")
    .notEmpty()
    .withMessage("Please provide a password")
    .isLength({ min: 6, max: 18 })
    .withMessage("Password must be between 6 and 18 characters"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Please provide a confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new ErrorResponse(
          "Confirm password does not match with password",
          400
        );
      }

      return true;
    }),
];

module.exports = {
  regisBody,
  loginBody,
  updatePwdBody,
  forgotPwdBody,
  resetPwdBody,
};
