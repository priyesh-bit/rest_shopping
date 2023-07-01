const express = require("express"),
  morgan = require("morgan"),
  mongoose = require("mongoose"),
  dotenv = require("dotenv"),
  bodyParser = require("body-parser");
const app = express();

// config env file
dotenv.config();

// connecting to mangodb
mongoose
  .connect(
    "mongodb+srv://priyesh-bhuva:" +
      process.env.MANGO_ATLAS_PW +
      "@cluster0.ce3ii3d.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MangoDB connection successfully!");
  })
  .catch((error) => {
    console.log("MangoDB connection error");
    console.log(error);
  });

// Import API routes
const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");
const usersRouters = require("./api/routes/users");

// Logging every http
app.use(morgan("dev"));

// Read json body
app.use(bodyParser.json());

// CORS handling [IMPORTANT]
app.use((reg, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (reg.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DEL");
    return res.status(200).json({});
  }
  next();
});

// Apply API routes
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/users", usersRouters);

// Handle 404 globally
app.use((request, response, next) => {
  var error = Error();
  error.status = 404;
  error.message = "Not found";
  next(error);
});

// Handle API exception globally
app.use((error, request, response, next) => {
  response.status(error.status || 500);
  response.json({
    message: error.message,
  });
});

module.exports = app;
