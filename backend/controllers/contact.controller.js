import Contact from "../models/contact.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { errorHandler } from "../utils/errorHandler.js";

export const sendMessage = catchAsync(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(errorHandler(400, "All fields are required"));
  }

  const newMessage = await Contact.create({
    name,
    email,
    message,
  });
   await newMessage.save();

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: newMessage,
  });
});