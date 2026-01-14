import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface ISearchBarProps {
    /** Current search query value */
    searchQuery: string;
    /** Callback when search query changes */
    onSearchQueryChange: (query: string) => void;
    /** Optional callback when search is submitted */
    onSearch?: (query: string) => void;
    /** Variant: desktop (inline) or mobile (full width) */
    variant?: 'desktop' | 'mobile';
}

/**
 * SearchBar component - Reusable search input for navbar
 */
export const SearchBar: React.FC<ISearchBarProps> = ({
    searchQuery,
    onSearchQueryChange,
    onSearch,
    variant = 'desktop',
}) => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            onSearch?.(searchQuery);
        }
    };

    if (variant === 'mobile') {
        return (
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => onSearchQueryChange(e.target.value)}
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
        );
    }

    return (
        <form onSubmit={handleSubmit} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full flex">
                <input
                    type="text"
                    placeholder="Search IMDb"
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange(e.target.value)}
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
    );
};
