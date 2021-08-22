const { body } = require("express-validator");
const ErrorResponse = require("../handle/ErrorResponse");

const isValidateRegisInput = [
  body("username").notEmpty().withMessage("Please provide a username"),
  body("email")
    .notEmpty()
    .withMessage("Please provide an email")
    .isEmail()
    .withMessage("Please add a valid email"),
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

const isValidateLoginInput = [
  body("email")
    .notEmpty()
    .withMessage("Please provide an email")
    .isEmail()
    .withMessage("Please add a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Please provide a password")
    .isLength({ min: 6, max: 18 })
    .withMessage("Password must be between 6 and 18 characters"),
];

const isValidateUpdatePwdInput = [
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

const isValidateProfileInput = [
  body("username").notEmpty().withMessage("Please provide a username"),
  body("email")
    .notEmpty()
    .withMessage("Please provide an email")
    .isEmail()
    .withMessage("Please add a valid email"),
];

const isValidateForgotPwdInput = [
  body("email")
    .notEmpty()
    .withMessage("Please provide an email")
    .isEmail()
    .withMessage("Please add a valid email"),
];

const isValidateResetPwdInput = [
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
  isValidateRegisInput,
  isValidateLoginInput,
  isValidateUpdatePwdInput,
  isValidateProfileInput,
  isValidateForgotPwdInput,
  isValidateResetPwdInput,
};
