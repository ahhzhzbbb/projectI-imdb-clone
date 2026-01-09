import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { Button } from '../../components/common/Button';
import { movieAPI, actorAPI, movieActorAPI } from '../../api';
import type { IMovie, IActor } from '../../types';
import { Search as SearchIcon, Plus, X } from 'lucide-react';

/**
 * Admin Page to manage Actors attached to Movies
 * Access via /admin/movie-actors?movieId=X for simplified view
 */
export const AdminMovieActorsPage: React.FC = () => {
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [allActors, setAllActors] = useState<IActor[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);
    const [movieActorIds, setMovieActorIds] = useState<(number | string)[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [movieQuery, setMovieQuery] = useState('');

    const location = useLocation();
    const movieIdParam = useMemo(() => new URLSearchParams(location.search).get('movieId'), [location.search]);
    const simpleMode = Boolean(movieIdParam);

    // Load movies and actors on mount
    useEffect(() => {
        loadData();
    }, []);

    // If movieId is provided via query param, load movie actors
    useEffect(() => {
        if (!movieIdParam || allActors.length === 0) return;
        const id = movieIdParam;

        const fetchMovieActors = async () => {
            try {
                const movie = movies.find((m) => String(m.id) === String(id));
                if (movie) {
                    setSelectedMovie(movie);
                } else {
                    setSelectedMovie({ id: Number(id), name: `Movie #${id}` } as IMovie);
                }

                const actorsRes = await movieActorAPI.getActorsOfMovie(id);
                const movieActors = actorsRes.data || [];
                const ids = Array.isArray(movieActors) ? movieActors.map((a: any) => a.id) : [];
                setMovieActorIds(ids);
            } catch (err) {
                console.error('Failed to load movie actors:', err);
                setMovieActorIds([]);
            }
        };
        fetchMovieActors();
    }, [movieIdParam, movies, allActors]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [mRes, aRes] = await Promise.all([movieAPI.getAllMovies(), actorAPI.getAllActors()]);
            const moviesData = mRes.data.movies || mRes.data || [];
            const actorsData = aRes.data.actors || aRes.data || [];
            setMovies(Array.isArray(moviesData) ? moviesData : []);
            setAllActors(Array.isArray(actorsData) ? actorsData : []);
        } catch (err) {
            console.error('Failed to load movies or actors:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const addActorImmediate = async (actorId: number | string) => {
        if (!movieIdParam) return;
        try {
            await movieActorAPI.addActorToMovie(movieIdParam, actorId);
            setMovieActorIds((prev) => [...prev, actorId]);
        } catch (err) {
            console.error('Failed to add actor:', err);
        }
    };

    const removeActorImmediate = async (actorId: number | string) => {
        if (!movieIdParam) return;
        try {
            await movieActorAPI.removeActorFromMovie(movieIdParam, actorId);
            setMovieActorIds((prev) => prev.filter((id) => id !== actorId));
        } catch (err) {
            console.error('Failed to remove actor:', err);
        }
    };

    const movieOptions = useMemo(() => {
        const q = movieQuery.trim().toLowerCase();
        return q ? movies.filter((m) => m.name.toLowerCase().includes(q)) : movies;
    }, [movies, movieQuery]);

    if (isLoading) {
        return (
            <MainLayout>
                <div className="text-gray-400">Loading...</div>
            </MainLayout>
        );
    }

    // Simplified view when movieId is provided
    if (simpleMode) {
        return (
            <MainLayout>
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="secondary" onClick={() => window.history.back()}>
                            ← Back
                        </Button>
                        <h1 className="text-3xl font-black text-white">Manage Actors for {selectedMovie ? selectedMovie.name : `Movie #${movieIdParam}`}</h1>
                    </div>
                </div>

                {/* Current attached actors summary */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Attached Actors ({movieActorIds.length}):</h3>
                    {movieActorIds.length === 0 ? (
                        <span className="text-gray-500">No actors attached</span>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {allActors.filter((a) => movieActorIds.includes(a.id)).map((a) => (
                                <span key={a.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/50 text-blue-300 border border-blue-600">
                                    ✓ {a.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* All actors with Add/Remove toggle */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                    <h2 className="text-xl font-bold text-white mb-4">All Actors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {allActors.map((actor) => {
                            const isAttached = movieActorIds.includes(actor.id);
                            return (
                                <div
                                    key={actor.id}
                                    className={`p-3 rounded border-2 flex items-center gap-3 transition-all ${isAttached
                                            ? 'bg-blue-900/40 border-blue-500'
                                            : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    {/* Actor Avatar */}
                                    <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                                        {actor.imageUrl ? (
                                            <img src={actor.imageUrl} alt={actor.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">👤</div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className={`font-semibold truncate ${isAttached ? 'text-blue-300' : 'text-white'}`}>
                                            {isAttached && '✓ '}{actor.name}
                                        </div>
                                        {actor.introduction && (
                                            <div className="text-gray-400 text-xs truncate">{actor.introduction}</div>
                                        )}
                                    </div>

                                    <div className="flex-shrink-0">
                                        {isAttached ? (
                                            <Button variant="danger" onClick={() => removeActorImmediate(actor.id)}>
                                                <X size={16} />
                                            </Button>
                                        ) : (
                                            <Button variant="primary" onClick={() => addActorImmediate(actor.id)}>
                                                <Plus size={16} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Full page mode - select a movie first
    return (
        <MainLayout>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-black text-white">Manage Movie Actors</h1>
            </div>

            {/* Movie Selection */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Select a Movie</h2>

                {/* Search */}
                <div className="relative mb-4">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={movieQuery}
                        onChange={(e) => setMovieQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    />
                </div>

                {/* Movie List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {movieOptions.map((movie) => (
                        <a
                            key={movie.id}
                            href={`/admin/movie-actors?movieId=${movie.id}`}
                            className="p-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-yellow-500 transition-colors flex items-center gap-3"
                        >
                            <div className="w-12 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                                {movie.imageUrl ? (
                                    <img src={movie.imageUrl} alt={movie.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">🎬</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-white truncate">{movie.name}</div>
                                <div className="text-gray-400 text-sm">{movie.tvSeries ? 'TV Series' : 'Movie'}</div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
};
