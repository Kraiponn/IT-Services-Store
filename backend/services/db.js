const mongoose = require("mongoose");

// console.log("name", process.env.JWT_RESPONSE_PREFIX);

const connectedDB = async () => {
  // console.log("env test", process.env.CLOUD_API_SECRET);

  const strConnect =
    process.env.NODE_ENV === "development"
      ? process.env.MONGO_URI_DEV
      : process.env.MONGO_URI_PROD;

  try {
    const conn = await mongoose.connect(`${strConnect}`, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Mongodb connected: ${conn.connection.host}`.cyan.bold);
  } catch (error) {
    console.error(`Mongodb error:`.red.underline.bold, error);
  }
};

module.exports = connectedDB;
