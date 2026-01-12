import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/common/Button';
import type { IMovieDetail, IReview, IMovie, IActor } from '../types';
import { movieAPI, reviewAPI, movieActorAPI, genreAPI } from '../api';
import { useAuth } from '../store/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import { Plus, Trash2, Play, Film, Image, Star, Eye } from 'lucide-react';

/**
 * Movie Detail Page - IMDB Style Design with Tabbed Content
 */
export const MovieDetailPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist, loadWishlist } = useWishlist();

  const [movie, setMovie] = useState<IMovieDetail | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | string | null>(null);
  const [activeTab, setActiveTab] = useState<'episodes' | 'actors' | 'reviews'>('episodes');
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [actors, setActors] = useState<IActor[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [isAuthenticated, loadWishlist]);

  useEffect(() => {
    if (movieId) {
      loadMovieDetail();
      loadReviews();
      loadActors();
    }
  }, [movieId]);

  const loadMovieDetail = async () => {
    setIsLoading(true);
    try {
      // Fetch movie detail and genres in parallel
      const [detailResponse, genresResponse] = await Promise.all([
        movieAPI.getMovieDetail(movieId!),
        genreAPI.getGenresOfMovie(movieId!),
      ]);

      const movieData = detailResponse.data.data || detailResponse.data;
      const genresData = genresResponse.data || [];

      if (movieData) {
        // Merge genres into movie data
        setMovie({
          ...movieData,
          genres: genresData
        });
        setError(null);
      } else {
        setError('No movie data received');
      }
    } catch (err: any) {
      console.error('Failed to load movie detail:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load movie details';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await reviewAPI.getMovieReviews(movieId!);
      const reviewsData = response.data.reviews || response.data.data || response.data || [];
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err: any) {
      console.error('Failed to load reviews:', err);
      setReviews([]);
    }
  };

  const loadActors = async () => {
    try {
      const response = await movieActorAPI.getActorsOfMovie(movieId!);
      const actorsData = response.data || [];
      setActors(Array.isArray(actorsData) ? actorsData : []);
    } catch (err: any) {
      console.error('Failed to load actors:', err);
      setActors([]);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (editingReviewId) {
        await reviewAPI.updateReview(movieId!, {
          score: reviewScore,
          content: reviewContent,
          isSpoiler,
          movieId: parseInt(movieId!),
        });
        setEditingReviewId(null);
      } else {
        await reviewAPI.createReview(movieId!, {
          score: reviewScore,
          content: reviewContent,
          isSpoiler,
          movieId: parseInt(movieId!),
        });
      }
      setReviewScore(5);
      setReviewContent('');
      setIsSpoiler(false);
      setShowReviewForm(false);
      loadReviews();
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await reviewAPI.deleteReview(movieId!);
      loadReviews();
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

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

  const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    if (url.includes('youtu.be')) {
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    } else if (url.includes('youtube.com/watch')) {
      const match = url.match(/v=([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    } else if (url.includes('youtube.com/embed')) {
      const match = url.match(/embed\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-pulse text-gray-400 text-xl">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (error || !movie) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-red-500 text-xl mb-4">{error || 'Movie not found'}</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </MainLayout>
    );
  }

  const isInWishlist = wishlist.some((m) => m.id === movie.id);
  const isOwnerOfReview = (review: IReview) => review.username && user?.username && review.username === user.username;
  const videoId = movie.trailerUrl ? getYouTubeId(movie.trailerUrl) : null;
  const currentSeason = movie.seasons?.find((s) => s.number === selectedSeason);

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

          <div className="flex flex-col items-center cursor-pointer group" onClick={() => { setActiveTab('reviews'); setShowReviewForm(true); }}>
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
            <button onClick={handleWishlistToggle} className="absolute top-2 left-2 w-8 h-8 bg-black/70 hover:bg-black rounded flex items-center justify-center transition-all">
              <Plus className={`w-5 h-5 ${isInWishlist ? 'text-yellow-400' : 'text-white'}`} />
            </button>
          </div>

          <div className="col-span-12 md:col-span-7 relative h-full">
            {!showTrailer && videoId ? (
              <div className="h-full bg-gray-900 rounded-lg overflow-hidden cursor-pointer group relative shadow-2xl" onClick={() => setShowTrailer(true)}>
                <img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt="Trailer thumbnail" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                  <div>
                    <span className="font-semibold">Play trailer with sound</span>
                    <span className="text-gray-300 text-sm ml-2">1:56</span>
                  </div>
                </div>
              </div>
            ) : videoId ? (
              <div className="h-full bg-black rounded-lg overflow-hidden shadow-2xl">
                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} title="Movie Trailer" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            ) : (
              <div className="h-full bg-gray-900 rounded-lg flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Film size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No trailer available</p>
                </div>
              </div>
            )}
          </div>

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

            {/* Divider */}
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
                      <span onClick={() => navigate(`/actor/${actor.id}`)} className="text-blue-400 hover:underline cursor-pointer">{actor.name}</span>
                      {idx < Math.min(actors.length - 1, 2) && <span className="text-gray-600">•</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-800 my-6" />

            {/* ===== TABBED CONTENT ===== */}
            <div className="mb-8">
              {/* Tab Headers */}
              <div className="flex gap-1 mb-6 border-b border-gray-800">
                <button onClick={() => setActiveTab('episodes')} className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === 'episodes' ? 'text-white border-b-2 border-yellow-500 bg-gray-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>
                  Episodes
                </button>
                <button onClick={() => setActiveTab('actors')} className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === 'actors' ? 'text-white border-b-2 border-yellow-500 bg-gray-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>
                  Cast
                </button>
                <button onClick={() => setActiveTab('reviews')} className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === 'reviews' ? 'text-white border-b-2 border-yellow-500 bg-gray-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>
                  Reviews
                </button>
              </div>

              {/* ===== EPISODES TAB ===== */}
              {activeTab === 'episodes' && (
                <div>
                  {movie.tvSeries && movie.seasons && movie.seasons.length > 0 ? (
                    <>
                      {/* Season Pills */}
                      <div className="flex gap-2 mb-6">
                        {movie.seasons.map((season) => (
                          <button key={season.id} onClick={() => setSelectedSeason(season.number)} className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${selectedSeason === season.number ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                            {season.number}
                          </button>
                        ))}
                      </div>

                      {/* Episodes List */}
                      <div className="space-y-4">
                        {currentSeason?.episodes?.map((episode) => (
                          <div
                            key={episode.id}
                            onClick={() => {
                              // Store episode data in sessionStorage for EpisodeDetailPage
                              sessionStorage.setItem(`episode_${episode.id}`, JSON.stringify(episode));
                              navigate(`/episode/${episode.id}`);
                            }}
                            className="flex gap-4 p-4 bg-gray-900/30 rounded-lg hover:bg-gray-900/50 transition-colors border border-gray-800 cursor-pointer hover:border-yellow-500/50"
                          >
                            <div className="w-40 h-24 bg-gray-800 rounded overflow-hidden flex-shrink-0 relative">
                              {episode.posterURL ? (
                                <img src={episode.posterURL} alt={episode.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                  <Film size={24} />
                                </div>
                              )}
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-1 left-1 w-6 h-6 bg-black/60 rounded flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4 text-white" />
                              </button>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium mb-1">
                                S{selectedSeason}.E{episode.episodeNumber} · {episode.title}
                              </h4>
                              <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                                {episode.summary || 'No description available.'}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  <span className="text-white font-medium">{(episode.averageScore ?? 0).toFixed(1)}/10</span>
                                </div>
                                <span className="text-blue-400 cursor-pointer hover:underline">☆ Rate</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <Film size={48} className="mx-auto mb-4 opacity-50" />
                      <p>This is a movie, not a TV series.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ===== ACTORS TAB ===== */}
              {activeTab === 'actors' && (
                <div>
                  {actors && actors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {actors.map((actor) => (
                        <div key={actor.id} className="flex gap-4 p-4 bg-gray-900/30 rounded-lg hover:bg-gray-900/50 transition-colors border border-gray-800">
                          <div className="w-20 h-20 bg-gray-800 rounded-full overflow-hidden flex-shrink-0">
                            {actor.imageUrl ? (
                              <img src={actor.imageUrl} alt={actor.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl">👤</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 onClick={() => navigate(`/actor/${actor.id}`)} className="text-white font-semibold hover:text-blue-400 cursor-pointer">{actor.name}</h4>
                            {actor.introduction && (
                              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{actor.introduction}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <p>No cast information available.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ===== REVIEWS TAB ===== */}
              {activeTab === 'reviews' && (
                <div>
                  {/* Review Form */}
                  {showReviewForm && isAuthenticated && (
                    <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-800">
                      <h3 className="text-lg font-semibold text-white mb-4">{editingReviewId ? 'Edit Your Review' : 'Write a Review'}</h3>
                      <form onSubmit={handleSubmitReview}>
                        <div className="mb-6">
                          <label className="text-yellow-500 font-semibold block mb-3 uppercase text-sm">Rate This</label>
                          <div className="flex items-center gap-4">
                            <div className="flex gap-1">
                              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                <button key={num} type="button" onClick={() => setReviewScore(num)} className={`text-2xl transition-colors ${num <= reviewScore ? 'text-yellow-400' : 'text-gray-700'} hover:text-yellow-400`}>★</button>
                              ))}
                            </div>
                            <span className="text-white font-bold">{reviewScore}/10</span>
                          </div>
                        </div>
                        <div className="mb-4">
                          <textarea value={reviewContent} onChange={(e) => setReviewContent(e.target.value)} placeholder="Write your review..." className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg h-32 focus:outline-none focus:border-yellow-500 resize-none" />
                        </div>
                        <div className="mb-4 flex items-center">
                          <input type="checkbox" id="spoiler" checked={isSpoiler} onChange={(e) => setIsSpoiler(e.target.checked)} className="mr-2" />
                          <label htmlFor="spoiler" className="text-gray-400 text-sm">Contains spoilers</label>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="primary" type="submit">{editingReviewId ? 'Update Review' : 'Submit Review'}</Button>
                          <Button variant="secondary" type="button" onClick={() => { setShowReviewForm(false); setEditingReviewId(null); setReviewScore(5); setReviewContent(''); setIsSpoiler(false); }}>Cancel</Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {isAuthenticated && !showReviewForm && (
                    <div className="mb-6">
                      <Button variant="primary" onClick={() => setShowReviewForm(true)}>
                        <Plus size={18} className="mr-2" />Write a Review
                      </Button>
                    </div>
                  )}

                  {reviews.length === 0 ? (
                    <div className="text-center text-gray-500 py-12 bg-gray-900/30 rounded-lg">
                      <p className="mb-4">No reviews yet</p>
                      {isAuthenticated && !showReviewForm && (
                        <Button variant="primary" onClick={() => setShowReviewForm(true)}>Be the first to review</Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-gray-900/50 p-5 rounded-lg border border-gray-800">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded">
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  <span className="text-white font-semibold text-sm">{review.score}/10</span>
                                </div>
                                <span className="text-white font-medium">{review.username || 'Anonymous'}</span>
                                <span className="text-gray-600 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                              </div>
                              {review.isSpoiler && <span className="inline-block bg-orange-600 text-white text-xs px-2 py-0.5 rounded mb-2">⚠️ Spoiler</span>}
                              <p className="text-gray-300 leading-relaxed">{review.content}</p>
                            </div>
                            {isOwnerOfReview(review) && (
                              <div className="flex gap-2">
                                <button onClick={() => { setEditingReviewId(review.id); setReviewScore(review.score); setReviewContent(review.content || ''); setIsSpoiler(review.isSpoiler); setShowReviewForm(true); }} className="text-gray-500 hover:text-blue-500 p-2 transition-colors" title="Edit review">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </button>
                                <button onClick={handleDeleteReview} className="text-gray-500 hover:text-red-500 p-2 transition-colors" title="Delete review">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 md:col-span-4">
            <button onClick={handleWishlistToggle} className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 mb-3 transition-all ${isInWishlist ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 hover:bg-yellow-500/30'}`}>
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
