import React from 'react';
import type { IMovie } from '../../types';
import { MovieCard } from './MovieCard';

interface IMovieListProps {
  movies: IMovie[];
  title?: string;
  onMovieClick?: (movieId: number | string) => void;
  onWishlistClick?: (movieId: number | string) => void;
  wishlistIds?: (number | string)[];
  isLoading?: boolean;
  cols?: number;
}

/**
 * Component list hiển thị nhiều phim dưới dạng grid
 */
export const MovieList: React.FC<IMovieListProps> = ({
  movies,
  title,
  onMovieClick,
  onWishlistClick,
  wishlistIds = [],
  isLoading = false,
  cols = 5,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-400 text-lg">No movies found</div>
      </div>
    );
  }

  const colClass = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }[cols] || 'grid-cols-5';

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-bold text-white mb-6 text-shadow">
          {title}
        </h2>
      )}
      <div className={`grid ${colClass} gap-4 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1`}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onMovieClick={onMovieClick}
            onWishlistClick={onWishlistClick}
            isInWishlist={wishlistIds.includes(movie.id)}
          />
        ))}
      </div>
    </div>
  );
};
