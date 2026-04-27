import { useSelector, useDispatch } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from "../../redux/userSlice";

export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
    const API = import.meta.env.VITE_BACKEND_URL;


  if (!currentUser) return null;

  const isAdmin = currentUser.role === "admin";

  const navLinkStyle = ({ isActive }) =>
    `block px-3 py-2 rounded-lg transition ${
      isActive
        ? "bg-yellow-500 text-black font-semibold"
        : "hover:text-yellow-400"
    }`;

  const handleLogout = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(signOutUserFailure(data.message || "Logout failed"));
        return;
      }

      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message || "Logout failed"));
    }
  };

  return (
    <div className="flex min-h-screen pt-16 bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white p-5 hidden md:block">
        <h1 className="text-2xl font-bold mb-8">
          {isAdmin ? "ADMIN DASH" : "USER DASH"}
        </h1>

        <ul className="space-y-4">
          <li>
            <NavLink to="/dashboard" end className={navLinkStyle}>
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/orders" className={navLinkStyle}>
              Orders
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/profile" className={navLinkStyle}>
              Profile
            </NavLink>
          </li>

          {isAdmin && (
            <>
              <li>
                <NavLink to="/dashboard/create-product" className={navLinkStyle}>
                  Create Product
                </NavLink>
              </li>

              <li>
                <NavLink to="/dashboard/users" className={navLinkStyle}>
                  Users
                </NavLink>
              </li>
            </>
          )}

        </ul>
      </div>

      {/* MAIN CONTENT (THIS WAS MISSING) */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}