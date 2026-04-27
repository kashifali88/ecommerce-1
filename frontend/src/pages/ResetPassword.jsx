import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const { token } = useParams();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
try {
setLoading(true);
   if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
  
    const res = await fetch(`/api/auth/reset-password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    if (!res.ok) {
      toast.error(data.message)
    }
    toast.success("Password successfully changed");
    navigate('/login')

} catch (error) {
  toast.error(error.message)
} finally {
  setLoading(false)
}
   
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-yellow-400 via-black to-black">
      
      <div className="w-full max-w-md bg-gray-900 text-white rounded-2xl shadow-2xl p-8">
        
        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center mb-6">
          Reset Password
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <input
            type="password"
            placeholder="New Password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />

          <button
            type="submit"
            className="flex items-center justify-center bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition"
          >
           {loading ? (
            <Spinner />
           ) :  "Reset Password" 
           }
          </button>
        </form>

        {/* BACK */}
        <p className="text-sm text-center mt-6 text-gray-400">
          Remember password?{" "}
          <span
            onClick={() => navigate("/sign-in")}
            className="text-yellow-500 cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}