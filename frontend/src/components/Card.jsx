import React from "react";
import { FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toast } from "react-toastify";

export default function Card({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const API = import.meta.env.VITE_BACKEND_URL;

  // =========================
  // CALCULATE AVERAGE RATING
  // =========================
  const avgRating =
    product?.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length
      : 0;

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API}/api/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ product: product._id, quantity: 1 }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message);
      }

      dispatch(addToCart({ product, quantity: 1 }));
      toast.success("Product added to cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden group flex flex-col h-full">

      {/* IMAGE */}
      <div className="overflow-hidden aspect-[1/1]">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.productImage || "https://dummyimage.com/300x300"}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
          />
        </Link>
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col justify-between flex-1">

        <div className="flex flex-col gap-2">

          {/* NAME */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm md:text-lg font-semibold line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* DESCRIPTION */}
          <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
            {product.description}
          </p>

          {/* STARS + REVIEWS */}
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`${
                  index < Math.round(avgRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}

            <span className="text-xs text-gray-500">
              ({product.reviews?.length || 0})
            </span>
          </div>

          {/* PRICE */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-xl font-bold text-blue-600">
              Rs {product.price}
            </span>

            {product.quantity <= 6 && product.quantity > 0 && (
              <p className="text-xs text-red-500 font-medium animate-pulse">
                Only {product.quantity} left 🔥
              </p>
            )}
          </div>

          {/* SHIPPING */}
          {product.shipping && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded w-fit">
              Free Shipping
            </span>
          )}
        </div>

        {/* BUTTON */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={handleAddToCart}
            className="cursor-pointer bg-black text-white text-center py-2 rounded-lg hover:bg-gray-800 transition"
          >
            ADD TO CART
          </button>
        </div>

      </div>
    </div>
  );
}