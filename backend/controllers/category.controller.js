import Category from "../models/category.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import slugify from 'slugify'



export const createCategory = async (req, res, next) => {
    try {
        const {name} = req.body;
        if(!name) {
            return next(errorHandler(401, 'Name is required'))
        }
        const existingCategory = await Category.findOne({name});
        if (existingCategory){
            return next(errorHandler(200, 'Category already exist'))
        }
        const category = new Category({name, slug:slugify(name)});
        await category.save();
        res.status(201).json({success:true, message:'Category created successfully', category})
    } catch (error) {
        next(error)
    }  
}

export const updateCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const {name} = req.body;
        const category = await Category.findById(id);
        if (!category) {
            return next(errorHandler(404,'No category found'))
        }
        console.log("BODY:", req.body);
console.log("NAME:", req.body.name);
        const updatedCategory = await Category.findByIdAndUpdate(id,{ name, slug:slugify(name)}, {new:true});
        res.status(201).json({success:true, message:'Category successfully updated',updatedCategory})

    } catch (error) {
        next(error);
    }
}

export const getAllCategory = async (req, res, next) => {
    try {
        const category = await Category.find({});
    res.status(200).json({success:true, category}) 
    } catch (error) {
        next(error)
    }
   
}

export const getCategory = async (req, res, next) => {
    try {
        const category = await Category.findOne({slug:req.params.slug})
        if (!category) {
            return next(errorHandler(404,'No category found'))
        }
        res.status(200).json({success:true, category})
    } catch (error) {
        next(error)
    } 
}

export const deleteCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (req.user.role !== 'admin') {
            return next(errorHandler(401, 'You are not authorized'))
        }
        await Category.findByIdAndDelete(id);
        res.status(200).json('Category deleted')
    } catch (error) {
        next(error)
    }
}
