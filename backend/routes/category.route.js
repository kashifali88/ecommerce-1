
import express from 'express';
import { verifyToken } from '../utils/verifyToken.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';
import { createCategory, deleteCategory } from '../controllers/category.controller.js';
import { updateCategory } from '../controllers/category.controller.js';
import { getAllCategory } from '../controllers/category.controller.js';
import { getCategory } from '../controllers/category.controller.js';

const categoryRouter = new express.Router();

categoryRouter.post('/create-category', verifyToken, verifyAdmin, createCategory);
categoryRouter.put('/update-category/:id', verifyToken, verifyAdmin, updateCategory);
categoryRouter.get('/', getAllCategory);
categoryRouter.get('/:slug', getCategory);
categoryRouter.delete('/:id',verifyToken, verifyAdmin, deleteCategory);


export default categoryRouter; 