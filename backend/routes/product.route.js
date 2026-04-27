import express from "express";
import {
    addProductReview,
  createProduct,
  deleteProduct,
  deleteProductReview,
  filterProducts,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";
import { verifyToken } from "../utils/verifyToken.js";

const productRouter = express.Router();

productRouter.post("/create-product", verifyToken, verifyAdmin, createProduct);
productRouter.get("/get-product/:slug", getProduct);
productRouter.get("/filter", filterProducts);
productRouter.get("/get-products", getProducts);
productRouter.put(
  "/update-product/:slug",
  verifyToken,
  verifyAdmin,
  updateProduct,
);
productRouter.delete(
  "/delete-product/:id",
  verifyToken,
  verifyAdmin,
  deleteProduct,
);
productRouter.post("/:id/reviews", verifyToken, addProductReview);
productRouter.delete(
  "/:productId/reviews/:reviewId",
  verifyToken,
  deleteProductReview
);

export default productRouter;
