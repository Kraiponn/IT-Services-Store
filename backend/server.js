const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const morgan = require("morgan");

const errorHandler = require("./middlewares/errorHandler");
const connectedDB = require("./services/db");

// Include routes
const authRoutes = require("./routes/auth");
const catRoutes = require("./routes/category");
const prodRoutes = require("./routes/product");
const revRoutes = require("./routes/review");
const ordRoutes = require("./routes/order");

// Load variables config
// dotenv.config({ path: "config/app-config.env" });
dotenv.config();

const app = express();

// Enable logger tools for development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Connect database
connectedDB();

// Settings recieve data type and static path
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Enable cookie parser
app.use(cookieParser());

// Enabled cross origin
app.use(cors());

// Protect secure headers
app.use(helmet());

// Prevent XSS attacts
app.use(xss());
app.use(hpp());

// Prevent mongo injection
app.use(mongoSanitize());

// Limit quest
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

// Mount rotues
app.use("/api/v2021/auth", authRoutes);
app.use("/api/v2021/categories", catRoutes);
app.use("/api/v2021/products", prodRoutes);
app.use("/api/v2021/reviews", revRoutes);
app.use("/api/v2021/orders", ordRoutes);

app.use(errorHandler);

// Load port to run app
const PORT = process.env.APP_PORT || 5000;

// Run server
app.listen(PORT, () => {
  console.log(
    `Server is running at port ${PORT} and ${process.env.NODE_ENV} mode`.yellow
      .bold
  );
});
