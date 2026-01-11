import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { MovieList } from '../components/movie/MovieList';
import type { IMovie, IActor } from '../types';
import { movieAPI, actorAPI } from '../api';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../store/AuthContext';
import { Star, Film, Users, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Home page - IMDB Style Design with Auto-sliding Hero
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { wishlist, loadWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [actors, setActors] = useState<IActor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Featured movies for carousel (first 5)
  const featuredMovies = movies.slice(0, 5);

  // Auto-slide effect
  useEffect(() => {
    if (featuredMovies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  useEffect(() => {
    loadMovies();
    loadActors();
    if (isAuthenticated) {
      loadWishlist();
    }
  }, []);

  const loadMovies = async () => {
    setIsLoading(true);
    try {
      const response = await movieAPI.getAllMovies();
      const movies = response.data.movies || [];
      setMovies(movies);
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadActors = async () => {
    try {
      const response = await actorAPI.getAllActors();
      const actorsData = response.data.actors || response.data || [];
      setActors(Array.isArray(actorsData) ? actorsData : []);
    } catch (error) {
      console.error('Failed to load actors:', error);
    }
  };

  const handleMovieClick = (movieId: number | string) => {
    navigate(`/movie/${movieId}`);
  };

  const handleWishlistClick = async (movieId: number | string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const isInWishlist = wishlist.some((m) => m.id === movieId);
    try {
      if (isInWishlist) {
        await removeFromWishlist(movieId);
      } else {
        const movie = movies.find((m) => m.id === movieId);
        if (movie) {
          await addToWishlist(movie);
        }
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  const handleActorClick = (actorId: number | string) => {
    navigate(`/actor/${actorId}`);
  };

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  }, [featuredMovies.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  }, [featuredMovies.length]);

  const currentMovie = featuredMovies[currentSlide];

  return (
    <MainLayout>
      {/* Hero Carousel */}
      <div className="mb-8">
        <div className="relative h-[350px] rounded-xl overflow-hidden bg-zinc-900">
          {/* Slides */}
          {featuredMovies.map((movie, index) => (
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
                  onClick={() => currentMovie && handleMovieClick(currentMovie.id)}
                  className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded transition-all flex items-center gap-2"
                >
                  ▶ Watch Now
                </button>
                <button
                  onClick={() => currentMovie && handleWishlistClick(currentMovie.id)}
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
            {featuredMovies.map((_, index) => (
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
      </div>

      {/* Quick Stats - Compact */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className="bg-zinc-900 border border-yellow-500/20 rounded-lg py-3 px-4 text-center">
          <div className="text-xl font-bold text-yellow-500">{movies.length}</div>
          <div className="text-gray-400 text-xs">Movies & TV</div>
        </div>
        <div className="bg-zinc-900 border border-blue-500/20 rounded-lg py-3 px-4 text-center">
          <div className="text-xl font-bold text-blue-500">{actors.length}</div>
          <div className="text-gray-400 text-xs">Actors</div>
        </div>
        <div className="bg-zinc-900 border border-green-500/20 rounded-lg py-3 px-4 text-center">
          <div className="text-xl font-bold text-green-500">10K+</div>
          <div className="text-gray-400 text-xs">Reviews</div>
        </div>
        <div className="bg-zinc-900 border border-purple-500/20 rounded-lg py-3 px-4 text-center">
          <div className="text-xl font-bold text-purple-500">50+</div>
          <div className="text-gray-400 text-xs">Genres</div>
        </div>
      </div>

      {/* Movies Carousel */}
      <MovieList
        movies={movies}
        title="🎬 Popular Movies & TV Series"
        onMovieClick={handleMovieClick}
        onWishlistClick={handleWishlistClick}
        wishlistIds={wishlist.map((m) => m.id)}
        isLoading={isLoading}
      />

      {/* Actors Section - Compact */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            ⭐ Popular Actors
          </h2>
          <span className="text-gray-500 text-xs">{actors.length} actors</span>
        </div>

        {/* Actors Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {actors.slice(0, 10).map((actor) => (
            <div
              key={actor.id}
              onClick={() => handleActorClick(actor.id)}
              className="flex-shrink-0 cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-zinc-700 group-hover:border-yellow-500 transition-colors">
                {actor.imageUrl ? (
                  <img
                    src={actor.imageUrl}
                    alt={actor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-2xl">
                    👤
                  </div>
                )}
              </div>
              <div className="mt-2 text-center">
                <h3 className="text-white text-xs font-medium truncate max-w-[80px] group-hover:text-yellow-400 transition-colors">
                  {actor.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA - Compact */}
      <div className="mt-10 mb-6 text-center">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-2">
            Explore More
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Browse our complete collection of movies and TV series
          </p>
          <button
            onClick={() => navigate('/genres')}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded transition-all"
          >
            Browse Genres
          </button>
        </div>
      </div>
    </MainLayout>
  );
};
