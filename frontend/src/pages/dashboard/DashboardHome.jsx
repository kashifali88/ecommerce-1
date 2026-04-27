import React from "react";
import { useSelector } from "react-redux";
import { FaBox, FaUsers, FaShoppingCart } from "react-icons/fa";

function DashboardHome() {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === "admin";

  return (
    <div className="flex-1">
      {/* TOP BAR */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Welcome, {currentUser.username}
        </h2>

        <img
          src={
            currentUser.avatar ||
            currentUser.profileImage ||
            "/default.png"
          }
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border"
        />
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {/* STATS */}
        <div
          className={`grid grid-cols-1 ${
            isAdmin ? "md:grid-cols-3" : "md:grid-cols-1"
          } gap-6`}
        >
          {isAdmin ? (
            <>
              <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
                <FaShoppingCart className="text-3xl text-blue-500" />
                <div>
                  <p className="text-gray-500">Total Orders</p>
                  <h3 className="text-xl font-bold">120</h3>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
                <FaBox className="text-3xl text-green-500" />
                <div>
                  <p className="text-gray-500">Products</p>
                  <h3 className="text-xl font-bold">54</h3>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
                <FaUsers className="text-3xl text-purple-500" />
                <div>
                  <p className="text-gray-500">Users</p>
                  <h3 className="text-xl font-bold">340</h3>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
              <FaShoppingCart className="text-3xl text-blue-500" />
              <div>
                <p className="text-gray-500">My Orders</p>
                <h3 className="text-xl font-bold">0</h3>
              </div>
            </div>
          )}
        </div>

        {/* ROLE SECTION */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-2">
            {isAdmin ? "Admin Panel" : "User Panel"}
          </h3>

          <p className="text-gray-600">
            {isAdmin
              ? "You have full access to manage products, users and orders."
              : "You can view orders, manage profile and shop products."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;