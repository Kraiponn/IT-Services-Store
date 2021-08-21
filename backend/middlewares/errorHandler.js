const errorHandler = (err, req, res, next) => {
  const error = { ...err };

  // Debug error
  console.log(err);
  console.log("Error.name:".red.bold, err.name);

  error.message = err.message;
  error.statusCode = err.statusCode;

  // Validation Error
  if (err.statusCode === 422) {
    error.statusCode = 422;
    error.type = "Invalid validation";
    error.message = err.errorObj;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error.statusCode = 400;
    error.type = "Invalid validation";
    error.message = message;
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error.statusCode = 400;
    error.type = "Resource Not Found";
    error.message = `ObjectId not found or Invalid type`;
  }

  if (err.name === "ReferenceError") {
    error.statusCode = 404;
    error.type = "Resource Not Found";
    error.message = "Data not found";
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
