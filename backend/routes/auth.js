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
const { isAuth } = require("../middlewares/authorize");
const {
  regisBody,
  loginBody,
  updatePwdBody,
  forgotPwdBody,
  resetPwdBody,
} = require("../utils/validationBody/auth");

const router = express.Router();

router.post("/register", regisBody, register);

router.post("/login", loginBody, login);

router.get("/:userId", isAuth, getProfile);

router.put("/updateprofile", isAuth, updateProfile);

router.put("/updatepassword", isAuth, updatePwdBody, updatePassword);

router.post("/forgotpassword", forgotPwdBody, forgotPassword);

router.put("/resetpassword/:tokenId", resetPwdBody, resetPassword);

router.post("/removedaccount", isAuth, removedAccount);

module.exports = router;
