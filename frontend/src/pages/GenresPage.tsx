import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import type { IGenre } from '../types';
import { genreAPI } from '../api';
import { ChevronRight, Search, ArrowUpAZ, ArrowDownAZ } from 'lucide-react';

/**
 * Genres Browse Page - User can browse and filter movies by genre
 */
export const GenresPage: React.FC = () => {
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'a-z' | 'z-a'>('a-z');

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    setIsLoading(true);
    try {
      const response = await genreAPI.getAllGenres();
      console.log('Genres response:', response.data);
      const genresData = response.data.genres || response.data || [];
      console.log('Processed genres:', genresData);
      setGenres(genresData);
    } catch (error) {
      console.error('Failed to load genres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort genres
  const filteredAndSortedGenres = useMemo(() => {
    let result = [...genres];

    // Filter by search term
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((genre) => {
        const name = (genre.name || genre.genreName || '').toLowerCase();
        const description = (genre.description || '').toLowerCase();
        return name.includes(lowerSearch) || description.includes(lowerSearch);
      });
    }

    // Sort by name
    result.sort((a, b) => {
      const nameA = (a.name || a.genreName || '').toLowerCase();
      const nameB = (b.name || b.genreName || '').toLowerCase();
      if (sortOption === 'a-z') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return result;
  }, [genres, searchTerm, sortOption]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-400 text-xl">Loading genres...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-black text-white mb-4">Explore Genres</h1>
        <p className="text-gray-400 text-lg">
          Browse movies by genre and discover your next favorite film
        </p>
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm hidden sm:inline">Sort by:</span>
          <div className="flex rounded-lg overflow-hidden border border-gray-700">
            <button
              onClick={() => setSortOption('a-z')}
              className={`flex items-center gap-2 px-4 py-3 transition-colors ${sortOption === 'a-z'
                ? 'bg-yellow-500 text-gray-900'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              title="Sort A to Z"
            >
              <ArrowUpAZ size={18} />
              <span className="text-sm font-medium">A-Z</span>
            </button>
            <button
              onClick={() => setSortOption('z-a')}
              className={`flex items-center gap-2 px-4 py-3 transition-colors ${sortOption === 'z-a'
                ? 'bg-yellow-500 text-gray-900'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              title="Sort Z to A"
            >
              <ArrowDownAZ size={18} />
              <span className="text-sm font-medium">Z-A</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {searchTerm && (
        <div className="mb-6 text-gray-400">
          Found <span className="text-yellow-500 font-semibold">{filteredAndSortedGenres.length}</span> genre{filteredAndSortedGenres.length !== 1 ? 's' : ''} matching "{searchTerm}"
        </div>
      )}

      {/* Genres Grid */}
      {filteredAndSortedGenres.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedGenres.map((genre) => (
            <Link
              key={genre.id}
              to={`/genre/${genre.id}`}
              className="group"
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 h-full flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {genre.name || genre.genreName}
                  </h2>
                  {/* Description if available */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {genre.description
                      ? genre.description
                      : `Discover great ${genre.name || genre.genreName} movies and TV series`}
                  </p>
                </div>

                <div className="flex items-center text-yellow-500 group-hover:text-yellow-400 transition-colors">
                  <span className="text-sm font-semibold">Browse</span>
                  <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {searchTerm ? `No genres found matching "${searchTerm}"` : 'No genres available yet'}
          </p>
        </div>
      )}
    </MainLayout>
  );
};

