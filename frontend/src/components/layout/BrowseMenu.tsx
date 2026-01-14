import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Film, Tag, Star } from 'lucide-react';

interface IBrowseMenuProps {
    /** Whether the menu is open */
    isOpen: boolean;
    /** Toggle menu open/close */
    onToggle: () => void;
    /** Close the menu */
    onClose: () => void;
    /** Ref for click outside detection */
    menuRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * BrowseMenu component - Desktop browse dropdown menu
 */
export const BrowseMenu: React.FC<IBrowseMenuProps> = ({
    isOpen,
    onToggle,
    onClose,
    menuRef,
}) => {
    return (
        <div className="hidden md:block relative" ref={menuRef}>
            <button
                onClick={onToggle}
                className="flex items-center gap-1 px-3 py-2 text-white hover:bg-white/10 rounded transition-colors"
            >
                <Menu size={18} />
                <span className="text-sm font-medium">Menu</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                    <div className="p-3 border-b border-zinc-700">
                        <h4 className="text-yellow-400 font-semibold text-xs uppercase tracking-wider">Browse</h4>
                    </div>
                    <Link
                        to="/genres"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                    >
                        <Tag size={18} />
                        <span>Genres</span>
                    </Link>
                    <Link
                        to="/"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                    >
                        <Film size={18} />
                        <span>All Movies</span>
                    </Link>
                    <Link
                        to="/"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                    >
                        <Star size={18} />
                        <span>Top Rated</span>
                    </Link>
                </div>
            )}
        </div>
    );
};
