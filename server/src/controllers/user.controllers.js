import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import admin, { fcm } from "../firebase/config.js";

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
  .cookie("refreshToken", refreshToken, { ...options, path: "/api/v1/users/refreshTokens" }) 
  .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const googleLogin = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const idToken = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!idToken) throw new ApiError(400, "Missing Firebase ID token");

  const decoded = await admin.auth().verifyIdToken(idToken);

  const firebaseUid = decoded.uid;
  const email = decoded.email;
  const fullName = decoded.name || decoded.displayName || "Google User";
  const avatar = decoded.picture || "";

  // upsert 
  const filter = { firebaseUid };
  const update = {
    $setOnInsert: {
      firebaseUid,
      email,
      fullName,
      avatar,
      provider: "google",
      createdAt: Date.now(),
    },
  };
  const options = {
    upsert: true,
    new: true,
    rawResult: true,
    setDefaultsOnInsert: true,
  };

  const raw = await User.findOneAndUpdate(filter, update, options);

  const userDoc = raw && raw.value ? raw.value : raw;
console.log("raw data",raw)

  if (!userDoc) {
    throw new ApiError(500, "Failed to create or fetch user");
  }

  const { accessToken, refreshToken } = await generateTokens(userDoc._id);
  await User.updateOne({ _id: userDoc._1d ?? userDoc._id }, { $set: { refreshToken } });

  const safeUser = {
    _id: userDoc._id, 
    email: userDoc.email,
    username: userDoc.username,
    fullName: userDoc.fullName,
    avatar: userDoc.avatar,
  };

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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
console.log(incomingRefreshToken,"Inside refresh first entry")
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  console.log("This is refresh",req.body, incomingRefreshToken);
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  console.log(decodedToken,"At token decode")
  const user = await User.findById(decodedToken?._id);
console.log("user",user._id)
  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    console.log("invalid refreshToken")
    throw new ApiError(401, "Refresh token is expired or used");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };
console.log("about to generate tokens")
  const { accessToken, refreshToken } = await generateTokens(user._id);
console.log("Got the tokens",accessToken)
return res
.cookie("accessToken", accessToken, { ...options, path: "/" }) 
.cookie("refreshToken", refreshToken, { ...options, path: "/api/v1/users/refreshTokens" }) 
    .json( 
      new ApiResponse(
        200,
        {accessToken},
        "User Token updated successfully"
      )
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

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, username, avatar } = req.body;
  const userId = req.user._id;

  const updates = {};
  if (fullName)  updates.fullName  = fullName;
  if (avatar)    updates.avatar    = avatar;

  if (username) {
    // check uniqueness 
    const conflict = await User.findOne({
      username,
      _id: { $ne: userId }
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


const updateFcmToken = asyncHandler(async(req,res)=>{
  console.log("Updating fcm")
  const {token} = req.body
  console.log(req.user._id)
  const user = await User.findByIdAndUpdate(req.user?._id,{
    $set:{
      notificationToken:token
    }
  },{new:true})
  console.log("This is user",user)
   return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
})

export const testNotification = asyncHandler(async (req, res) => {
  console.log("here")
  const userId = req.user._id ;
  const user = await User.findById(userId).select("notificationToken");
  console.log("This ",user)
  if (!user?.notificationToken) {
    throw new ApiError(400, "No FCM token registered for this user");
  }

  await fcm.send({
    token: user.notificationToken,
    notification: {
      title: "🔔 Test Notification",
      body:  "If you see this, push is working 🎉",
    },
  });
console.log("After fcm")
  return res.json(new ApiResponse(200, null, "Test push sent"));
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

  const paymentMethodExists = user.paymentMethod.some(
    (existingMethod) =>
      existingMethod.appName === appName && existingMethod.type === type
  );

  if (paymentMethodExists) {
    throw new ApiError(409, "Payment method already exists");
  }

  const method = {
    appName: appName || null,
    type: type || null,
    qrCodeData: qrCodeData || null,
    paymentId: paymentId || null,
  };

  user.paymentMethod.push(method);
  await user.save();
  return res
    .status(201)
    .json(new ApiResponse(201, "Payment methods added successfully"));
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
  updateFcmToken
};
