import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, LogOut, Menu, X, ChevronDown, Film, Tag, Star } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

interface INavbarProps {
  onSearch?: (query: string) => void;
}

/**
 * Navbar component - Modern IMDB style
 */
export const Navbar: React.FC<INavbarProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isBrowseMenuOpen, setIsBrowseMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const browseMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (browseMenuRef.current && !browseMenuRef.current.contains(event.target as Node)) {
        setIsBrowseMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onSearch?.(searchQuery);
    }
  };

  return (
    <nav className="bg-zinc-900 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-14 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black text-xl px-2 py-0.5 rounded">
              IMDb
            </div>
          </Link>

          {/* Browse Menu */}
          <div className="hidden md:block relative" ref={browseMenuRef}>
            <button
              onClick={() => setIsBrowseMenuOpen(!isBrowseMenuOpen)}
              className="flex items-center gap-1 px-3 py-2 text-white hover:bg-white/10 rounded transition-colors"
            >
              <Menu size={18} />
              <span className="text-sm font-medium">Menu</span>
            </button>

            {isBrowseMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                <div className="p-3 border-b border-zinc-700">
                  <h4 className="text-yellow-400 font-semibold text-xs uppercase tracking-wider">Browse</h4>
                </div>
                <Link
                  to="/genres"
                  onClick={() => setIsBrowseMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  <Tag size={18} />
                  <span>Genres</span>
                </Link>
                <Link
                  to="/"
                  onClick={() => setIsBrowseMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  <Film size={18} />
                  <span>All Movies</span>
                </Link>
                <Link
                  to="/"
                  onClick={() => setIsBrowseMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  <Star size={18} />
                  <span>Top Rated</span>
                </Link>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full flex">
              <input
                type="text"
                placeholder="Search IMDb"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-l px-4 py-1.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="submit"
                className="bg-white hover:bg-gray-100 text-gray-600 px-3 rounded-r border-l border-gray-300 transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {isAuthenticated ? (
              <>
                {/* Watchlist */}
                <Link
                  to="/wishlist"
                  className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded transition-colors"
                >
                  <Heart size={18} />
                  <span className="text-sm">Watchlist</span>
                </Link>

                {/* Profile Menu */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded transition-colors"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-xs">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm">{user?.username}</span>
                    <ChevronDown size={14} className={`transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-1 w-56 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                      <div className="p-3 border-b border-zinc-700 bg-zinc-900">
                        <p className="text-white font-medium">{user?.username}</p>
                        <p className="text-gray-400 text-xs">{user?.role?.roleName}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                      >
                        <User size={16} />
                        My Profile
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                      >
                        <Heart size={16} />
                        Watchlist
                      </Link>

                      {user?.role?.roleName === 'ADMIN' && (
                        <>
                          <div className="border-t border-zinc-700 my-1" />
                          <div className="px-4 py-2">
                            <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">Admin</span>
                          </div>
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-yellow-400 hover:bg-zinc-700 transition-colors font-medium"
                          >
                            ⚙️ Admin Panel
                          </Link>
                        </>
                      )}

                      <div className="border-t border-zinc-700 mt-1" />
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-white hover:bg-white/10 rounded text-sm transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded font-semibold text-sm transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-yellow-400 ml-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-zinc-700 mt-2 pt-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-white text-gray-900 rounded-l px-4 py-2 text-sm placeholder-gray-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-yellow-400 text-black px-4 rounded-r"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Mobile Links */}
            <div className="space-y-1">
              <Link
                to="/genres"
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              >
                Browse Genres
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                  >
                    Watchlist
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                  >
                    Profile
                  </Link>
                  {user?.role?.roleName === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-yellow-400 hover:bg-zinc-800 rounded transition-colors font-medium"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-zinc-800 rounded transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-yellow-400 hover:bg-zinc-800 rounded transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
