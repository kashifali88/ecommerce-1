import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { removeFromCart, setCartItems } from "../redux/cartSlice";
import { Link } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
 // FETCH CART FROM BACKEND
  const fetchCart = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/cart', {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

    setCart(Array.isArray(data) ? data : []);
    dispatch(setCartItems(Array.isArray(data) ? data : []));
    } catch (error) {
      toast.error(error.message);
    }finally {
      setLoading(false)
    }
  };

  //  LOAD CART ON PAGE LOAD
  useEffect(() => {
    fetchCart();
  }, []);

  // UPDATE QUANTITY
  const handleUpdateQuantity = async (id, quantity) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      toast.success("Quantity updated");
      fetchCart();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // DELETE ITEM
  const handleRemoveItem = async (id) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("Item removed");
      fetchCart(); 
    } catch (error) {
      toast.error(error.message);
    }
  };

  //  TOTAL PRICE
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.product?.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen pt-20 bg-gray-50">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <p className="text-gray-500 mt-1">
          Review your selected products
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {/* CART CONTENT */}
      {!loading && (
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-3 gap-8">

          {/* LEFT: ITEMS */}
          <div className="lg:col-span-2 space-y-4">

            {cart.length === 0 ? (
              <div className="text-center text-gray-500">
                Your cart is empty
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 bg-white p-4 rounded-xl shadow hover:shadow-md transition"
                >
                  {/* IMAGE */}
                  <img
                    src={item.product.productImage}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">
                      {item.product.name}
                    </h2>

                    <p className="text-gray-500 text-sm">
                      RS {item.product.price}
                    </p>

                    {/* QUANTITY */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-600">
                        Qty:
                      </span>
                      <span className="px-3 py-1 border rounded">
                        {item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* REMOVE BUTTON */}
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="bg-white p-6 rounded-xl shadow h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Total Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span>Total Price</span>
              <span className="font-bold">
                RS {totalPrice.toFixed(2)}
              </span>
            </div>

            <Link to='/checkout'>
            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
              Checkout
            </button>
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;






