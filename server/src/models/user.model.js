import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    rooms: [
      {
        roomId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    paymentMethod:[
      {
        appName: {
          type: String,
          trim: true,
        },
        paymentId: {
          type: String,
          trim: true,
        },
        type: {
          type: String,
          enum: ['UPI', 'PayPal', 'Stripe', 'BankTransfer', 'Other']
        },
        qrCodeData: {
          type: String, 
        },
      }
    ]
    ,
    notificationToken:{
      type:String,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.path('paymentMethod').validate(function (value) {
  return value.length <= 3; // Ensures the paymentMethods array has at most 3 elements
}, 'You can only have up to 3 payment methods.');

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
      avatar: this.avatar,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
  return refreshToken;
};

export const User = mongoose.model("User", userSchema);
