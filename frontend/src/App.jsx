import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PublicRoute from "./components/routes/PublicRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import Dashboard from "./pages/dashboard/Dashboard";

// dashboard pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import Profile from "./pages/dashboard/Profile";
import Orders from "./pages/dashboard/Orders";
import Users from "./pages/dashboard/Users";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import CreateProduct from "./pages/dashboard/CreateProduct";
import PageNotFound from "./pages/404";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">

        <Header />

        <Routes>

          {/* PUBLIC ONLY */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* PRIVATE DASHBOARD (LAYOUT ROUTE) */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<OrderSuccess />} />
            <Route path="/dashboard" element={<Dashboard />}>

              {/* DEFAULT DASHBOARD PAGE */}
              <Route index element={<DashboardHome />} />

              {/* CHILD ROUTES */}
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<Orders />} />
              <Route path="create-product" element={<CreateProduct />} />
              <Route path="users" element={<Users />} />
              <Route path="products" element={<dashProducts />} />

            </Route>
          </Route>

          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/products" element={<Products />} />

          <Route path="*" element={<PageNotFound />} />

        </Routes>

        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;