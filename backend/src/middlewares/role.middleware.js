import { apiError } from "../utils/apiError.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new apiError(403, "You are not authorized to perform this action");
    }
    next();
  };
};
