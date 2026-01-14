import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { MovieList } from '../components/movie/MovieList';
import { LoadingSpinner } from '../components/common';
import { HeroCarousel, StatsSection, ActorsCarousel } from './home/components';
import type { IMovie, IActor } from '../types';
import { movieAPI, actorAPI } from '../api';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../store/AuthContext';

/**
 * Home page - IMDB Style Design with Auto-sliding Hero
 * Refactored to use sub-components for better maintainability
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { wishlist, loadWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [actors, setActors] = useState<IActor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Featured movies for carousel (first 5)
  const featuredMovies = useMemo(() => movies.slice(0, 5), [movies]);

  // Stats data
  const stats = useMemo(() => [
    { value: movies.length, label: 'Movies & TV', color: 'yellow' as const },
    { value: actors.length, label: 'Actors', color: 'blue' as const },
    { value: '10K+', label: 'Reviews', color: 'green' as const },
    { value: '50+', label: 'Genres', color: 'purple' as const },
  ], [movies.length, actors.length]);

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

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner fullHeight message="Loading movies..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Carousel */}
      <div className="mb-8">
        <HeroCarousel
          movies={featuredMovies}
          onMovieClick={handleMovieClick}
          onWishlistClick={handleWishlistClick}
        />
      </div>

      {/* Quick Stats */}
      <StatsSection stats={stats} />

      {/* Movies Carousel */}
      <MovieList
        movies={movies}
        title="🎬 Popular Movies & TV Series"
        onMovieClick={handleMovieClick}
        onWishlistClick={handleWishlistClick}
        wishlistIds={wishlist.map((m) => m.id)}
        isLoading={isLoading}
      />

      {/* Actors Carousel */}
      <ActorsCarousel
        actors={actors}
        onActorClick={handleActorClick}
        title="⭐ Popular Stars"
      />

      {/* Explore CTA */}
      <div className="mt-10 mb-6 text-center">
        <p className="text-gray-500 mb-3 text-sm">
          Browse through our complete collection of movies and TV series
        </p>
        <button
          onClick={() => navigate('/genres')}
          className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-semibold transition-colors border border-zinc-700"
        >
          Explore by Genres →
        </button>
      </div>
    </MainLayout>
  );
};
