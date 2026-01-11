import React from 'react';
import type { IMovie } from '../../types';
import { Plus, Star, Play, Info } from 'lucide-react';

interface IMovieCardProps {
  movie: IMovie;
  onMovieClick?: (movieId: number | string) => void;
  onWishlistClick?: (movieId: number | string) => void;
  isInWishlist?: boolean;
}

/**
 * Component card hiển thị thông tin phim - IMDB Style
 * Fixed height for consistent layout
 */
export const MovieCard: React.FC<IMovieCardProps> = ({
  movie,
  onMovieClick,
  onWishlistClick,
  isInWishlist = false,
}) => {
  return (
    <div className="group flex flex-col bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 hover:bg-gray-800 h-full">
      {/* Movie Poster - Fixed aspect ratio */}
      <div
        className="relative aspect-[2/3] overflow-hidden cursor-pointer flex-shrink-0"
        onClick={() => onMovieClick?.(movie.id)}
      >
        {movie.imageUrl ? (
          <img
            src={movie.imageUrl}
            alt={movie.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 text-xs">
            No Image
          </div>
        )}

        {/* Add to Wishlist Button - Top Left */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistClick?.(movie.id);
          }}
          className={`absolute top-2 left-2 w-7 h-7 rounded flex items-center justify-center transition-all ${isInWishlist
              ? 'bg-yellow-500 text-black'
              : 'bg-gray-900/80 text-white hover:bg-yellow-500 hover:text-black'
            }`}
        >
          <Plus size={16} className={isInWishlist ? 'rotate-45' : ''} />
        </button>

        {/* TV Series Badge */}
        {movie.tvSeries && (
          <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold">
            TV
          </div>
        )}
      </div>

      {/* Card Content - Fixed height */}
      <div className="p-2 flex flex-col" style={{ minHeight: '100px' }}>
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <span className="text-white font-semibold text-xs">
            {movie.averageScore?.toFixed(1) || '0.0'}
          </span>
        </div>

        {/* Title - Fixed height with line clamp */}
        <h3
          className="text-white font-medium text-xs leading-tight line-clamp-2 cursor-pointer hover:underline"
          style={{ minHeight: '32px' }}
          onClick={() => onMovieClick?.(movie.id)}
        >
          {movie.name}
        </h3>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Watchlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistClick?.(movie.id);
          }}
          className={`w-full py-1.5 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 ${isInWishlist
              ? 'bg-gray-700 text-gray-300'
              : 'bg-gray-800 hover:bg-gray-700 text-blue-400'
            }`}
        >
          <Plus size={12} className={isInWishlist ? 'rotate-45' : ''} />
          {isInWishlist ? 'Added' : 'Watchlist'}
        </button>

        {/* Trailer & Info Row */}
        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-800">
          <button
            onClick={() => onMovieClick?.(movie.id)}
            className="flex items-center gap-1 text-gray-400 hover:text-white text-[10px] transition-colors"
          >
            <Play size={10} />
            <span>Trailer</span>
          </button>
          <button
            onClick={() => onMovieClick?.(movie.id)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Info size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
