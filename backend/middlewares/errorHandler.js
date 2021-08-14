const errorHandler = (err, req, res, next) => {
  const error = { ...err };

  // Debug error
  console.log(err);

  error.message = err.message;
  error.statusCode = err.statusCode;

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server",
  });
};

module.exports = errorHandler;
