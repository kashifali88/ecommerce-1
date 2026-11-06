import { catchAsync } from "../utils/catchAsync.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'

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

// login user
export const login = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!email) {
    return next(errorHandler(400, "Email is required"));
  }
  if (!password) {
    return next(errorHandler(400, "Password is required"));
  }

  // find user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(errorHandler(400, "Invalid credentials"));
  }
  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(errorHandler(400, "Invalid credentials"));
  }

  // create JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" },
  );
  // send cookie
 res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
  res.status(200).json({success:true, message: 'User logged in successfully', user})
});

// get users
export const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({ success: true, users });
});

// get single user
export const getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(errorHandler(404, "User does not exist"));
  }
  res.status(200).json({ success: true, user });
});

// update user

export const updateUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  // Check that the logged-in user owns this account
  if (!req.user || String(req.user.id) !== String(id)) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  // Find user and include password for password comparison
  const user = await User.findById(id).select("+password");

  if (!user) {
    return next(errorHandler(404, "User not found"));
  }

  // Only allow these fields to be updated
  const updateData = {
    username: req.body.username,
    email: req.body.email,
    avatar: req.body.avatar,
  };

  // Remove undefined fields
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  // Password update logic
  if (req.body.oldPassword || req.body.newPassword) {
    if (!req.body.oldPassword || !req.body.newPassword) {
      return next(errorHandler(400, "Please enter both old and new passwords"));
    }

    if (req.body.oldPassword === req.body.newPassword) {
      return next(errorHandler(400, "New password cannot be the same as old password"));
    }

    const isMatch = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );

    if (!isMatch) {
      return next(errorHandler(400, "Old password is incorrect"));
    }

    updateData.password = await bcrypt.hash(req.body.newPassword, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password");

  // Create a consistent JWT payload
  const token = jwt.sign(
    {
      id: updatedUser._id,
      role: updatedUser.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  // Set updated authentication cookie
 res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
  res.status(200).json({
    success: true,
    message: "User updated successfully",
    updatedUser,
  });
});


export const deleteUser = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  // only allow user to delete their own account
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You can delete only your account"));
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(errorHandler(404, "User does not exist"));
  }

  //  PASSWORD CHECK 
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(errorHandler(401, "Incorrect password"));
  }

  const deletedUser = await User.findByIdAndDelete(req.params.id);

  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});