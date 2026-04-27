import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaShopify } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-10  border-t-2 border-yellow-400 rounded-t-lg">
      
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">

        {/* LOGO / BRAND */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-xl font-bold text-white">ECOMMERCE</h1>
            <FaShopify className="text-yellow-500 text-2xl" />
          </div>
          <p className="text-sm text-gray-400">
            Your trusted online store for premium products at the best prices.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h2 className="text-white font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-yellow-400" to="/">Home</Link></li>
            <li><Link className="hover:text-yellow-400" to="/products">Products</Link></li>
            <li><Link className="hover:text-yellow-400" to="/contact">Contact</Link></li>
            <li><Link className="hover:text-yellow-400" to="/about">About</Link></li>
          </ul>
        </div>

        {/* CUSTOMER */}
        <div>
          <h2 className="text-white font-semibold mb-3">Customer</h2>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-yellow-400" to="/cart">Cart</Link></li>
            <li><Link className="hover:text-yellow-400" to="/login">Login</Link></li>
            <li><Link className="hover:text-yellow-400" to="/policy">Privacy Policy</Link></li>
            <li><Link className="hover:text-yellow-400" to="/orders">Orders</Link></li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h2 className="text-white font-semibold mb-3">Follow Us</h2>
          <div className="flex gap-4 text-lg">
            <FaFacebookF className="hover:text-blue-500 cursor-pointer" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            <FaTwitter className="hover:text-blue-400 cursor-pointer" />
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} ECOMMERCE. All rights reserved.
      </div>

    </footer>
  );
}