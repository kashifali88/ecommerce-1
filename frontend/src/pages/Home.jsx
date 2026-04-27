import Slider from "../components/Slider";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const navigate = useNavigate();
    const API = import.meta.env.VITE_BACKEND_URL;


  // CATEGORY IMAGE MAP
  const categoryImages = {
    Men: "https://images.unsplash.com/photo-1523381294911-8d3cead13475",
    Women: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    Electronics: "https://cdn.pixabay.com/photo/2015/01/21/14/14/apple-606761_1280.jpg",
    Accessories: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQekOGGRuah7FnfTDFlXmu-xKkZrSXqdkkGFg&s",
    Kids: "https://img.freepik.com/premium-photo/children-enjoy-shopping-red-background-visiting-clothing-mall-discount-sale-concept-kids-cute-girls-hold-shopping-bags-shopping-discount-season-special-offer-great-day-shopping_474717-27935.jpg?semt=ais_hybrid&w=740&q=80",
    "Home & Living": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeDsAuwcCVaI5Rjwk5EOV_7ok0GgFQLCX5Lw&s",
    "Beauty & Personal Care": "data:image/jpeg;base64,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",
    "Sports & Fitness": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_l4erGlF1s5EZokpVyyBwlvE_2icXGcRiDw&s"
  };

  // ===============================
  // FETCH PRODUCTS
  // ===============================
  const fetchProducts = async (pageNumber = 1) => {
    try {
      const res = await fetch(
        `${API}/api/products/get-products?page=${pageNumber}&limit=16`
      );
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to fetch products");
      }

      setProducts((prev) =>
        pageNumber === 1 ? data.products : [...prev, ...data.products]
      );

      setTotalProducts(data.totalProducts);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ===============================
  // FETCH CATEGORIES
  // ===============================
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/api/category`);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message);
      }

      setCategories(data.category);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ===============================
  // LOAD MORE
  // ===============================
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <Slider />

      {/* ================= CATEGORY ================= */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Shop by Category
        </h2>

        {/* MOBILE DROPDOWN */}
        <div className="md:hidden mb-6">
          <select
            onChange={(e) =>
              navigate(`/products?category=${e.target.value}`)
            }
            className="w-full p-3 rounded-lg border"
          >
            <option value="">Choose Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* DESKTOP IMAGE CARDS */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() =>
                navigate(`/products?category=${cat._id}`)
              }
              className="relative h-32 w-52 rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition duration-300"
            >
              {/* BACKGROUND IMAGE */}
              <img
                src={
                  categoryImages[cat.name] ||
                  "https://via.placeholder.com/300"
                }
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold tracking-wide">
                  {cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
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

      {/* ================= LOAD MORE ================= */}
      {products.length < totalProducts && (
        <div className="text-center pb-10">
          <button
            onClick={handleLoadMore}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}