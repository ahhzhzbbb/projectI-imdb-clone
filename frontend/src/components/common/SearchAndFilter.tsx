import React from 'react';

interface ISortOption {
    value: string;
    label: string;
}

interface ISearchAndFilterProps {
    /** Current search term */
    searchTerm: string;
    /** Callback when search term changes */
    onSearchChange: (term: string) => void;
    /** Search placeholder text */
    placeholder?: string;
    /** Current sort value */
    sortValue?: string;
    /** Sort options */
    sortOptions?: ISortOption[];
    /** Callback when sort changes */
    onSortChange?: (value: string) => void;
}

/**
 * SearchAndFilter component - Reusable search bar with optional sort dropdown
 */
export const SearchAndFilter: React.FC<ISearchAndFilterProps> = ({
    searchTerm,
    onSearchChange,
    placeholder = 'Search...',
    sortValue,
    sortOptions,
    onSortChange,
}) => {
    return (
        <div className="flex items-center gap-4">
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:border-yellow-500"
            />
            {sortOptions && onSortChange && (
                <select
                    value={sortValue || ''}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-500"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};
