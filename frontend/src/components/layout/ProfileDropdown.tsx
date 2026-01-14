import React from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, LogOut, ChevronDown } from 'lucide-react';
import type { IUser } from '../../types';

interface IProfileDropdownProps {
    /** Current user */
    user: IUser | null;
    /** Whether the dropdown is open */
    isOpen: boolean;
    /** Toggle dropdown open/close */
    onToggle: () => void;
    /** Close the dropdown */
    onClose: () => void;
    /** Logout callback */
    onLogout: () => void;
    /** Ref for click outside detection */
    dropdownRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * ProfileDropdown component - User profile menu dropdown
 */
export const ProfileDropdown: React.FC<IProfileDropdownProps> = ({
    user,
    isOpen,
    onToggle,
    onClose,
    onLogout,
    dropdownRef,
}) => {
    const handleLogout = () => {
        onLogout();
        onClose();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={onToggle}
                className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded transition-colors"
            >
                <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-xs">
                        {user?.username?.charAt(0).toUpperCase()}
                    </span>
                </div>
                <span className="text-sm">{user?.username}</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                    <div className="p-3 border-b border-zinc-700 bg-zinc-900">
                        <p className="text-white font-medium">{user?.username}</p>
                        <p className="text-gray-400 text-xs">{user?.role?.roleName}</p>
                    </div>

                    <Link
                        to="/profile"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                    >
                        <User size={16} />
                        My Profile
                    </Link>
                    <Link
                        to="/wishlist"
                        onClick={onClose}
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
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-2.5 text-yellow-400 hover:bg-zinc-700 transition-colors font-medium"
                            >
                                ⚙️ Admin Panel
                            </Link>
                        </>
                    )}

                    <div className="border-t border-zinc-700 mt-1" />
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};
