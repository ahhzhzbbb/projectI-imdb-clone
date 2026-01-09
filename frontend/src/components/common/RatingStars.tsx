import React from 'react';
import { Star } from 'lucide-react';

interface IRatingStarsProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (score: number) => void;
  className?: string;
}

/**
 * Component hiển thị sao đánh giá
 * Có thể dùng interactive để cho user chọn điểm đánh giá
 */
export const RatingStars: React.FC<IRatingStarsProps> = ({
  score,
  maxScore = 10,
  size = 'md',
  interactive = false,
  onRate,
  className = '',
}) => {
  const stars = Math.ceil((score / maxScore) * 5);
  const [hoverStars, setHoverStars] = React.useState(0);

  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  const handleStarClick = (index: number) => {
    if (interactive && onRate) {
      onRate((index + 1) * 2); // Convert 5-star to 10-point scale
    }
  };

  const handleStarHover = (index: number) => {
    if (interactive) {
      setHoverStars(index + 1);
    }
  };

  const displayStars = hoverStars || stars;

  return (
    <div className={`flex gap-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`${sizeClass} ${
            index < displayStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
          } ${interactive ? 'cursor-pointer transition-colors' : ''}`}
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => handleStarHover(index)}
          onMouseLeave={() => setHoverStars(0)}
        />
      ))}
      <span className="text-sm font-semibold text-gray-300 ml-2">
        {(score / maxScore * 5).toFixed(1)}/5
      </span>
    </div>
  );
};
