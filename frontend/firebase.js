// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ecommerce-1-fa43f.firebaseapp.com",
  projectId: "ecommerce-1-fa43f",
  storageBucket: "ecommerce-1-fa43f.firebasestorage.app",
  messagingSenderId: "493591279897",
  appId: "1:493591279897:web:85db2cc7332aa4b4dbad88"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);