import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { MovieList } from '../components/movie/MovieList';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../store/AuthContext';

/**
 * Wishlist page - Hiển thị danh sách yêu thích của user
 */
export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { wishlist, isLoading, loadWishlist, removeFromWishlist } =
    useWishlist();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadWishlist();
  }, [isAuthenticated]);

  const handleMovieClick = (movieId: number | string) => {
    navigate(`/movie/${movieId}`);
  };

  const handleRemoveClick = async (movieId: number | string) => {
    try {
      await removeFromWishlist(movieId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white">My Wishlist</h1>
        <p className="text-gray-400 mt-2">
          {wishlist.length} movie{wishlist.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {wishlist.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
          <p className="text-xl mb-4">Your wishlist is empty</p>
          <button
            onClick={() => navigate('/')}
            className="text-yellow-500 hover:text-yellow-600 underline"
          >
            Browse movies to add them to your wishlist
          </button>
        </div>
      ) : (
        <MovieList
          movies={wishlist}
          onMovieClick={handleMovieClick}
          onWishlistClick={handleRemoveClick}
          wishlistIds={wishlist.map((m) => m.id)}
          isLoading={isLoading}
        />
      )}
    </MainLayout>
  );
};
