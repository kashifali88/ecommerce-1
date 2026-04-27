import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import productRouter from './routes/product.route.js';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import orderRouter from './routes/order.route.js';
import contactRouter from './routes/contact.route.js';
import categoryRouter from './routes/category.route.js';
import cartRouter from './routes/cart.route.js';
import stripeRouter from './routes/stripe.route.js';

dotenv.config()


const server = express();

// middlewares
            
server.use(express.json());
server.use(cookieParser()); 



// API routes
server.use("/api/products", productRouter);
server.use("/api/user", userRouter);
server.use("/api/auth", authRouter);
server.use("/api/orders", orderRouter);
server.use("/api/contact", contactRouter);
server.use("/api/category", categoryRouter);
server.use("/api/cart", cartRouter);
server.use("/api/stripe", stripeRouter);
// error middleware
server.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal server error"

    res.status(status).json({
        success:false,
        message,
        stack: err.stack

    })
})


// MongoDB connection 

const connect = async () => {
    try {
            await mongoose.connect(process.env.MONGODB_URI)
            console.log("Successfully connected to MongoDB")

    } catch (error) {
            console.log("MongoDB connection failed", error);
        
    }
}

const PORT = process.env.PORT || 5000;
// server
server.listen(PORT, () => {
    console.log(`Server is working on PORT: ${PORT}`);
    connect()
    
})


