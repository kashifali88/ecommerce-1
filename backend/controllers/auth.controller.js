import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/errorHandler.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

// register user
export const register = catchAsync(async (req, res, next) => {
  const { username, email, password, avatar } = req.body;

  // check if user exists
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(errorHandler(400, "User already exists"));
  }
  // hash password
  let hashPassword = password;
  if (password) {
    hashPassword = await bcrypt.hash(password, 10);
  }
  // new user
  const user = new User({ username, email, password: hashPassword, avatar });
  await user.save();
  res.status(201).json({ success: true, message: "User created successfully" });
});
// --------------------------------------------------------------------------------------------------------------------------- //

// login user
export const login = catchAsync(async (req, res, next) => {
     const { username, email, password } = req.body;
     if (!username && !email) {
       return next(errorHandler(400, "Please enter Email or Username"));
     }
     if (!password) {
       return next(errorHandler(400, "Please enter Password"));
     }
     const query = email ? {email:email} : {username:username}
     const user = await User.findOne(query);
     if (!user) {
       return next(errorHandler(404, "User not found"));
     }
     const isPasswordValid = await bcrypt.compare(password, user.password);
     if (!isPasswordValid) {
       return next(errorHandler(401, "invalid credentials"));
     }

     const token = jwt.sign(
       { id: user._id, role: user.role },
       process.env.JWT_SECRET_key,
       { expiresIn: "7d" },
     );
     console.log(token);
     
     res.cookie("token", token, {
       httpOnly: true,
     });
     const { password: pass, ...userWithoutPassword } = user._doc;
     res
       .status(200)
       .json({
         success: true,
         message: "User  logged in successfully",
         userWithoutPassword,
       });
   
});

// --------------------------------------------------------------------------------------------------------- //

// google login
export const google = catchAsync(async (req, res, next) => {
  const { email, username, avatar } = req.body;

  // find user
  const user = await User.findOne({ email });
  if (user) {
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const { password: pass, ...userWithoutPassword } = user._doc;
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      userWithoutPassword,
    });
  }
  // create new user

  // generate random password
  const randomPassword =
    Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  const hashPassword = await bcrypt.hash(randomPassword, 10);
  const newUser = new User({
    username:
      username.split(" ").join("").toLowerCase() +
      Math.random().toString(36).slice(-8),
    email,
    password: hashPassword,
  });
  await newUser.save();
  const token = jwt.sign(
    { id: newUser._id, role: newUser.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" },
  );
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  const { password: pass, ...userWithoutPassword } = newUser._doc;
  return res.status(201).json({
    success: true,
    message: "User created successfully",
    userWithoutPassword,
  });
});

// ---------------------------------------------------------------------------------------------------------//

// logout user
export const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("token");
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
});

//-------------------------------------------------------------------------------------------------------//

// forgot password
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(errorHandler(400, "Email is required"));
  }
  const user  = await User.findOne({ email });
  if (!user) {
    return next(errorHandler(404, "User not found"));
  }
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();
  // send email with reset token
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset",
        text: `Please click on the following link to reset your password: ${resetUrl}`,
      };
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: "Reset link sent to email" });
    });

    // reset password
    export const resetPassword = catchAsync(async (req, res, next) => {
      const { token } = req.params;
      const { password } = req.body;
      if (!password) {
        return next(errorHandler(400, "Password is required"));
      }
      const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });
      if (!user) {
        return next(errorHandler(400, "Invalid or expired token"));
      }
      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(200).json({ success: true, message: "Password reset successful" });
    })

