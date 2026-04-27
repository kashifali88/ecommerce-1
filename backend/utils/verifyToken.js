import jwt from 'jsonwebtoken'
import { errorHandler } from './errorHandler.js';

export const verifyToken =  (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return next(errorHandler(401, 'You are not authorized'));
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return next(errorHandler(403, 'Forbidden'));
        req.user = user;
        next();
    })

    
}