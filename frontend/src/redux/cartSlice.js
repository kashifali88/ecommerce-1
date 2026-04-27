import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state,action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);
            if (existItem) {
                existItem.quantity +=1;
            } else {
                state.cartItems.push({...item, quantity:1})
            }
            localStorage.setItem("cart", JSON.stringify(state.cartItems));
        },
        removeFromCart: (state,action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            localStorage.setItem("cart", JSON.stringify(state.cartItems))
        },
        updateQuantity: (state,action) => {
            const {id, quantity} = action.payload;
            const item = state.cartItems.find((x) => x._id === id);
            if (item) {
                item.quantity = quantity
                localStorage.setItem("cart", JSON.stringify(state.cartItems))
            }
        },
        setCartItems: (state, action) => {
            state.cartItems = action.payload
        },
      
    }
});

export const {addToCart, updateQuantity, removeFromCart, setCartItems} = cartSlice.actions;
export default cartSlice.reducer;