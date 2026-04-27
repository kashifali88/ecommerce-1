import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import Spinner from "../components/Spinner";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const [showFilter, setShowFilter] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
    const API = import.meta.env.VITE_BACKEND_URL;


  // ============================
  // FETCH PRODUCTS
  // ============================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      let url = `${API}/api/products/filter?`;

      if (category) url += `category=${category}&`;
      if (search) url += `search=${search}&`;
      if (minPrice) url += `minPrice=${minPrice}&`;
      if (maxPrice) url += `maxPrice=${maxPrice}&`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to fetch");
      }

      setProducts(data.products);
    } catch (error) {
      toast.error(error.message, { toastId: "products-error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category, search]);

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  return (
    <div className="min-h-screen pt-16 bg-gray-50">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-6 py-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">
          {search
            ? `Search: "${search}"`
            : category
            ? "Filtered Products"
            : "All Products"}
        </h1>

        <p className="text-gray-500 mt-2">
          Discover high-quality items curated for you
        </p>

        {/* ✅ ADD FILTER BUTTON */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="mt-4 bg-black text-white px-5 py-2 rounded"
        >
          {showFilter ? "Hide Filter" : "Add Filter"}
        </button>

        {/* ✅ FILTER UI */}
        {showFilter && (
          <div className="mt-6 flex flex-col md:flex-row gap-3 justify-center items-center">

            <input
              type="number"
              placeholder="Min Price"
              className="border p-2 rounded w-40"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />

            <input
              type="number"
              placeholder="Max Price"
              className="border p-2 rounded w-40"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />

            <button
              onClick={fetchProducts}
              className="bg-blue-600 text-white px-5 py-2 rounded"
            >
              Apply
            </button>

            <button
              onClick={() => {
                setMinPrice("");
                setMaxPrice("");
                fetchProducts();
              }}
              className="bg-gray-400 text-white px-5 py-2 rounded"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {/* PRODUCTS */}
      {!loading && (
        <div className="max-w-6xl mx-auto px-6 pb-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <Card key={product._id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No products found
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Products;