const { convertErrorValidateToObject } = require("./convertTo");

const validateBodyResults = (error) => {
  if (!error.isEmpty()) {
    // let msg = convertValidateToErrorMsg(error.array());
    const errObj = convertErrorValidateToObject(error.array());

    const errors = new Error("Invalid validation");
    errors.statusCode = 422;
    errors.errorObj = errObj;
    throw errors;
  }
};

module.exports = { validateBodyResults };
