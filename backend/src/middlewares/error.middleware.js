// src/middlewares/error.middleware.js
import { apiError } from "../utils/apiError.js";

const errorMiddleware = (err, req, res, next) => {
  const statuscode = err.statuscode || 500;

  res.status(statuscode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;
