import { useAuth } from "../context/authContext";
import NotificationBell from "./NotificationBell";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed");
    }
  };

  const navLinkClass = (path) =>
    `text-sm font-medium transition ${
      location.pathname === path
        ? "text-indigo-600 border-b-2 border-indigo-600 pb-1"
        : "text-gray-600 hover:text-indigo-600"
    }`;

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        {/* Left */}
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-indigo-600">
            AI CX
          </span>

          <Link to="/" className={navLinkClass("/")}>
            Dashboard
          </Link>

          <Link to="/tickets" className={navLinkClass("/tickets")}>
            Tickets
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/audit-logs"
              className={navLinkClass("/audit-logs")}
            >
              Audit Logs
            </Link>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <NotificationBell />

          <span className="text-sm text-gray-700">
            {user?.username}
            <span className="text-gray-400"> ({user?.role})</span>
          </span>

          <button
            onClick={handleLogout}
            className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
