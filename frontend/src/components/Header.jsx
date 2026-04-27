import React, { useRef, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaSearch, FaShopify } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/userSlice";
import { toast } from "react-toastify";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const desktopDropdownRef = useRef();

  const totalQuantity = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // CLOSE PROFILE WHEN USER CHANGES
  useEffect(() => {
    setProfileOpen(false);
  }, [currentUser]);

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess());
      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
      dispatch(signOutUserFailure("Logout error"));
    }
  };

  // SEARCH
  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/products?search=${search}`);
    setSearch("");
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-gray-950 text-white shadow-md h-16">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">

        {/* LOGO */}
        <Link className="flex items-center space-x-2" to="/">
          <h1 className="text-xl md:text-2xl font-bold">ECOMMERCE</h1>
          <FaShopify className="hidden md:inline text-yellow-400 text-2xl" />
        </Link>

        {/* SEARCH */}
        <div className="bg-white flex items-center px-3 py-2 rounded-full w-40 md:w-60">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            type="text"
            placeholder="Search products..."
            className="outline-none text-black w-full"
          />
          <FaSearch
            onClick={handleSearch}
            className="text-gray-500 hover:text-yellow-500 cursor-pointer"
          />
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center gap-6">

          <NavLink to="/" className="hover:text-yellow-400">Home</NavLink>
          <NavLink to="/products" className="hover:text-yellow-400">Products</NavLink>
          <NavLink to="/contact" className="hover:text-yellow-400">Contact</NavLink>
          <NavLink to="/about" className="hover:text-yellow-400">About</NavLink>

          {/* PROFILE */}
          {currentUser ? (
            <div ref={desktopDropdownRef} className="relative">
              <img
                src={currentUser.avatar}
                alt="profile"
                className="w-9 h-9 rounded-full cursor-pointer object-cover border hover:border-yellow-400"
                onClick={() => setProfileOpen(!profileOpen)}
              />

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white text-black rounded-xl shadow-lg overflow-hidden">
                  <div className="p-3 border-b">
                    <p className="font-semibold">{currentUser.username}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>

                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}

          {/* CART */}
          <div className="relative">
            <NavLink to="/cart">
              <FaShopify className="text-2xl" />
            </NavLink>
            <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {totalQuantity}
            </span>
          </div>
        </ul>

        {/* MOBILE RIGHT SIDE */}
        <div className="flex items-center gap-4 md:hidden">

          {/* CART */}
          <Link to="/cart" className="relative">
            <FaShopify className="text-2xl" />
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {totalQuantity}
            </span>
          </Link>

          {/* MENU BUTTON */}
          <div onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars className="text-xl" />
          </div>
        </div>
      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* MOBILE MENU */}
      <div
        className={`fixed right-0 top-0 h-full w-64 bg-gray-950 z-50 transition-transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 text-white">
          <h2 className="text-xl font-bold mb-6">Menu</h2>

          <ul className="flex flex-col gap-4">

            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>

            <Link to="/cart" onClick={() => setMenuOpen(false)}>
              Cart ({totalQuantity})
            </Link>

            {currentUser ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <span
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-red-500 cursor-pointer"
                >
                  Logout
                </span>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            )}

          </ul>
        </div>
      </div>
    </div>
  );
}