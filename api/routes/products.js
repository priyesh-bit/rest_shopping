const express = require("express"),
  mongoose = require("mongoose"),
  dotenv = require("dotenv");
const route = express.Router();
const ProductScheme = require("../models/product_model");

// config env file
dotenv.config();

// Get all products
route.get("/", (request, response, next) => {
  ProductScheme.find()
    .exec()
    .then((result) => {
      response.status(parseInt(process.env.GET_API_STATUS)).json({
        message: "product get success",
        data: result,
      });
    })
    .catch((error) => {
      response.status(parseInt(process.env.ERROR_API_STATUS)).json({
        error: error,
      });
    });
});

// Create single product
route.post("/", (request, response, next) => {
  console.debug(request.body);
  if (request.body.name == null) {
    response.status(parseInt(process.env.VALIDATION_API_STATUS)).json({
      message: "Product name required",
    });
  } else if (request.body.price == null) {
    response.status(parseInt(process.env.VALIDATION_API_STATUS)).json({
      message: "Product price required",
    });
  } else if (request.body.category == null) {
    response.status(parseInt(process.env.VALIDATION_API_STATUS)).json({
      message: "Product category required",
    });
  } else {
    var productData = {
      id: new mongoose.Types.ObjectId(),
      name: request.body.name,
      price: request.body.price,
      category: request.body.category,
      created_at: Date(new Date().toUTCString()),
    };

    const product = new ProductScheme(productData);
    product
      .save()
      .then((result) => {
        console.log(result);
        response.status(parseInt(process.env.POST_API_STATUS)).json({
          message: "product create success",
          data: product,
        });
      })
      .catch((error) => {
        response.status(parseInt(process.env.ERROR_API_STATUS)).json({
          error: error,
        });
      });
  }
});

// Get specific product
route.get("/:productId", (request, response, next) => {
  const productId = request.params.productId;

  ProductScheme.findById(productId)
    .exec()
    .then((result) => {
      if (result != null) {
        response.status(parseInt(process.env.GET_API_STATUS)).json({
          message: "product get success",
          data: result,
        });
      } else {
        response.status(parseInt(process.env.NOT_FOUND_API_STATUS)).json({
          message: "product not found",
        });
      }
    })
    .catch((error) => {
      response.status(parseInt(process.env.ERROR_API_STATUS)).json({
        error: error,
      });
    });
});

// Delete specific product
route.delete("/:productId", (request, response, next) => {
  const productId = request.params.productId;

  ProductScheme.deleteOne({ id: productId })
    .exec()
    .then((result) => {
      if (result != null) {
        if (result.acknowledged == true && result.deletedCount != 0) {
          response.status(parseInt(process.env.DELETE_API_STATUS)).json({
            message: "product delete success",
          });
        } else {
          response.status(parseInt(process.env.NOT_FOUND_API_STATUS)).json({
            message: "product not found",
          });
        }
      } else {
        response.status(parseInt(process.env.NOT_FOUND_API_STATUS)).json({
          message: "product not found",
        });
      }
    })
    .catch((error) => {
      response.status(parseInt(process.env.ERROR_API_STATUS)).json({
        error: error,
      });
    });
});

// Update specific product
route.patch("/:productId", (request, response, next) => {
  const productId = request.params.productId;

  console.debug(request.body);

  if (
    request.body.name == null &&
    request.body.price == null &&
    request.body.category == null
  ) {
    response.status(parseInt(process.env.VALIDATION_API_STATUS)).json({
      message: "Provide at least one of from name, price or category",
    });
  } else {
    var productData = {
      updated_at: Date(new Date().toUTCString()),
    };
    for (const key in request.body) {
      productData[key] = request.body[key];
    }

    ProductScheme.findOneAndUpdate({ id: productId }, productData)
      .exec()
      .then((result) => {
        if (result != null) {
          response.status(parseInt(process.env.PATCH_API_STATUS)).json({
            message: "product update success",
          });
        } else {
          response.status(parseInt(process.env.NOT_FOUND_API_STATUS)).json({
            message: "product not found",
          });
        }
      })
      .catch((error) => {
        response.status(parseInt(process.env.ERROR_API_STATUS)).json({
          error: error,
        });
      });
  }
});

module.exports = route;
