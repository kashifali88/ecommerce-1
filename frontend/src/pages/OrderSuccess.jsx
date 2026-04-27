import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCartItems } from "../redux/cartSlice";
import { toast } from "react-toastify";

function OrderSuccess() {
  const dispatch = useDispatch();

  // clear cart on success page load
  useEffect(() => {
    dispatch(setCartItems([]));
    localStorage.removeItem("cart");
    toast.success("Order placed successfully!");
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md w-full">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 flex items-center justify-center rounded-full">
            <span className="text-4xl">✔</span>
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-gray-800">
          Order Successful
        </h1>

        <p className="text-gray-500 mt-2">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {/* BUTTONS */}
        <div className="mt-6 flex flex-col gap-3">

          <Link
            to="/dashboard/orders"
            className="bg-black text-white py-3 rounded-lg hover:bg-gray-800"
          >
            View My Orders
          </Link>

          <Link
            to="/products"
            className="border border-gray-300 py-3 rounded-lg hover:bg-gray-100"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}

export default OrderSuccess;