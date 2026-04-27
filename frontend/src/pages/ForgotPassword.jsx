import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify'
import Spinner from "../components/Spinner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
    const API = import.meta.env.VITE_BACKEND_URL;


  const handleSubmit = async(e) => {
    try {
          e.preventDefault();
    if (!email) return;
    setLoading(true);
    const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email})
    })
    const data = await res.json();
    if (!res.ok){
        throw new Error(data.message);
    }
    toast.success("Reset password link sent to your email")
    setEmail("")
   
    } catch (error) {
        toast.error(error.message)
    } finally {
        setLoading(false);
    }
}
 

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-yellow-400 via-black to-black">
      
      <div className="w-full max-w-md bg-gray-900 text-white rounded-2xl shadow-2xl p-8">
        
        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center mb-3">
          Forgot Password
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-400 text-center mb-6 text-sm">
          Enter your email to receive a reset link
        </p>

       

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 rounded-lg bg-gray-800 outline-none focus:ring-2 focus:ring-yellow-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="flex items-center justify-center bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition"
          >
            {loading ? (
                <Spinner />
            ) : "Send Reset Link"
        }
          </button>
        </form>

        {/* BACK */}
        <p className="text-sm text-center mt-6 text-gray-400">
          Back to{" "}
          <Link to="/login" className="text-yellow-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}