import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import type { IGenre } from '../types';
import { genreAPI } from '../api';
import { ChevronRight } from 'lucide-react';

/**
 * Genres Browse Page - User can browse and filter movies by genre
 */
export const GenresPage: React.FC = () => {
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="mb-12">
        <h1 className="text-5xl font-black text-white mb-4">Explore Genres</h1>
        <p className="text-gray-400 text-lg">
          Browse movies by genre and discover your next favorite film
        </p>
      </div>

      {/* Genres Grid */}
      {genres.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {genres.map((genre) => (
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
          <p className="text-gray-400 text-lg">No genres available yet</p>
        </div>
      )}
    </MainLayout>
  );
};
