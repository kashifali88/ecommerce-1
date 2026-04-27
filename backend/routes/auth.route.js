import { forgotPassword, google, login, logout, register, resetPassword } from "../controllers/auth.controller.js";
import express from 'express'

const authRouter = new express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/google', google);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', resetPassword);

export default authRouter;