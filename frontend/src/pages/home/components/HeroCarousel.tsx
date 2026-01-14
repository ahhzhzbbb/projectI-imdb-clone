import React, { useEffect, useState, useCallback } from 'react';
import { Star, Film, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import type { IMovie } from '../../../types';

interface IHeroCarouselProps {
    /** Featured movies to display */
    movies: IMovie[];
    /** Callback when movie is clicked */
    onMovieClick: (movieId: number | string) => void;
    /** Callback when wishlist button is clicked */
    onWishlistClick: (movieId: number | string) => void;
    /** Auto-slide interval in ms (default: 5000) */
    autoSlideInterval?: number;
}

/**
 * HeroCarousel component - Auto-sliding featured movies carousel
 */
export const HeroCarousel: React.FC<IHeroCarouselProps> = ({
    movies,
    onMovieClick,
    onWishlistClick,
    autoSlideInterval = 5000,
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-slide effect
    useEffect(() => {
        if (movies.length === 0) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % movies.length);
        }, autoSlideInterval);
        return () => clearInterval(interval);
    }, [movies.length, autoSlideInterval]);

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
    }, [movies.length]);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % movies.length);
    }, [movies.length]);

    if (movies.length === 0) {
        return (
            <div className="relative h-[350px] rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
                <p className="text-gray-500">No featured movies available</p>
            </div>
        );
    }

    const currentMovie = movies[currentSlide];

    return (
        <div className="relative h-[350px] rounded-xl overflow-hidden bg-zinc-900">
            {/* Slides */}
            {movies.map((movie, index) => (
                <div
                    key={movie.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    style={{
                        backgroundImage: movie.imageUrl
                            ? `url('${movie.imageUrl}')`
                            : `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center top',
                    }}
                >
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                </div>
            ))}

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <div className="max-w-xl">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm">
                            FEATURED
                        </span>
                        <span className="bg-white/10 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-sm">
                            #{currentSlide + 1} Trending
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-4xl font-black text-white mb-2 leading-tight">
                        {currentMovie?.name || 'Welcome to IMDB Clone'}
                    </h1>

                    {/* Description */}
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2 max-w-md">
                        {currentMovie?.description || 'Discover and review your favorite movies and TV series.'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white font-bold">{currentMovie?.averageScore?.toFixed(1) || '0.0'}</span>
                            <span className="text-gray-400">/10</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                            <Film size={14} />
                            <span>{currentMovie?.tvSeries ? 'TV Series' : 'Movie'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                            <Users size={14} />
                            <span>{currentMovie?.reviewCount || 0} Reviews</span>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => currentMovie && onMovieClick(currentMovie.id)}
                            className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded transition-all flex items-center gap-2"
                        >
                            ▶ Watch Now
                        </button>
                        <button
                            onClick={() => currentMovie && onWishlistClick(currentMovie.id)}
                            className="px-5 py-2 bg-zinc-800/80 hover:bg-zinc-700 text-white font-medium text-sm rounded backdrop-blur-sm transition-all border border-zinc-600"
                        >
                            + Watchlist
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
            >
                <ChevronRight size={20} />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 right-6 flex gap-1.5">
                {movies.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                                ? 'bg-yellow-500 w-6'
                                : 'bg-white/40 hover:bg-white/60'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};
