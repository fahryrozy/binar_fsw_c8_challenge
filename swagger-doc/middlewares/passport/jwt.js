const jwt = require("jsonwebtoken");

module.exports = {
  JWTMiddleware: (req, res, next) => {
    try {
      const { token } = req.query;
      console.log("header =? ", token);
      if (token) {
        const decoded = jwt.verify(token, "secret-binar");
        req.id = decoded;
        console.log("decode => ", decoded);
        next();
      } else {
        res.status(401).json({
          status: false,
          message: "Unauthorized",
          data: null,
        });
        return;
      }
    } catch (error) {
      if (error.name === "TypeError") {
        res.status(401).json({
          status: false,
          message: "Unauthorized",
          data: null,
        });
        return;
      }
      if (error.name === "TokenExpiredError") {
        res.status(401).json({
          status: false,
          message: "Token Expired",
          data: null,
        });
        return;
      }
      res.status(500).json({
        status: false,
        message: error.message,
        data: null,
      });
      return;
    }
  },
};
