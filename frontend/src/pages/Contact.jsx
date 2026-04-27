import { useState } from "react";
import { toast } from "react-toastify";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (!res.ok) {
    toast.error(data.message);
    return;
  }

  toast.success("Message sent!");
  setForm({ name: "", email: "", message: "" });
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center pt-16">
      
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700">

        {/* LEFT SIDE INFO */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-yellow-400">
            Contact Us
          </h1>

          <p className="text-gray-300">
            We’re here to help you 24/7. Whether you have questions about
            products, orders, or support — feel free to reach out.
          </p>

          <div className="space-y-4 text-gray-300">
            <div className="flex items-center gap-3">
              <FaPhone className="text-yellow-400" />
              <span>+92 319 5378220</span>
            </div>

            <div className="flex items-center gap-3">
              <FaEnvelope className="text-yellow-400" />
              <span>kashifzan28406@gmail.com</span>
            </div>

            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-yellow-400" />
              <span>KPK, District Buner, Pakistan</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-black/40 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">
              💡 Tip: We usually respond within 24 hours.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold mb-2">
            Send a Message
          </h2>

          <input
            type="text"
            id="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-yellow-400"
          />

          <input
            type="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-yellow-400"
          />

          <textarea
            id="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message..."
            rows="5"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-yellow-400"
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}