const express = require("express");
const {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

const { uploader } = require("../utils/configs/fileUploadConfig");
const { isValidInput } = require("../utils/validationBody/product");

const { isAuth, authorize } = require("../middlewares/authorize");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    uploader.single("avatar"),
    isValidInput,
    isAuth,
    authorize("Admin"),
    createProduct
  );

router
  .route("/:productId")
  .get(getProduct)
  .put(
    uploader.single("avatar"),
    isValidInput,
    isAuth,
    authorize("Admin"),
    updateProduct
  )
  .delete(isAuth, authorize("Admin"), deleteProduct);

module.exports = router;
