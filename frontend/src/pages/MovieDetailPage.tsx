import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { LoadingSpinner, ErrorMessage } from '../components/common';
import { TrailerPlayer } from '../components/features/movie/TrailerPlayer';
import { EpisodesTab, CastTab, ReviewsTab } from './movie/components';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { useReviewForm } from '../hooks/useReviewForm';
import { useAuth } from '../store/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import type { IMovie, IReview } from '../types';
import { Plus, Film, Image, Star, Eye } from 'lucide-react';

/**
 * Movie Detail Page - IMDB Style Design with Tabbed Content
 * Refactored to use custom hooks and sub-components
 */
export const MovieDetailPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist, loadWishlist } = useWishlist();

  // Custom hooks for data fetching
  const { movie, reviews, actors, isLoading, error, loadReviews } = useMovieDetail(movieId);

  // Review form hook
  const reviewForm = useReviewForm();

  // Local UI state
  const [activeTab, setActiveTab] = useState<'episodes' | 'actors' | 'reviews'>('episodes');
  const [selectedSeason, setSelectedSeason] = useState<number>(1);

  // Load wishlist when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [isAuthenticated, loadWishlist]);

  // Wishlist toggle handler
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!movie) return;

    try {
      const inWishlist = wishlist.some((m) => m.id === movie.id);
      if (inWishlist) {
        await removeFromWishlist(movie.id);
      } else {
        const movieToAdd: IMovie = {
          id: movie.id,
          name: movie.name,
          description: movie.description || '',
          imageUrl: movie.imageUrl || '',
          trailerUrl: movie.trailerUrl || '',
          tvSeries: movie.tvSeries || false,
          averageScore: movie.averageScore || 0,
          reviewCount: movie.reviewCount || 0
        };
        await addToWishlist(movieToAdd);
      }
      await loadWishlist();
    } catch (err) {
      console.error('Failed to update wishlist:', err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner fullHeight message="Loading movie details..." />
      </MainLayout>
    );
  }

  // Error state
  if (error || !movie) {
    return (
      <MainLayout>
        <ErrorMessage
          message={error || 'Movie not found'}
          onRetry={() => navigate('/')}
          fullHeight
        />
      </MainLayout>
    );
  }

  const isInWishlist = wishlist.some((m) => m.id === movie.id);

  // Review form handlers
  const handleReviewSubmit = (e: React.FormEvent) => {
    reviewForm.handleSubmitReview(e, movieId!, loadReviews);
  };

  const handleReviewDelete = () => {
    reviewForm.handleDeleteReview(movieId!, loadReviews);
  };

  const handleEditReview = (review: IReview) => {
    reviewForm.startEditing(review.id, review.score, review.content || '', review.isSpoiler);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* ===== HEADER SECTION ===== */}
        <div className="mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            {movie.name}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            {movie.tvSeries && (
              <>
                <span>TV Series</span>
                <span className="text-gray-600">•</span>
              </>
            )}
            <span>2021–</span>
            <span className="text-gray-600">•</span>
            <span>TV-MA</span>
            <span className="text-gray-600">•</span>
            <span>24m</span>
          </div>
        </div>

        {/* ===== RATINGS BAR ===== */}
        <div className="flex items-center gap-8 mb-6 pb-4 border-b border-gray-800">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">IMDb Rating</span>
            <div className="flex items-center gap-1">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-bold text-xl">{(movie.averageScore ?? 0).toFixed(1)}</span>
              <span className="text-gray-400 text-sm">/10</span>
            </div>
            <span className="text-xs text-gray-500">{(movie.reviewCount ?? 0).toLocaleString()}</span>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => { setActiveTab('reviews'); reviewForm.setShowForm(true); }}
          >
            <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Your Rating</span>
            <div className="flex items-center gap-1">
              <Star className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <span className="text-blue-400 group-hover:text-blue-300 transition-colors">Rate</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Popularity</span>
            <div className="flex items-center gap-1">
              <span className="text-green-400">📈</span>
              <span className="text-white font-bold">961</span>
              <span className="text-green-400 text-xs">+26</span>
            </div>
          </div>
        </div>

        {/* ===== MEDIA SECTION ===== */}
        <div className="grid grid-cols-12 gap-4 mb-8" style={{ height: '450px' }}>
          {/* Poster */}
          <div className="col-span-12 md:col-span-3 relative group h-full">
            <div className="h-full bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
              {movie.imageUrl ? (
                <img src={movie.imageUrl} alt={movie.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <Film size={48} />
                </div>
              )}
            </div>
            <button
              onClick={handleWishlistToggle}
              className="absolute top-2 left-2 w-8 h-8 bg-black/70 hover:bg-black rounded flex items-center justify-center transition-all"
            >
              <Plus className={`w-5 h-5 ${isInWishlist ? 'text-yellow-400' : 'text-white'}`} />
            </button>
          </div>

          {/* Trailer */}
          <div className="col-span-12 md:col-span-7 relative h-full">
            <TrailerPlayer trailerUrl={movie.trailerUrl} height="100%" />
          </div>

          {/* Media Buttons */}
          <div className="col-span-12 md:col-span-2 flex flex-row md:flex-col gap-3">
            <div className="flex-1 bg-gray-900 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-800 cursor-pointer transition-colors">
              <Film className="w-6 h-6 text-white mb-2" />
              <span className="text-white text-sm font-semibold">3 VIDEOS</span>
            </div>
            <div className="flex-1 bg-gray-900 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-800 cursor-pointer transition-colors">
              <Image className="w-6 h-6 text-white mb-2" />
              <span className="text-white text-sm font-semibold">99+ PHOTOS</span>
            </div>
          </div>
        </div>

        {/* ===== CONTENT SECTION ===== */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-8">
            {/* Genre Tags */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    to={`/genre/${genre.id}`}
                    className="px-4 py-1.5 text-sm text-white border border-gray-600 rounded-full hover:bg-gray-800 hover:border-yellow-500 hover:text-yellow-500 cursor-pointer transition-colors"
                  >
                    {genre.genreName || genre.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Description */}
            {movie.description && (
              <p className="text-gray-300 leading-relaxed mb-6 text-base">{movie.description}</p>
            )}

            <div className="border-t border-gray-800 my-6" />

            {/* Creator */}
            {movie.director && (
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-gray-400">Creator</span>
                <a href="#" className="text-blue-400 hover:underline">{movie.director.name}</a>
              </div>
            )}

            {/* Stars */}
            {actors && actors.length > 0 && (
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-gray-400">Stars</span>
                <div className="flex items-center gap-2">
                  {actors.slice(0, 3).map((actor, idx) => (
                    <React.Fragment key={actor.id}>
                      <span
                        onClick={() => navigate(`/actor/${actor.id}`)}
                        className="text-blue-400 hover:underline cursor-pointer"
                      >
                        {actor.name}
                      </span>
                      {idx < Math.min(actors.length - 1, 2) && <span className="text-gray-600">•</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-800 my-6" />

            {/* ===== TABBED CONTENT ===== */}
            <div className="mb-8">
              {/* Tab Headers */}
              <div className="flex gap-1 mb-6 border-b border-gray-800">
                <button
                  onClick={() => setActiveTab('episodes')}
                  className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === 'episodes'
                    ? 'text-white border-b-2 border-yellow-500 bg-gray-800/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                    }`}
                >
                  Episodes
                </button>
                <button
                  onClick={() => setActiveTab('actors')}
                  className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === 'actors'
                    ? 'text-white border-b-2 border-yellow-500 bg-gray-800/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                    }`}
                >
                  Cast
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === 'reviews'
                    ? 'text-white border-b-2 border-yellow-500 bg-gray-800/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                    }`}
                >
                  Reviews
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'episodes' && (
                <EpisodesTab
                  isTvSeries={movie.tvSeries}
                  seasons={movie.seasons || []}
                  selectedSeason={selectedSeason}
                  onSeasonSelect={setSelectedSeason}
                />
              )}

              {activeTab === 'actors' && <CastTab actors={actors} />}

              {activeTab === 'reviews' && (
                <ReviewsTab
                  reviews={reviews}
                  isAuthenticated={isAuthenticated}
                  user={user}
                  showForm={reviewForm.showForm}
                  isEditing={!!reviewForm.editingReviewId}
                  reviewScore={reviewForm.reviewScore}
                  reviewContent={reviewForm.reviewContent}
                  isSpoiler={reviewForm.isSpoiler}
                  onShowForm={reviewForm.setShowForm}
                  onScoreChange={reviewForm.setReviewScore}
                  onContentChange={reviewForm.setReviewContent}
                  onSpoilerChange={reviewForm.setIsSpoiler}
                  onSubmit={handleReviewSubmit}
                  onCancel={reviewForm.resetForm}
                  onEdit={handleEditReview}
                  onDelete={handleReviewDelete}
                />
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 md:col-span-4">
            <button
              onClick={handleWishlistToggle}
              className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 mb-3 transition-all ${isInWishlist
                ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 hover:bg-yellow-500/30'
                }`}
            >
              <Plus className={`w-5 h-5 ${isInWishlist ? 'rotate-45' : ''} transition-transform`} />
              {isInWishlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
            <button className="w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 transition-all mb-6">
              <Eye className="w-5 h-5" />Watched
            </button>
            <div className="text-sm text-blue-400 mb-6">
              <span className="hover:underline cursor-pointer">{reviews.length} User reviews</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
