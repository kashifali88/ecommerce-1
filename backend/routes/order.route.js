import express from "express";
import {
  createOrder,
  getUserOrders,
  getSingleOrder,
  getAllOrders,
} from "../controllers/order.controller.js";
import { verifyToken } from '../utils/verifyToken.js'
import { verifyAdmin } from '../utils/verifyAdmin.js'


const orderRouter = express.Router();

// CREATE ORDER
orderRouter.post("/", verifyToken, createOrder);

// GET MY ORDERS
orderRouter.get("/my", verifyToken, getUserOrders);
orderRouter.get("/", verifyToken, verifyAdmin, getAllOrders);

// GET SINGLE ORDER
orderRouter.get("/:id", verifyToken, getSingleOrder);

export default orderRouter;