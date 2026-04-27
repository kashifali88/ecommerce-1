import Cart from "../models/cart.model.js"


export const getUserCart = async (req, res) => {
  const {id} = req.user;
  try {
    const cartItems = await Cart.find({user:id}).populate('product').populate('user', 'username');

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const addToCart = async (req, res) => {
  const { id } = req.user;

  try {
    const cart = new Cart({
      product: req.body.product,
      quantity: req.body.quantity,
      user: id
    });

    const savedCart = await cart.save();

    const result = await savedCart.populate('product user', 'name username');

    res.status(201).json(result); 
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
export const deleteFromCart = async (req, res) => {
    const { id } = req.params;
    try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateCart = async (req, res) => {
  const { id } = req.params; // cart document id
  const { quantity } = req.body;

  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      id,
      { quantity },
      { new: true, returnDocument: 'after' }
    ).populate('product user', 'name username'); 

    if (!updatedCart) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
