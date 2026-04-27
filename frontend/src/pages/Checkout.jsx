import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useDispatch } from "react-redux";
import { setCartItems } from "../redux/cartSlice";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  // =========================
  // FETCH CART
  // =========================
  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/cart", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setCart(Array.isArray(data) ? data : []);
      dispatch(setCartItems(Array.isArray(data) ? data : []));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // =========================
  // TOTAL
  // =========================
  const totalPrice = cart.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // PLACE ORDER (FIXED STRIPE + COD)
  // =========================
  const handlePlaceOrder = async () => {
    if (!form.fullName || !form.phone || !form.address || !form.city) {
      return toast.error("Please fill all required fields");
    }

    if (cart.length === 0) {
      return toast.error("Cart is empty");
    }

    try {
      setPlacing(true);

      // =========================
      // 🔥 STRIPE FLOW (FIX)
      // =========================
      if (paymentMethod === "STRIPE") {
        const res = await fetch("/api/stripe/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        // 👉 REDIRECT TO STRIPE
        window.location.href = data.url;
        return;
      }

      // =========================
      // 💰 COD FLOW (NORMAL ORDER)
      // =========================
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          shippingInfo: form,
          paymentMethod: "COD",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("Order placed successfully");

      setCart([]);
      dispatch(setCartItems([]));

    } catch (error) {
      toast.error(error.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {!loading && (
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-bold mb-4">Shipping Info</h2>

              <div className="grid gap-3">
                <input name="fullName" placeholder="Full Name" onChange={handleChange} className="border p-3 rounded" />
                <input name="phone" placeholder="Phone" onChange={handleChange} className="border p-3 rounded" />
                <input name="address" placeholder="Address" onChange={handleChange} className="border p-3 rounded" />
                <input name="city" placeholder="City" onChange={handleChange} className="border p-3 rounded" />
                <input name="postalCode" placeholder="Postal Code" onChange={handleChange} className="border p-3 rounded" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-bold mb-4">Payment Method</h2>

              <label className="flex items-center gap-3 border p-3 rounded cursor-pointer mb-2">
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery
              </label>

              <label className="flex items-center gap-3 border p-3 rounded cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "STRIPE"}
                  onChange={() => setPaymentMethod("STRIPE")}
                />
                Stripe (Card)
              </label>
            </div>

          </div>

          {/* RIGHT */}
          <div className="bg-white p-6 rounded-xl shadow h-fit">

            <h2 className="font-bold mb-4">Order Summary</h2>

            <div className="space-y-4 max-h-72 overflow-y-auto">

              {cart.map((item) => (
                <div key={item._id} className="flex gap-3 items-center">

                  <img
                    src={item.product?.productImage}
                    className="w-16 h-16 rounded object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {item.product?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-sm font-semibold">
                    RS {(item.product?.price * item.quantity).toFixed(2)}
                  </div>

                </div>
              ))}

            </div>

            <div className="border-t mt-4 pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>RS {totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full mt-6 bg-black text-white py-3 rounded-lg disabled:opacity-50"
            >
              {placing ? "Placing..." : "Place Order"}
            </button>

          </div>

        </div>
      )}
    </div>
  );
}

export default Checkout;