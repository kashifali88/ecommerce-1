import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        setError(data.message || "Failed to sign-up.");
      } else {
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-yellow-400 via-black to-black">
      {/* CARD */}
      <div className="w-full max-w-md bg-gray-900 text-white rounded-2xl shadow-2xl p-8">
        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Create Account
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* USERNAME */}
          <input
            type="text"
            placeholder="Username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />

          {/* BUTTON */}
          <button
            type="submit"
            className="flex items-center justify-center cursor-pointer hover:bg-yellow-300 bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition duration-300"
          >
            {loading ? <Spinner /> : "Sign Up"}
          </button>
        </form>

        {/* GOOGLE SIGNUP */}

        <div className="mt-3">
          <OAuth />
        </div>

        {/* FOOTER */}
        <p className="text-sm text-center mt-6 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
