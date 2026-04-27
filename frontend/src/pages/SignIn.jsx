import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInFailure, signInSuccess } from "../redux/userSlice";
import OAuth from "../components/OAuth";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export default function SignIn() {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const { loading, error } = useSelector((state) => state.user)
  const dispatch = useDispatch();
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
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.login);
      const body = isEmail
        ? { email: formData.login, password: formData.password }
        : { username: formData.login, password: formData.password };
      dispatch(signInStart());
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        dispatch(signInFailure(data.message || "Login failed"));
      } else {
        dispatch(signInSuccess(data.userWithoutPassword));
        toast.success(data.message || "Login successful");
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure("An error occurred during login"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-yellow-400 via-black to-black">
      {/* CARD */}
      <div className="w-full max-w-md bg-gray-900 text-white rounded-2xl shadow-2xl p-8">
        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Please Login
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* USERNAME or EMAIL */}
          <input
            type="text"
            placeholder="Username or Email"
            id="login"
            value={formData.login}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 outline-none focus:ring-2 focus:ring-yellow-500"
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
            className="flex items-center justify-center bg-yellow-500 cursor-pointer text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition duration-300"
          >
            {loading ? <Spinner /> : "Sign In"}
          </button>
        </form>
        {/* OAuth outside form */}
        <div className="mt-3">
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <OAuth />
        </div>

        {/* FOOTER */}
        <div className="flex justify-between text-sm text-center mt-4 text-gray-400">
      
         <p>Don't have an account?{" "}
          <Link to="/register" className="text-sm text-yellow-500 hover:underline">
            Sign Up
          </Link>
          </p> 
          <Link to="/forgot-password">
          Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
