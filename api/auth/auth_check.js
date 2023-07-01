const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  try {
    if (request.headers.authorization) {
      let token = request.headers.authorization.split(" ");
      if (token.length == 2) {
        jwt.verify(token[1], process.env.JWT_KEY, function (err, decoded) {
          if (err) {
            console.log(err);
            response.status(parseInt(process.env.UNAUTH_API_STATUS)).json({
              message: err.message,
              err: err.name,
            });
          } else {
            request.user = decoded;
            next();
          }
        });
      } else {
        response.status(parseInt(process.env.UNAUTH_API_STATUS)).json({
          message: "Invalid token",
        });
      }
    } else {
      response.status(parseInt(process.env.UNAUTH_API_STATUS)).json({
        message: "Un Authorized",
      });
    }
  } catch (error) {
    console.log(error);
    if (error.name == "TokenExpiredError") {
      response.status(parseInt(process.env.ERROR_API_STATUS)).json({
        message: "Un Authorized - Token Expired",
      });
    } else {
      response.status(parseInt(process.env.ERROR_API_STATUS)).json({
        message: "Un Authorized",
        error: error.toString(),
      });
    }
  }
};
