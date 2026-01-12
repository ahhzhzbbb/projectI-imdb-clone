import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/common/Button';
import { ratingAPI } from '../api';
import { useAuth } from '../store/AuthContext';
import type { IEpisode } from '../types';
import { ArrowLeft, Star, Film, Users } from 'lucide-react';

/**
 * Episode Detail Page - View episode details and rate
 */
export const EpisodeDetailPage: React.FC = () => {
    const { episodeId } = useParams<{ episodeId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [episode, setEpisode] = useState<IEpisode | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Rating state
    const [userRating, setUserRating] = useState<number | null>(null);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);
    const [hasRated, setHasRated] = useState(false);

    useEffect(() => {
        if (episodeId) {
            loadEpisodeDetail();
        }
    }, [episodeId]);

    const loadEpisodeDetail = async () => {
        setIsLoading(true);
        try {
            // We need to find the episode from seasons
            // For now, we'll store episode data in sessionStorage when navigating
            const storedEpisode = sessionStorage.getItem(`episode_${episodeId}`);
            if (storedEpisode) {
                setEpisode(JSON.parse(storedEpisode));
            } else {
                setError('Episode data not found. Please go back and try again.');
            }
        } catch (err: any) {
            console.error('Failed to load episode:', err);
            setError('Failed to load episode details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRating = async (score: number) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setIsSubmittingRating(true);
        try {
            if (hasRated) {
                await ratingAPI.updateRating(episodeId!, { score });
            } else {
                await ratingAPI.rateEpisode(episodeId!, { score });
            }
            setUserRating(score);
            setHasRated(true);
            // Reload to get updated average
            loadEpisodeDetail();
        } catch (err: any) {
            console.error('Failed to submit rating:', err);
            alert('Failed to submit rating. Please try again.');
        } finally {
            setIsSubmittingRating(false);
        }
    };

    const handleRemoveRating = async () => {
        if (!episodeId) return;
        setIsSubmittingRating(true);
        try {
            await ratingAPI.deleteRating(episodeId);
            setUserRating(null);
            setHasRated(false);
            loadEpisodeDetail();
        } catch (err: any) {
            console.error('Failed to remove rating:', err);
        } finally {
            setIsSubmittingRating(false);
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

    if (error || !episode) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center h-96">
                    <p className="text-red-500 text-xl mb-4">{error || 'Episode not found'}</p>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </MainLayout>
        );
    }

    const videoId = episode.trailerURL ? getYouTubeId(episode.trailerURL) : null;
    const displayRating = hoverRating ?? userRating ?? 0;

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Movie</span>
                </button>

                {/* Episode Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Episode {episode.episodeNumber}: {episode.title}
                    </h1>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-12 gap-8">
                    {/* Left: Poster & Trailer */}
                    <div className="col-span-12 md:col-span-5">
                        {/* Poster */}
                        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
                            {episode.posterURL ? (
                                <img
                                    src={episode.posterURL}
                                    alt={episode.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    <Film size={64} />
                                </div>
                            )}
                        </div>

                        {/* Trailer */}
                        {videoId && (
                            <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title="Episode Trailer"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}
                    </div>

                    {/* Right: Details & Rating */}
                    <div className="col-span-12 md:col-span-7">
                        {/* Summary */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-white mb-3">Summary</h2>
                            <p className="text-gray-300 leading-relaxed">
                                {episode.summary || 'No summary available for this episode.'}
                            </p>
                        </div>

                        {/* Rating Statistics */}
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Star className="text-yellow-400" />
                                Rating Statistics
                            </h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                                        <span className="text-4xl font-black text-white">
                                            {(episode.averageScore ?? 0).toFixed(1)}
                                        </span>
                                        <span className="text-xl text-gray-400">/10</span>
                                    </div>
                                    <p className="text-gray-400 text-sm">Average Rating</p>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Users className="w-6 h-6 text-blue-400" />
                                        <span className="text-4xl font-black text-white">
                                            {(episode.reviewCount ?? 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm">Total Ratings</p>
                                </div>
                            </div>
                        </div>

                        {/* User Rating */}
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-white mb-4">
                                {hasRated ? 'Your Rating' : 'Rate This Episode'}
                            </h2>

                            {isAuthenticated ? (
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex gap-1">
                                            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => handleRating(num)}
                                                    onMouseEnter={() => setHoverRating(num)}
                                                    onMouseLeave={() => setHoverRating(null)}
                                                    disabled={isSubmittingRating}
                                                    className={`text-3xl transition-colors ${num <= displayRating ? 'text-yellow-400' : 'text-gray-700'
                                                        } hover:text-yellow-400 disabled:opacity-50`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                        <span className="text-white font-bold text-xl">
                                            {displayRating > 0 ? `${displayRating}/10` : ''}
                                        </span>
                                    </div>

                                    {hasRated && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-green-400 text-sm">✓ You rated this episode</span>
                                            <button
                                                onClick={handleRemoveRating}
                                                disabled={isSubmittingRating}
                                                className="text-red-400 text-sm hover:text-red-300 underline"
                                            >
                                                Remove rating
                                            </button>
                                        </div>
                                    )}

                                    {!hasRated && (
                                        <p className="text-gray-400 text-sm">
                                            Click on the stars to rate this episode
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-400 mb-4">Sign in to rate this episode</p>
                                    <Button variant="primary" onClick={() => navigate('/login')}>
                                        Sign In
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
