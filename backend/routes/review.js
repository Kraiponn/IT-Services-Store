const express = require("express"); // 💯
const {
  createdOrUpdatedReview,
  getReview,
  getReviews,
  // updateReview,
  deleteReview,
} = require("../controllers/review");

const { isValidInput } = require("../utils/validationBody/review");

const { isAuth } = require("../middlewares/authorize");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getReviews)
  .post(isValidInput, isAuth, createdOrUpdatedReview);

router.route("/:reviewId").get(getReview).delete(isAuth, deleteReview);

module.exports = router;
