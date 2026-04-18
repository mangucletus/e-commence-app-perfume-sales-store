import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar() {
  const { token, firstName, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-purple-700 tracking-tight">
            Parfum
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm text-gray-600 hover:text-purple-700 font-medium">
              Shop
            </Link>
            {token ? (
              <>
                <Link to="/cart" className="text-sm text-gray-600 hover:text-purple-700 font-medium">
                  Cart
                </Link>
                <Link to="/orders" className="text-sm text-gray-600 hover:text-purple-700 font-medium">
                  Orders
                </Link>
                <span className="text-sm text-gray-500">Hi, {firstName}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-purple-700 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-purple-700 text-white px-4 py-1.5 rounded-full hover:bg-purple-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
