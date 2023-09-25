const express = require("express");
const route = express.Router();
const ProductScheme = require("../models/product_model");
const checkAuth = require("../auth/auth_check");
const { detectExplicitContent } = require("../common/validations");
const multer = require('multer');
var fs = require("fs");

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded image.
    const filename = `${Date.now()}-${file.originalname}`;

    cb(null, filename);
  }
});

const upload = multer({ storage });

// Get all products
route.get("/", (request, response, next) => {
  ProductScheme.find()
    .select("_id name price category created_at updated_at")
    .exec()
    .then((result) => {
      response.status(parseInt(process.env.GET_API_STATUS)).json({
        message: "product get successfully",
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

// Create single product
route.post("/", checkAuth, (request, response, next) => {
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
          message: "product create successfully",
          data: {
            product_id: result._id,
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

// Get specific product
route.get("/:productId", (request, response, next) => {
  const productId = request.params.productId;

  ProductScheme.findById(productId)
    .select("_id name price category created_at updated_at")
    .exec()
    .then((result) => {
      if (result != null) {
        response.status(parseInt(process.env.GET_API_STATUS)).json({
          message: "product get successfully",
          data: result,
        });
      } else {
        response.status(parseInt(process.env.NOT_FOUND_API_STATUS)).json({
          message: "product not found",
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

// Delete specific product
route.delete("/:productId", checkAuth, (request, response, next) => {
  const productId = request.params.productId;

  ProductScheme.deleteOne({ id: productId })
    .exec()
    .then((result) => {
      if (result != null) {
        if (result.acknowledged == true && result.deletedCount != 0) {
          response.status(parseInt(process.env.DELETE_API_STATUS)).json({
            message: "product delete successfully",
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
      console.log(error);
      response.status(parseInt(process.env.ERROR_API_STATUS)).json({
        error: error.toString(),
      });
    });
});

// Update specific product
route.patch("/:productId", checkAuth, (request, response, next) => {
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
            message: "product update successfully",
          });
        } else {
          response.status(parseInt(process.env.NOT_FOUND_API_STATUS)).json({
            message: "product not found",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        response.status(parseInt(process.env.ERROR_API_STATUS)).json({
          error: error.toString(),
        });
      });
  }
});

// Check image is having nudity or explicit content
route.post("/check-image-content", upload.single('image'), async (request, response) => {

  try {
    const image = request.file;
    const imageB = fs.readFileSync(image.path);
    detectExplicitContent(imageB).then((result) => {
      if (result) {
        response.status(parseInt(process.env.VALIDATION_API_STATUS)).json({
          message: "Image may contains nudity or explicit content. Please review your imagee or upload different image.",
        });
      } else {
        response.status(parseInt(process.env.POST_API_STATUS)).json({
          message: "WOW",
        });
      }
    }).catch((error) => {
      console.log(error);
      response.status(parseInt(process.env.ERROR_API_STATUS)).json({
        error: 'Fail to check image content.',
      });
    });
  } catch (error) {
    console.log(error);
    response.status(parseInt(process.env.ERROR_API_STATUS)).json({
      error: error.toString(),
    });
  }
});

module.exports = route;
