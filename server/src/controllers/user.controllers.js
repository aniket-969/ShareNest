import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  //   console.log(accessToken, refreshToken);
  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  console.log("this is body", req.body);
  const { username, email, fullName, avatar, password } = req.body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    username,
    fullName,
    email,
    password,
    avatar,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken "
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  return res.json(
    new ApiResponse(200, createdUser, "User registered successfully")
  );
});

const loginUser = asyncHandler(async (req, res) => {
  console.log("Login", req.body);
  const { identifier, password } = req.body;
// console.log("here is id, pass",identifier,password)
  const existedUser = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });
  if (!existedUser) {
    throw new ApiError(409, "User not found");
  }
  //   console.log("existed", existedUser);
  const isPasswordValid = await existedUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    console.log("Password not valid");
    throw new ApiError(401, "Invalid user credentials");
  }
console.log("ndf here")
  const { accessToken, refreshToken } = await generateTokens(existedUser._id);

  const loggedInUser = await User.findById(existedUser._id).select(
    "username avatar email fullName"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .cookie("accessToken", accessToken, { ...options, path: "/" })
    .cookie("refreshToken", refreshToken, {
      ...options,
      path: "/api/v1/users/refreshTokens",
    })
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const googleLogin = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const idToken = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  console.log(idToken, req.body, "this is body");
  if (!idToken) {
    throw new ApiError(400, "Missing Google ID token");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  console.log("ticket 9s e", ticket);
  const payload = ticket.getPayload();
  console.log(payload);
  if (!payload) {
    throw new ApiError(401, "Invalid Google token");
  }

  const { sub: googleId, email, name: fullName, picture: avatar } = payload;

  // Upsert user
  const user = await User.findOneAndUpdate(
    { googleId },
    {
      $setOnInsert: {
        googleId,
        email,
        fullName,
        avatar,
        provider: "google",
        createdAt: Date.now(),
      },
    },
    { upsert: true, new: true }
  );

  if (!user) {
    throw new ApiError(500, "Failed to create or fetch user");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  await User.updateOne({ _id: user._id }, { $set: { refreshToken } });

  const safeUser = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    avatar: user.avatar,
  };

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  };

  return res
    .cookie("accessToken", accessToken, { ...cookieOptions, path: "/" })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      path: "/api/v1/users/refreshTokens",
    })
    .json(new ApiResponse(200, safeUser, "User logged in via Google"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unidentified user");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshTokens = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  console.log(incomingRefreshToken, "Inside refresh first entry");
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  console.log("This is refresh", req.body, incomingRefreshToken);
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  console.log(decodedToken, "At token decode");
  const user = await User.findById(decodedToken?._id);
  console.log("user", user._id);
  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    console.log("invalid refreshToken");
    throw new ApiError(401, "Refresh token is expired or used");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };
  console.log("about to generate tokens");
  const { accessToken, refreshToken } = await generateTokens(user._id);
  console.log("Got the tokens", accessToken);
  return res
    .cookie("accessToken", accessToken, { ...options, path: "/" })
    .cookie("refreshToken", refreshToken, {
      ...options,
      path: "/api/v1/users/refreshTokens",
    })
    .json(
      new ApiResponse(200, { accessToken }, "User Token updated successfully")
    );
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.json(
      new ApiResponse(
        200,
        null,
        "If an account exists, you will receive a reset link."
      )
    );
  }

  const now = Date.now();
  const WEEK = 7 * 24 * 60 * 60 * 1000;

  if (
    user.lastPasswordResetRequestAt &&
    now - user.lastPasswordResetRequestAt > WEEK
  ) {
    user.resetPasswordRequestCount = 0;
  }

  if (user.resetPasswordRequestCount >= 5) {
    return res.json(
      new ApiResponse(
        200,
        null,
        "If an account exists, you will receive a reset link."
      )
    );
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(now + Number(process.env.RESET_PASSWORD_TOKEN_EXPIRY)); 
  user.resetPasswordRequestCount += 1;
  user.lastPasswordResetRequestAt = now;

  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    console.log("RESET PASSWORD LINK:", resetLink);
  
  // try {
  //   await sendResetPasswordEmail(user.email, resetLink);
  // } catch (error) {
  //   console.error("Reset email failed:", error);
  // }

  return res.json(
    new ApiResponse(
      200,
      null,
      "If an account exists, you will receive a reset link."
    )
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Reset link is invalid or expired");
  }

  user.password = password; 
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  user.resetPasswordRequestCount = 0;

  await user.save();

  return res.json(
    new ApiResponse(
      200,
      null,
      "Password reset successful. Please log in."
    )
  );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, username, avatar } = req.body;
  const userId = req.user._id;

  const updates = {};
  if (fullName) updates.fullName = fullName;
  if (avatar) updates.avatar = avatar;

  if (username) {
    // check uniqueness
    const conflict = await User.findOne({
      username,
      _id: { $ne: userId },
    }).lean();

    if (conflict) {
      res.status(400);
      throw new Error("Username already in use");
    }
    updates.username = username;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("username email fullName avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});


const fetchSession = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );
  console.log("From session");
  if (!user) {
    throw new ApiError(401, "Session not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Session retrieved successfully"));
});

const addPaymentMethod = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { appName, paymentId, type, qrCodeData } = req.body;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(400, "can't find the user");

  const method = {
    appName: appName || null,
    type: type || null,
    qrCodeData: qrCodeData || null,
    paymentId: paymentId || null,
  };
  console.log(method, "Here ismethod");
  user.paymentMethod.push(method);
  await user.save();
  return res
    .status(201)
    .json(new ApiResponse(201, "Payment methods added successfully"));
});

const deletePaymentMethod = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { paymentId } = req.params;

  if (!paymentId) {
    throw new ApiError(400, "paymentId is required");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { paymentMethod: { _id: paymentId } } },
    { new: true, select: "-password -refreshToken" }
  ).lean();

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.json(
    new ApiResponse(
      200,
      { paymentMethod: updatedUser.paymentMethod },
      "Payment method deleted successfully"
    )
  );
});

export {
  registerUser,
  loginUser,
  googleLogin,
  logoutUser,
  refreshTokens,
  changePassword,
  updateAccountDetails,
  fetchSession,
  addPaymentMethod,
  deletePaymentMethod,
  forgotPassword,
  resetPassword
};
