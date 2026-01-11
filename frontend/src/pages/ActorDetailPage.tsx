import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import type { IActor, IMovie } from '../types';
import { actorAPI, movieActorAPI } from '../api';
import { Film, Star, ArrowLeft, User } from 'lucide-react';

/**
 * Actor Detail Page - Shows actor info and filmography
 */
export const ActorDetailPage: React.FC = () => {
    const { actorId } = useParams<{ actorId: string }>();
    const navigate = useNavigate();

    const [actor, setActor] = useState<IActor | null>(null);
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (actorId) {
            loadActorData();
        }
    }, [actorId]);

    const loadActorData = async () => {
        setIsLoading(true);
        try {
            // Load actor info and movies in parallel
            const [actorResponse, moviesResponse] = await Promise.all([
                actorAPI.getActor(actorId!),
                movieActorAPI.getMoviesOfActor(actorId!),
            ]);

            setActor(actorResponse.data);
            setMovies(moviesResponse.data || []);
            setError(null);
        } catch (err: any) {
            console.error('Failed to load actor data:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load actor');
        } finally {
            setIsLoading(false);
        }
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

    if (error || !actor) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center h-96">
                    <p className="text-red-500 text-xl mb-4">{error || 'Actor not found'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                {/* Actor Header */}
                <div className="flex flex-col md:flex-row gap-8 mb-12">
                    {/* Actor Image */}
                    <div className="w-full md:w-72 h-96 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
                        {actor.imageUrl ? (
                            <img
                                src={actor.imageUrl}
                                alt={actor.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <User size={80} />
                            </div>
                        )}
                    </div>

                    {/* Actor Info */}
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            {actor.name}
                        </h1>

                        <div className="flex items-center gap-3 text-sm text-gray-400 mb-6">
                            <span>Actor</span>
                            <span className="text-gray-600">•</span>
                            <span>{movies.length} movies</span>
                        </div>

                        {actor.introduction ? (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-white mb-2">Biography</h3>
                                <p className="text-gray-300 leading-relaxed">{actor.introduction}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic mb-6">No biography available</p>
                        )}
                    </div>
                </div>

                {/* Filmography Section */}
                <div className="border-t border-gray-800 pt-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Film size={24} />
                        Filmography
                    </h2>

                    {movies.length === 0 ? (
                        <div className="text-center text-gray-500 py-16 bg-gray-900/30 rounded-lg">
                            <Film size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No movies found for this actor</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                            {movies.map((movie) => (
                                <div
                                    key={movie.id}
                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                    className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-yellow-500 hover:scale-105 transition-all cursor-pointer shadow-lg"
                                >
                                    {/* Movie Poster */}
                                    <div className="h-48 bg-gray-800 overflow-hidden">
                                        {movie.imageUrl ? (
                                            <img
                                                src={movie.imageUrl}
                                                alt={movie.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                <Film size={40} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Movie Info */}
                                    <div className="p-3">
                                        <h4 className="text-white text-sm font-semibold line-clamp-2 mb-2">
                                            {movie.name}
                                        </h4>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                                <Star size={14} fill="currentColor" />
                                                <span>{movie.averageScore?.toFixed(1) || '0.0'}</span>
                                            </div>
                                            {movie.tvSeries && (
                                                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                                                    TV
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};
