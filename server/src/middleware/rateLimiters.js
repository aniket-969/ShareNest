import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";

// Limit login attempts per IP
export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 429,
      `Too many login attempts. Try again after ${
        options.windowMs / 1000
      } seconds.`
    );
  },
});

// Limit session validation (called automatically on page load)
export const sessionLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 429,
      `Too many session checks. Slow down.`
    );
  },
});

export const globalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 300, 
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => req.clientIp,
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 429,
      `Too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000} minutes`
    );
  },
});
