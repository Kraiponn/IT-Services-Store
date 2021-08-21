const sendResponseWithToken = (userModel, statusCode, response) => {
  // Create token
  const token = userModel.getSignJwtToken();

  // Config cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  response
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      data: {
        token,
        user: {
          id: userModel._id,
          username: userModel.username,
          email: userModel.email,
          image: userModel.image,
        },
      },
    });
};

module.exports = sendResponseWithToken;
