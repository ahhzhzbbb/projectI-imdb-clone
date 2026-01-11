import React, { useRef } from 'react';
import type { IMovie } from '../../types';
import { MovieCard } from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IMovieListProps {
  movies: IMovie[];
  title?: string;
  onMovieClick?: (movieId: number | string) => void;
  onWishlistClick?: (movieId: number | string) => void;
  wishlistIds?: (number | string)[];
  isLoading?: boolean;
}

/**
 * Component list hiển thị phim dạng carousel ngang với nút điều hướng
 */
export const MovieList: React.FC<IMovieListProps> = ({
  movies,
  title,
  onMovieClick,
  onWishlistClick,
  wishlistIds = [],
  isLoading = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-400 text-lg">No movies found</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Title */}
      {title && (
        <h2 className="text-xl font-bold text-white mb-4">
          {title}
        </h2>
      )}

      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-20 bg-black/80 hover:bg-black flex items-center justify-center text-white rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Movies Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-40">
              <MovieCard
                movie={movie}
                onMovieClick={onMovieClick}
                onWishlistClick={onWishlistClick}
                isInWishlist={wishlistIds.includes(movie.id)}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-20 bg-black/80 hover:bg-black flex items-center justify-center text-white rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
