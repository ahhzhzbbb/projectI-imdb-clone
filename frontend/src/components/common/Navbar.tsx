import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Heart, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

interface INavbarProps {
  onSearch?: (query: string) => void;
}

/**
 * Navbar component - IMDB style
 * Màu đen & vàng, logo, search, user menu
 */
export const Navbar: React.FC<INavbarProps> = ({ onSearch }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
    }
  };

  return (
    <nav className="bg-black border-b-2 border-yellow-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-3xl font-black text-yellow-500">IMDB</div>
            <span className="text-xs text-yellow-400">Clone</span>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md mx-6"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search movies, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {/* Genres Link */}
                <Link
                  to="/genres"
                  className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-sm">Genres</span>
                </Link>

                {/* Wishlist Link */}
                <Link
                  to="/wishlist"
                  className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center gap-2"
                >
                  <Heart size={20} />
                  <span className="text-sm">Wishlist</span>
                </Link>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 transition-colors"
                  >
                    <User size={20} />
                    <span className="text-sm">{user?.username}</span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-300 hover:bg-yellow-500 hover:text-black rounded-t-lg transition-colors"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/my-reviews"
                        className="block px-4 py-2 text-gray-300 hover:bg-yellow-500 hover:text-black transition-colors"
                      >
                        My Reviews
                      </Link>
                      {user?.role?.roleName === 'ADMIN' && (
                        <>
                          <div className="border-t border-gray-700"></div>
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-colors font-semibold"
                          >
                            ⚙️ Admin Panel
                          </Link>
                          <Link
                            to="/admin/movies"
                            className="block px-4 py-2 text-gray-300 hover:bg-yellow-500 hover:text-black transition-colors text-sm pl-8"
                          >
                            Manage Movies
                          </Link>
                          <Link
                            to="/admin/genres"
                            className="block px-4 py-2 text-gray-300 hover:bg-yellow-500 hover:text-black transition-colors text-sm pl-8"
                          >
                            Manage Genres
                          </Link>
                        </>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white rounded-b-lg transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-yellow-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-yellow-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-700">
            {/* Mobile Search */}
            <form
              onSubmit={handleSearch}
              className="mb-4 mt-4"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                />
              </div>
            </form>

            {/* Mobile Links */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/wishlist"
                  className="block px-4 py-2 text-gray-300 hover:text-yellow-500 transition-colors"
                >
                  Wishlist
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-300 hover:text-yellow-500 transition-colors"
                >
                  Profile
                </Link>
                {user?.role?.roleName === 'ADMIN' && (
                  <>
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-gray-300 hover:text-yellow-500 transition-colors"
                    >
                      Admin Panel
                    </Link>
                    <Link
                      to="/admin/movies"
                      className="block px-4 py-2 text-gray-300 hover:text-yellow-500 transition-colors text-sm pl-8"
                    >
                      Manage Movies
                    </Link>
                    <Link
                      to="/admin/genres"
                      className="block px-4 py-2 text-gray-300 hover:text-yellow-500 transition-colors text-sm pl-8"
                    >
                      Manage Genres
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-300 hover:text-yellow-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-gray-300 hover:text-yellow-500 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
