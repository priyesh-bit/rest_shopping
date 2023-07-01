const express = require("express");
const route = express.Router();
const UserScheme = require("../models/users_model");
const validations = require("../common/validations");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup
route.post("/singup", (request, response, next) => {
  console.debug(request.body);
  if (request.body.email == null) {
    response.status(parseInt(process.env.VALIDATION_API_STATUS)).json({
      message: "Email required",
    });
  } else if (request.body.password == null) {
    response.status(parseInt(process.env.VALIDATION_API_STATUS)).json({
      message: "Password required",
    });
  } else if (!validations.isEmail(request.body.email)) {
    response.status(parseInt(process.env.VALIDATION_API_STATUS)).json({
      message: "Email is invalid",
    });
  } else {
    UserScheme.findOne({ email: request.body.email })
      .exec()
      .then((result) => {
        if (result) {
          response.status(parseInt(process.env.VALIDATION_API_STATUS)).json({
            message: "Email is already exist.",
          });
        } else {
          bcrypt.hash(request.body.password, 10, (error, hash) => {
            if (error) {
              response.status(parseInt(process.env.ERROR_API_STATUS)).json({
                error: error,
              });
            } else {
              var userData = {
                email: request.body.email,
                password: hash,
                created_at: Date(new Date().toUTCString()),
              };
              console.log(userData);

              const user = new UserScheme(userData);
              user
                .save()
                .then((userResult) => {
                  console.log(userResult);

                  const token = jwt.sign(
                    {
                      user_id: userResult._id,
                      email: userResult.email,
                    },
                    process.env.JWT_KEY,
                    { expiresIn: "24h" }
                  );

                  response.status(parseInt(process.env.POST_API_STATUS)).json({
                    message: "Signup successfully",
                    data: {
                      user_id: userResult._id,
                      email: userResult.email,
                      access_token: token,
                      created_at: userResult.created_at,
                    },
                  });
                })
                .catch((error) => {
                  response.status(parseInt(process.env.ERROR_API_STATUS)).json({
                    error: error,
                  });
                });
            }
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

// Signin
route.post("/singin", (request, response, next) => {
  console.debug(request.body);
  if (request.body.email == null) {
    response.status(parseInt(process.env.VALIDATION_API_STATUS)).json({
      message: "Email required",
    });
  } else if (request.body.password == null) {
    response.status(parseInt(process.env.VALIDATION_API_STATUS)).json({
      message: "Password required",
    });
  } else if (!validations.isEmail(request.body.email)) {
    response.status(parseInt(process.env.VALIDATION_API_STATUS)).json({
      message: "Email is invalid",
    });
  } else {
    UserScheme.findOne({ email: request.body.email })
      .exec()
      .then((userResult) => {
        if (userResult) {
          bcrypt.compare(
            request.body.password,
            userResult.password,
            (error, result) => {
              if (error) {
                response.status(parseInt(process.env.ERROR_API_STATUS)).json({
                  error: error,
                });
              } else {
                if (result == true) {
                  const token = jwt.sign(
                    {
                      user_id: userResult._id,
                      email: userResult.email,
                    },
                    process.env.JWT_KEY,
                    { expiresIn: "24h" }
                  );

                  response.status(parseInt(process.env.POST_API_STATUS)).json({
                    message: "Signin successfully",
                    data: {
                      user_id: userResult._id,
                      email: userResult.email,
                      access_token: token,
                      created_at: userResult.created_at,
                    },
                  });
                } else {
                  response
                    .status(parseInt(process.env.VALIDATION_API_STATUS))
                    .json({
                      message: "Incorrect password",
                    });
                }
              }
            }
          );
        } else {
          response.status(parseInt(process.env.VALIDATION_API_STATUS)).json({
            message: "Email does not exist.",
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

module.exports = route;
