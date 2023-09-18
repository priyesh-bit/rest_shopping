const express = require("express");
const route = express.Router();
const OrderScheme = require("../models/order_model");
const checkAuth = require("../auth/auth_check");

// Get all orders
route.get("/", checkAuth, (request, response, next) => {
  OrderScheme.find({ user: request.user.user_id })
    .select("_id product user quantity order_status created_at updated_at")
    .populate(
      "product",
      "_id name price category created_at updated_at",
      "user",
      "_id email"
    )
    .exec()
    .then((result) => {
      response.status(parseInt(process.env.GET_API_STATUS)).json({
        message: "order get successfully",
        data: result,
      });
    })
    .catch((error) => {
      console.log(error);
      response.status(parseInt(process.env.ERROR_API_STATUS)).json({
        error: error.toString(),
      });
    });
});

// Place new order
route.post("/", checkAuth, (request, response, next) => {
  console.debug(request.body);
  if (request.body.product == null) {
    response.status(parseInt(process.env.VALIDATION_API_STATUS)).json({
      message: "Product required",
    });
  } else if (request.body.quantity == null) {
    response.status(parseInt(process.env.VALIDATION_API_STATUS)).json({
      message: "Quantity required",
    });
  } else {
    var orderData = {
      product: request.body.product,
      user: request.user.user_id,
      quantity: request.body.quantity,
      created_at: Date(new Date().toUTCString()),
    };

    const order = new OrderScheme(orderData);
    order
      .save()
      .then((result) => {
        console.log(result);
        response.status(parseInt(process.env.POST_API_STATUS)).json({
          message: "order placed successfully",
          data: {
            order_id: result._id,
          },
        });
      })
      .catch((error) => {
        console.log(error);
        response.status(parseInt(process.env.ERROR_API_STATUS)).json({
          error: error.toString(),
        });
      });
  }
});

// Get specific order
route.get("/:orderId", checkAuth, (request, response, next) => {
  const orderId = request.params.orderId;

  OrderScheme.findOne({ _id: orderId, user: request.user.user_id })
    .select("_id product user quantity order_status created_at updated_at")
    .populate("product", "_id name price category created_at updated_at")
    .populate("user", "_id email")
    .exec()
    .then((result) => {
      if (result != null) {
        response.status(parseInt(process.env.GET_API_STATUS)).json({
          message: "order get successfully",
          data: result,
        });
      } else {
        response.status(parseInt(process.env.NOT_FOUND_API_STATUS)).json({
          message: "order not found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(parseInt(process.env.ERROR_API_STATUS)).json({
        error: error.toString(),
      });
    });
});

module.exports = route;
