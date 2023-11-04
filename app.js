const express = require("express");
const app = express();
const morgan = require("morgan"); // logging middleware
const bodyParse = require("body-parser"); // body parser middleware
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_ADMIN}:${process.env.MONGO_PASSWORD}@node-rest-shop.nivo1ah.mongodb.net/?retryWrites=true&w=majority`
  // {
  //   useMongoClient: true,
  // }
);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParse.urlencoded({ extended: false })); // support only simple body url encoded
app.use(bodyParse.json());

/* Handle CORS with append to a header */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // * can be whatever page like http://my-home-page.com
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-Width, Content-Type, Accept, Auth"
  ); // Which headers can be accepted

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
    return res.status(200).json({});
  }

  next();
});

/* Routes which should handle requests */
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

/* Error if the route not exist */
app.use((req, res, next) => {
  const error = new Error("Not found!");
  error.status = 404;
  next(error);
});

/* Errors thrown from anywhere of the application */
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
