import React from 'react';
import type { IMovie } from '../../types';
import { Heart, Play } from 'lucide-react';
import { RatingStars } from '../common/RatingStars';
import { truncateText } from '../../utils/helpers';

interface IMovieCardProps {
  movie: IMovie;
  onMovieClick?: (movieId: number | string) => void;
  onWishlistClick?: (movieId: number | string) => void;
  isInWishlist?: boolean;
}

/**
 * Component card hiển thị thông tin phim
 * Sử dụng IMDB style với hover effects
 */
export const MovieCard: React.FC<IMovieCardProps> = ({
  movie,
  onMovieClick,
  onWishlistClick,
  isInWishlist = false,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="group relative h-96 bg-gray-900 rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onMovieClick?.(movie.id)}
    >
      {/* Movie Poster */}
      <div className="relative w-full h-full overflow-hidden bg-gray-800">
        {movie.imageUrl ? (
          <img
            src={movie.imageUrl}
            alt={movie.name}
            className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No Image
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

        {/* Wishlist Button - Always visible at top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistClick?.(movie.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
            isInWishlist
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-yellow-500 hover:text-black'
          }`}
        >
          <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
        </button>

        {/* Hover Content */}
        {isHovered && (
          <div className="absolute inset-0 flex flex-col justify-end p-4 bg-black/40">
            {/* Play Button */}
            <div className="flex justify-center mb-4">
              <button className="bg-yellow-500 text-black p-3 rounded-full hover:bg-yellow-600 transition-colors">
                <Play size={24} fill="currentColor" />
              </button>
            </div>

            {/* Movie Info */}
            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
              {movie.name}
            </h3>
            <p className="text-gray-300 text-xs mb-3 line-clamp-2">
              {truncateText(movie.description || 'No description', 100)}
            </p>

            {/* Rating */}
            <div className="flex items-center justify-between">
              <RatingStars score={movie.averageScore} size="sm" />
              <span className="text-gray-300 text-xs">
                {movie.reviewCount} reviews
              </span>
            </div>
          </div>
        )}

        {/* Movie Type Badge */}
        {movie.tvSeries && (
          <div className="absolute bottom-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
            TV SERIES
          </div>
        )}
      </div>

      {/* Bottom Info (visible even without hover) */}
      {!isHovered && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-white font-semibold text-sm truncate">
            {movie.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <RatingStars score={movie.averageScore} size="sm" />
          </div>
        </div>
      )}
    </div>
  );
};
