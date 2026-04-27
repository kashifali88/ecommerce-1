import { FaShippingFast, FaLock, FaHeadset } from "react-icons/fa";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-16 px-6">
      
      {/* CONTAINER */}
      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">
            About Our Store
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            We provide high-quality products at the best prices. Our goal is to
            deliver a smooth shopping experience with trust, speed, and reliability.
          </p>
        </div>

        {/* IMAGE + TEXT */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          
          {/* IMAGE */}
          <img
            src="https://images.unsplash.com/photo-1556740749-887f6717d7e4"
            alt="store"
            className="rounded-2xl shadow-lg object-cover h-[300px] w-full"
          />

          {/* TEXT */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Who We Are
            </h2>
            <p className="text-gray-300 mb-3">
              We are an online eCommerce platform focused on delivering top-quality
              products directly to your doorstep. From electronics to fashion,
              we ensure every item meets our quality standards.
            </p>

            <p className="text-gray-400">
              Our mission is simple: make online shopping easy, affordable, and fast.
            </p>
          </div>
        </div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* CARD 1 */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow hover:scale-105 transition">
            <FaShippingFast className="text-yellow-400 text-3xl mb-4" />
            <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-400 text-sm">
              Get your products delivered quickly and safely to your doorstep.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow hover:scale-105 transition">
            <FaLock className="text-yellow-400 text-3xl mb-4" />
            <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-400 text-sm">
              Your transactions are 100% secure with trusted payment systems.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow hover:scale-105 transition">
            <FaHeadset className="text-yellow-400 text-3xl mb-4" />
            <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-400 text-sm">
              Our support team is always available to help you anytime.
            </p>
          </div>

        </div>

        {/* FOOTER TEXT */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Ecommerce. All rights reserved.
        </div>

      </div>
    </div>
  );
}