const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  removedAccount,
} = require("../controllers/auth.js");
const {
  isValidateRegisInput,
  isValidateLoginInput,
  isValidateUpdatePwdInput,
  isValidateProfileInput,
  isValidateForgotPwdInput,
  isValidateResetPwdInput,
} = require("../utils/validationBody/auth");

const { uploader } = require("../utils/configs/fileUploadConfig");
const { isAuth } = require("../middlewares/authorize");

const router = express.Router();

router.post("/register", isValidateRegisInput, register);

router.post("/login", isValidateLoginInput, login);

router.get("/:userId", isAuth, getProfile);

router.put(
  "/updateprofile",
  uploader.single("avatar"),
  isValidateProfileInput,
  isAuth,
  updateProfile
);

router.put("/updatepassword", isValidateUpdatePwdInput, isAuth, updatePassword);

router.post("/forgotpassword", isValidateForgotPwdInput, forgotPassword);

router.put("/resetpassword/:tokenId", isValidateResetPwdInput, resetPassword);

router.post("/removedaccount", isAuth, removedAccount);

module.exports = router;
