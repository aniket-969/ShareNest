import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request. Token is missing.");
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new ApiError(401, "Unauthorized request. Token has expired.");
      } else {
        throw new ApiError(401, "Unauthorized request. Invalid token.");
      }
    }

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -rooms"
    );

    if (!user) {
      throw new ApiError(401, "Unauthorized request. User not found.");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("JWT verification error:", error.message);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});
