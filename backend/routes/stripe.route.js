import express from "express";
import { createCheckoutSession } from "../controllers/stripe.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const stripeRouter = express.Router();

stripeRouter.post("/create-checkout-session", verifyToken, createCheckoutSession);

export default stripeRouter;