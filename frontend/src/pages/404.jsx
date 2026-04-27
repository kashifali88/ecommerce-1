import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen mt-16 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-yellow-500 px-6">
      
      <div className="text-center text-white max-w-lg">
        
        {/* BIG 404 */}
        <h1 className="text-7xl md:text-9xl font-extrabold text-yellow-400 drop-shadow-lg">
          404
        </h1>

        {/* TITLE */}
        <h2 className="text-2xl md:text-3xl font-semibold mt-4">
          Page Not Found
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-300 mt-3">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* BUTTONS */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          
          <Link
            to="/"
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Go Home
          </Link>

          <Link
            to="/products"
            className="border border-yellow-500 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 hover:text-black transition"
          >
            Browse Products
          </Link>

        </div>
      </div>
    </div>
  );
}