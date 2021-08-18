const convertValidateToErrorMsg = (errors) => {
  let msg = "";

  for (let err in errors) {
    // console.log(err);
    msg += `${errors[err].msg}, `;
  }

  return msg;
};

const convertErrorValidateToObject = (errors) => {
  let obj = {};

  // for (let index = 0; index < errors.length; index++) {
  //   obj[index] = errors[index].msg;
  // }

  obj = Object.assign(
    {},
    errors.map((err) => err.msg)
  );

  // console.log(obj);

  return obj;
};

module.exports = { convertValidateToErrorMsg, convertErrorValidateToObject };
