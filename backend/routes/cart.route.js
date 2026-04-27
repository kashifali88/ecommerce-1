import express from 'express'
import { addToCart, deleteFromCart, getUserCart, updateCart } from '../controllers/cart.controller.js';
import {verifyToken} from '../utils/verifyToken.js'

const cartRouter = new express.Router();

cartRouter.get('/', verifyToken, getUserCart);
cartRouter.post('/',verifyToken, addToCart);
cartRouter.put('/:id',verifyToken, updateCart);
cartRouter.delete('/:id',verifyToken, deleteFromCart);


export default cartRouter;

