import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-semibold text-gray-900">
          CourseHub
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Courses
          </Link>

          {user?.role === "INSTRUCTOR" && (
            <Link to="/create-course" className="text-gray-600 hover:text-gray-900">
              New Course
            </Link>
          )}

          {user?.role === "STUDENT" && (
            <Link to="/my-purchases" className="text-gray-600 hover:text-gray-900">
              My Purchases
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-500">
                {user.name} <span className="text-gray-400">({user.role})</span>
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-700"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
