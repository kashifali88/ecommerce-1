import Products from '../models/product.model.js';
import slugify from 'slugify';
import { errorHandler } from '../utils/errorHandler.js';
import mongoose from 'mongoose';

export const createProduct = async (req, res, next) => {
    try {
        const {name, slug, description, price, category,productImage, quantity, shipping} = req.body;
        switch (true) {
            case !name:
                return next(errorHandler(500, 'Name is required')) 
            case !description:
                return next(errorHandler(500, 'Description is required')) 
            case !price:
                return next(errorHandler(500, 'Price is required')) 
            case !category:
                return next(errorHandler(500, 'Category is required')) 
            case !quantity:
                return next(errorHandler(500, 'Quantity is required')) 
            case !productImage && productImage.size > 10000:
                return next(errorHandler(402, 'product image  is required and size must lower than 1mb')) 
        }
        const products = new Products({name, description,price,category,productImage,quantity,shipping, slug:slugify(name)});

        await products.save();
        res.status(201).json({success:true, message:'Product created successfully', products})
    } catch (error) {
        next(error)
    }
}

export const getProducts = async (req, res, next) => {
    try {
        const limit = Number(req.query.limit) || 15;
        const page = Number(req.query.page) || 1;
        const skip = (page -1 ) * limit
        const products = await Products.find({}).limit(limit).skip(skip).sort({createdAt:-1});
        const totalProducts = await Products.countDocuments()
        res.status(200).json({success:true, products, totalProducts})
    } catch (error) {
        next(error)
    }
}

export const getProduct = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    const product = await Products.findOne({ slug })
      .populate("category")
      .populate("reviews.user", "username email avatar role");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};
// get product by query

export const filterProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;

    let filter = {};

    //  FIX: convert to ObjectId
    if (category) {
      const categories = category.split(',').map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      filter.category = { $in: categories };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.name = { $regex: new RegExp(search, "i") };
    }

    const products = await Products.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    const totalProducts = products.length;

    res.status(200).json({
      success: true,
      products,
      totalProducts,
    });
  } catch (error) {
    next(error);
  }
};


export const updateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params; // get slug from URL
    const product = await Products.findOne({ slug });
    if (!product) {
      return next(errorHandler(404, "No product found"));
    }

    const updatedData = {
      ...req.body,
      slug: req.body.name ? slugify(req.body.name) : product.slug,
    };

    const updatedProduct = await Products.findOneAndUpdate(
      { slug },
      { $set: updatedData },
      { new: true } 
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Products.findById(id);
        if (!product) {
            return next(errorHandler(404, 'No product found'))
        }
        await Products.findByIdAndDelete(id)
        res.status(200).json({success:true, message: 'product deleted successfully'})
    } catch (error) {
        next(error)
    }
}


export const addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Products.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "Product already reviewed",
      });
    }

    const review = {
      user: req.user.id,
      name: req.user.username,
      avatar: req.user.avatar?.url,   // important fix
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    await product.save();

    const updatedProduct = await Products.findById(req.params.id)
      .populate("category")
      .populate("reviews.user", "username avatar role");

    res.status(201).json({
      success: true,
      message: "Review added",
      product: updatedProduct,
    });

  } catch (error) {
    next(error);
  }
};

export const deleteProductReview = async (req, res, next) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Products.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find review
    const review = product.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // ONLY OWNER OR ADMIN CAN DELETE
    if (
      review.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Remove review
    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== reviewId
    );

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};