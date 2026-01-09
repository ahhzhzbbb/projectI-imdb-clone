import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { MovieList } from '../components/movie/MovieList';
import type { IMovie, IActor } from '../types';
import { movieAPI, actorAPI } from '../api';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../store/AuthContext';
import { Star, TrendingUp, Film, Users } from 'lucide-react';

/**
 * Home page - IMDB Style Design
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { wishlist, loadWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [actors, setActors] = useState<IActor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActorId, setSelectedActorId] = useState<number | string | null>(null);

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
    setSelectedActorId(selectedActorId === actorId ? null : actorId);
  };

  const selectedActor = actors.find(a => a.id === selectedActorId);

  // Featured movie for hero section
  const featuredMovie = movies[0];

  return (
    <MainLayout>
      {/* Hero Section - Featured Movie */}
      <div className="mb-12">
        <div
          className="relative h-[500px] rounded-2xl overflow-hidden bg-gray-900"
          style={{
            backgroundImage: featuredMovie?.imageUrl
              ? `url('${featuredMovie.imageUrl}')`
              : `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp size={12} />
                  TRENDING NOW
                </span>
                <span className="bg-white/10 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                  #1 in Vietnam Today
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                {featuredMovie?.name || 'Welcome to IMDB Clone'}
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-300 mb-6 line-clamp-2">
                {featuredMovie?.description || 'Discover and review your favorite movies and TV series. Join millions of movie lovers!'}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-bold">{featuredMovie?.averageScore?.toFixed(1) || '9.2'}</span>
                  <span className="text-gray-400">/10</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Film size={16} />
                  <span>{featuredMovie?.tvSeries ? 'TV Series' : 'Movie'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users size={16} />
                  <span>{featuredMovie?.reviewCount || 0} Reviews</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => featuredMovie && handleMovieClick(featuredMovie.id)}
                  className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  ▶ Watch Now
                </button>
                <button
                  onClick={() => featuredMovie && handleWishlistClick(featuredMovie.id)}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm transition-all border border-white/20"
                >
                  + Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 text-center">
          <div className="text-3xl font-black text-yellow-500 mb-1">{movies.length}</div>
          <div className="text-gray-400 text-sm">Movies & TV Series</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6 text-center">
          <div className="text-3xl font-black text-blue-500 mb-1">{actors.length}</div>
          <div className="text-gray-400 text-sm">Actors & Actresses</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="text-3xl font-black text-green-500 mb-1">10K+</div>
          <div className="text-gray-400 text-sm">User Reviews</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-6 text-center">
          <div className="text-3xl font-black text-purple-500 mb-1">50+</div>
          <div className="text-gray-400 text-sm">Genres</div>
        </div>
      </div>

      {/* Movies Grid */}
      <MovieList
        movies={movies}
        title="🎬 Popular Movies & TV Series"
        onMovieClick={handleMovieClick}
        onWishlistClick={handleWishlistClick}
        wishlistIds={wishlist.map((m) => m.id)}
        isLoading={isLoading}
        cols={5}
      />

      {/* Actors Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            ⭐ Popular Actors & Actresses
          </h2>
          <span className="text-gray-400 text-sm">{actors.length} actors</span>
        </div>

        {/* Actors Horizontal Scroll */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {actors.map((actor) => (
              <div
                key={actor.id}
                onClick={() => handleActorClick(actor.id)}
                className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${selectedActorId === actor.id ? 'scale-110' : 'hover:scale-105'
                  }`}
              >
                <div className={`w-32 h-32 rounded-full overflow-hidden border-4 transition-colors ${selectedActorId === actor.id ? 'border-yellow-500' : 'border-gray-700 hover:border-gray-500'
                  }`}>
                  {actor.imageUrl ? (
                    <img
                      src={actor.imageUrl}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-4xl">
                      👤
                    </div>
                  )}
                </div>
                <div className="mt-3 text-center">
                  <h3 className={`font-semibold truncate max-w-[128px] ${selectedActorId === actor.id ? 'text-yellow-400' : 'text-white'
                    }`}>
                    {actor.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actor Detail Card */}
        {selectedActor && (
          <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 animate-fadeIn">
            <div className="flex gap-6">
              {/* Actor Image */}
              <div className="w-40 h-40 rounded-xl overflow-hidden flex-shrink-0">
                {selectedActor.imageUrl ? (
                  <img
                    src={selectedActor.imageUrl}
                    alt={selectedActor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-6xl">
                    👤
                  </div>
                )}
              </div>

              {/* Actor Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white">{selectedActor.name}</h3>
                  <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full">
                    Actor
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed mb-4">
                  {selectedActor.introduction || 'No biography available for this actor.'}
                </p>
                <button
                  onClick={() => setSelectedActorId(null)}
                  className="text-gray-500 hover:text-white text-sm transition-colors"
                >
                  ✕ Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="mt-16 mb-8 text-center">
        <div className="bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-yellow-500/10 border border-yellow-500/20 rounded-2xl p-12">
          <h2 className="text-3xl font-black text-white mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Explore our complete collection of movies, TV series, and discover new favorites every day.
          </p>
          <button
            onClick={() => navigate('/genres')}
            className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-all"
          >
            Browse All Genres
          </button>
        </div>
      </div>
    </MainLayout>
  );
};
