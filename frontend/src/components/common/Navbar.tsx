import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { SearchBar } from '../layout/SearchBar';
import { BrowseMenu } from '../layout/BrowseMenu';
import { ProfileDropdown } from '../layout/ProfileDropdown';
import { MobileMenu } from '../layout/MobileMenu';

interface INavbarProps {
  onSearch?: (query: string) => void;
}

/**
 * Navbar component - Modern IMDB style
 * Refactored to use sub-components for better maintainability
 */
export const Navbar: React.FC<INavbarProps> = ({ onSearch }) => {
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
          <BrowseMenu
            isOpen={isBrowseMenuOpen}
            onToggle={() => setIsBrowseMenuOpen(!isBrowseMenuOpen)}
            onClose={() => setIsBrowseMenuOpen(false)}
            menuRef={browseMenuRef}
          />

          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearch={onSearch}
            variant="desktop"
          />

          {/* Right Side - Desktop */}
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
                <ProfileDropdown
                  user={user}
                  isOpen={isProfileMenuOpen}
                  onToggle={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  onClose={() => setIsProfileMenuOpen(false)}
                  onLogout={logout}
                  dropdownRef={profileMenuRef}
                />
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
        <MobileMenu
          isOpen={isMenuOpen}
          isAuthenticated={isAuthenticated}
          user={user}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearch={onSearch}
          onLogout={logout}
          onClose={() => setIsMenuOpen(false)}
        />
      </div>
    </nav>
  );
};
