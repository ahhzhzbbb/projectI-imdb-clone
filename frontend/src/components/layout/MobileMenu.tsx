import React from 'react';
import { Link } from 'react-router-dom';
import type { IUser } from '../../types';
import { SearchBar } from './SearchBar';

interface IMobileMenuProps {
    /** Whether the mobile menu is open */
    isOpen: boolean;
    /** Whether user is authenticated */
    isAuthenticated: boolean;
    /** Current user */
    user: IUser | null;
    /** Search query value */
    searchQuery: string;
    /** Callback when search query changes */
    onSearchQueryChange: (query: string) => void;
    /** Callback when search is submitted */
    onSearch?: (query: string) => void;
    /** Logout callback */
    onLogout: () => void;
    /** Close menu callback */
    onClose: () => void;
}

/**
 * MobileMenu component - Full mobile navigation menu
 */
export const MobileMenu: React.FC<IMobileMenuProps> = ({
    isOpen,
    isAuthenticated,
    user,
    searchQuery,
    onSearchQueryChange,
    onSearch,
    onLogout,
    onClose,
}) => {
    if (!isOpen) return null;

    const handleLogout = () => {
        onLogout();
        onClose();
    };

    return (
        <div className="md:hidden pb-4 border-t border-zinc-700 mt-2 pt-4">
            {/* Mobile Search */}
            <SearchBar
                searchQuery={searchQuery}
                onSearchQueryChange={onSearchQueryChange}
                onSearch={onSearch}
                variant="mobile"
            />

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
                            onClick={handleLogout}
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
    );
};
