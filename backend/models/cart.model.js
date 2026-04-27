import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    quantity: { type : Number, required: true},
    product: { type: mongoose.ObjectId, ref: 'Products', required: true},
    user:{ type: mongoose.ObjectId, ref: 'User', required: true},
    
})


export default mongoose.model('cart', cartSchema)