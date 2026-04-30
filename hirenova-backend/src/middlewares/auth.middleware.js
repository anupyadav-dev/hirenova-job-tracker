import jwt from "jsonwebtoken";
import User from "../modules/user/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, token missing");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired");
    }
    throw new ApiError(401, "Invalid token");
  }

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (user.status === "blocked") {
    throw new ApiError(403, "Your account has been blocked");
  }

  req.user = user;

  next();
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role (${req.user.role}) is not allowed to access this resource`,
      );
    }

    next();
  };
};
