import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
    const API = import.meta.env.VITE_BACKEND_URL;


  const { currentUser } = useSelector((state) => state.user);


  const fetchOrders = async () => {
    try {
      setLoading(true);

      const url = currentUser?.role === "admin"
        ? `${API}/api/orders`
        : `${API}/api/orders/my`;

      const res = await fetch(url, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setOrders(data.orders);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (currentUser) {
    fetchOrders();
  }
}, [currentUser]);
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold">
          {currentUser?.role === "admin" ? "All Orders" : "My Orders"}
        </h1>
      </div>

      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {!loading && (
        <div className="max-w-6xl mx-auto px-6 space-y-4">

          {orders.length === 0 && (
            <p className="text-gray-500 text-center">
              No orders found
            </p>
          )}

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-5 rounded-xl shadow"
            >
              {/* ORDER HEADER */}
              <div className="flex justify-between mb-3">
                <div>
                  <p className="font-semibold">
                    Order ID: {order._id}
                  </p>

                  {currentUser?.isAdmin && (
                    <p className="text-sm text-gray-500">
                      User: {order.user?.username}
                    </p>
                  )}
                </div>

                <span className="font-bold">
                  RS {order.totalPrice.toFixed(2)}
                </span>
              </div>

              {/* ITEMS */}
              <div className="space-y-2">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">

                    <img
                      src={item.image}
                      alt=""
                      className="w-14 h-14 rounded object-cover"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="text-sm">
                      RS {(item.price * item.quantity).toFixed(2)}
                    </div>

                  </div>
                ))}
              </div>

              {/* STATUS */}
              <div className="mt-3 flex justify-between text-sm">
                <span>
                  Payment: {order.paymentMethod}
                </span>

                <span className={order.isPaid ? "text-green-600" : "text-red-500"}>
                  {order.isPaid ? "Paid" : "Not Paid"}
                </span>
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Orders;