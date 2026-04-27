import express from 'express';
import { deleteUser, getUser, getUsers, login, register, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js'

const userRouter = new express.Router();


userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.put('/:id', verifyToken, updateUser);
userRouter.delete('/:id', verifyToken, deleteUser);

export default userRouter;