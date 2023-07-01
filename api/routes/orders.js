const express = require("express");
const route = express.Router();

// Get all orders
route.get("/", (request, response, next) => {
  response.status(200).json({
    message: "order get success",
  });
});

// Place new order
route.post("/", (request, response, next) => {
  console.debug(request.body);
  response.status(201).json({
    message: "order placed success",
  });
});

// Get specific order
route.get("/:orderId", (request, response, next) => {
  const orderId = request.params.orderId;

  response.status(200).json({
    message: "order get success",
    data: {
      id: orderId,
    },
  });
});

// Update specific order
route.patch("/:orderId", (request, response, next) => {
  const orderId = request.params.orderId;

  console.debug(request.body);
  response.status(200).json({
    message: "order update success",
    data: {
      id: orderId,
    },
  });
});

module.exports = route;
