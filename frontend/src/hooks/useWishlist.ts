import { useState, useCallback } from 'react';
import type { IMovie } from '../types';
import { wishlistAPI } from '../api/wishlistAPI';

/**
 * Hook quản lý wishlist
 */
export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<IMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await wishlistAPI.getUserWishlist();
      // Response is MovieResponse { movies: IMovie[] }
      const movies = response.data.movies || response.data || [];
      setWishlist(Array.isArray(movies) ? movies : []);
      setError(null);
    } catch (err) {
      setError('Failed to load wishlist');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToWishlist = useCallback(
    async (movie: IMovie) => {
      try {
        console.log('Adding to wishlist:', movie, 'Movie ID:', movie.id);
        const response = await wishlistAPI.addToWishlist(movie.id);
        console.log('Add wishlist response:', response);
        
        // Only add if not already in wishlist
        setWishlist((prev) => {
          const alreadyExists = prev.some(m => m.id === movie.id);
          if (alreadyExists) {
            console.log('Movie already in wishlist, skipping');
            return prev;
          }
          return [...prev, movie];
        });
        setError(null);
      } catch (err: any) {
        setError('Failed to add movie to wishlist');
        console.error('Add to wishlist error:', err.response?.data || err.message || err);
      }
    },
    []
  );

  const removeFromWishlist = useCallback(async (movieId: number | string) => {
    try {
      await wishlistAPI.removeFromWishlist(movieId);
      setWishlist((prev) => prev.filter((m) => m.id !== movieId));
      setError(null);
    } catch (err: any) {
      console.error('Failed to remove movie from wishlist:', err);
      // Still update local state even if API fails
      setWishlist((prev) => prev.filter((m) => m.id !== movieId));
    }
  }, []);

  const isInWishlist = useCallback(
    (movieId: number | string): boolean => {
      return wishlist.some((m) => m.id === movieId);
    },
    [wishlist]
  );

  return {
    wishlist,
    isLoading,
    error,
    loadWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};
