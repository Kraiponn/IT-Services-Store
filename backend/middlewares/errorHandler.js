const errorHandler = (err, req, res, next) => {
  const error = { ...err };

  // Debug error
  console.log(err);

  error.message = err.message;
  error.statusCode = err.statusCode;

  // Validation Error
  if (err.statusCode === 422) {
    error.statusCode = 422;
    error.type = "Invalid validation";
    error.message = err.errorObj;
  }

  // Duplicate field value
  if (err.code === 11000) {
    error.statusCode = 400;
    error.type = "E11000 Duplicate field value";
    error.message = err.keyValue;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    errorDetail: {
      type: error.type || "General",
      message: error.message || "Internal error",
    },
  });
};

module.exports = errorHandler;
