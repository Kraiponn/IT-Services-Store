const express = require("express");
const {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/order");

const { isValidInput } = require("../utils/validationBody/order");

const { isAuth } = require("../middlewares/authorize");

const router = express.Router();

router.route("/").get(getOrders).post(isValidInput, isAuth, createOrder);

router
  .route("/:orderId")
  .get(getOrder)
  .put(isValidInput, isAuth, updateOrder)
  .delete(isAuth, deleteOrder);

module.exports = router;
