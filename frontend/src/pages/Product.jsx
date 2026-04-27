import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toast } from "react-toastify";

export default function Product() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loadingReview, setLoadingReview] = useState(false);
    const API = import.meta.env.VITE_BACKEND_URL;


  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  // =========================
  // FETCH PRODUCT
  // =========================
  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API}/api/products/get-product/${slug}`);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message);
      }

      setProduct(data.product);
      setReviews(data.product.reviews || []);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = () => {
    if (!currentUser) {
      return toast.error("Please login first");
    }

    dispatch(addToCart({ product, quantity: 1 }));
    toast.success("Added to cart");
  };

  // =========================
  // SUBMIT REVIEW
  // =========================
  const handleSubmitReview = async () => {
    if (!currentUser) {
      return toast.error("Please login first");
    }

    if (!rating || !comment) {
      return toast.error("Please add rating and comment");
    }

    try {
      setLoadingReview(true);

      const res = await fetch(`${API}/api/products/${product._id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("Review added");

      setProduct(data.product);
      setReviews(data.product.reviews || []);

      setRating(0);
      setComment("");

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingReview(false);
    }
  };

  // =========================
  // DELETE REVIEW
  // =========================
  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await fetch(
        `${API}/api/products/${product._id}/reviews/${reviewId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("Review deleted");

      setProduct(data.product);
      setReviews(data.product.reviews || []);

    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!product) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 min-h-screen pt-16">

      {/* ================= PRODUCT ================= */}
      <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-2xl shadow-lg">

        <img
          src={product.productImage}
          alt={product.name}
          className="w-full h-[400px] object-cover rounded-xl"
        />

        <div className="flex flex-col gap-4">

          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-2xl text-blue-600 font-bold">
            RS {product.price}
          </p>

          <p className="text-gray-600">{product.description}</p>

          <p className={product.quantity > 0 ? "text-green-600" : "text-red-500"}>
            {product.quantity > 0
              ? `In Stock (${product.quantity})`
              : "Out of Stock"}
          </p>

          {product.shipping && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded w-fit">
              Free Shipping
            </span>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
            className="bg-black text-white py-3 rounded-xl disabled:bg-gray-400"
          >
            Add To Cart
          </button>
        </div>
      </div>

      {/* ================= REVIEWS ================= */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">

        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {/* REVIEW FORM */}
        <div className="space-y-3 mb-8">

          <div className="flex gap-1">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                onClick={() => setRating(index + 1)}
                className={`cursor-pointer ${
                  index < rating ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full border p-3 rounded"
          />

          <button
            onClick={handleSubmitReview}
            disabled={loadingReview}
            className="bg-black text-white px-5 py-2 rounded"
          >
            {loadingReview ? "Submitting..." : "Submit Review"}
          </button>
        </div>

        {/* REVIEW LIST */}
        <div className="space-y-4">

          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="border p-4 rounded flex gap-3">

                {/* AVATAR */}
                <img
                  src={
                    r.user?.avatar?.url ||
                    r.user?.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex-1">

                  {/* NAME + DELETE */}
                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        {r.user?.username}
                      </p>

                      {r.user?.role === "admin" && (
                        <span className="text-xs bg-black text-white px-2 py-0.5 rounded">
                          admin
                        </span>
                      )}
                    </div>

                    {/* DELETE BUTTON */}
                    {(currentUser?._id === r.user?._id ||
                      currentUser?.role === "admin") && (
                      <button
                        onClick={() => handleDeleteReview(r._id)}
                        className="cursor-pointer hover:underline text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {/* STARS */}
                  <div className="flex text-yellow-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>

                  {/* COMMENT */}
                  <p className="text-gray-600">{r.comment}</p>

                </div>
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}