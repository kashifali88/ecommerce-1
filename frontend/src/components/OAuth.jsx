import React from 'react'
import { useDispatch } from 'react-redux';
import { getAuth } from "firebase/auth";
import { app } from '../../firebase.js';
import { signInFailure, signInStart, signInSuccess } from '../redux/userSlice'; 
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const API = import.meta.env.VITE_BACKEND_URL;

  const handleGoogleSignIn = async(e) => {
e.preventDefault();
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Send user info to backend for authentication
      dispatch(signInStart());
      const res = await fetch(`${API}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          username: user.displayName,
          email: user.email,
          avatar: user.photoURL,})
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        toast.error(data.message)
        dispatch(signInFailure(data.message || "Google sign-in failed"))
        return;
      }
      dispatch(signInSuccess(data.userWithoutPassword));
      toast.success(data.message || "Google sign-in successful");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      dispatch(signInFailure("An error occurred during Google sign-in"))
    }
  }
  return (
    <form onSubmit={handleGoogleSignIn}>
        <button className='bg-red-500 w-full cursor-pointer text-white font-semibold py-3 rounded-lg hover:bg-red-400 transition duration-300' type="submit">Sign in with Google</button>
    </form>
  )
}

