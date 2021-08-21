const express = require("express");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const { uploader } = require("../utils/configs/fileUploadConfig");
const { isValidInput } = require("../utils/validationBody/category");

const { isAuth, authorize } = require("../middlewares/authorize");

const router = express.Router();

// All route must be an admin role to access
router.use(isAuth);
router.use(authorize("Admin"));

router
  .route("/")
  .get(getCategories)
  .post(uploader.single("avatar"), isValidInput, createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(uploader.single("avatar"), isValidInput, updateCategory)
  .delete(deleteCategory);

module.exports = router;
