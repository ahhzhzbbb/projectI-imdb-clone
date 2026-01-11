import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { MovieCard } from '../components/movie/MovieCard';
import type { IGenre, IMovie } from '../types';
import { genreAPI } from '../api';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../store/AuthContext';
import { ArrowLeft, Film, Tag } from 'lucide-react';

/**
 * Genre Detail Page - Shows genre info and movies in that genre
 */
export const GenreDetailPage: React.FC = () => {
    const { genreId } = useParams<{ genreId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { wishlist, loadWishlist, addToWishlist, removeFromWishlist } = useWishlist();

    const [genre, setGenre] = useState<IGenre | null>(null);
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (genreId) {
            loadGenreData();
        }
        if (isAuthenticated) {
            loadWishlist();
        }
    }, [genreId]);

    const loadGenreData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Load all genres to find the current one
            const genresResponse = await genreAPI.getAllGenres();
            const genresData = genresResponse.data.genres || genresResponse.data || [];
            const foundGenre = genresData.find((g: IGenre) => String(g.id) === genreId);

            if (foundGenre) {
                setGenre(foundGenre);
            }

            // Load movies for this genre
            const moviesResponse = await genreAPI.getMoviesByGenre(genreId!);
            const moviesData = moviesResponse.data.movies || moviesResponse.data || [];
            setMovies(Array.isArray(moviesData) ? moviesData : []);
        } catch (err: any) {
            console.error('Failed to load genre data:', err);
            setError('Failed to load genre data');
        } finally {
            setIsLoading(false);
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

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-96">
                    <div className="text-gray-400 text-xl">Loading...</div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                    <p className="text-xl mb-4">{error}</p>
                    <Link to="/genres" className="text-yellow-500 hover:underline">
                        Back to Genres
                    </Link>
                </div>
            </MainLayout>
        );
    }

    const genreName = genre?.name || genre?.genreName || 'Unknown Genre';

    return (
        <MainLayout>
            {/* Back Button */}
            <Link
                to="/genres"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={18} />
                <span>Back to Genres</span>
            </Link>

            {/* Genre Header */}
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <Tag className="text-yellow-500" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">{genreName}</h1>
                        <p className="text-gray-400 text-sm">
                            {movies.length} movie{movies.length !== 1 ? 's' : ''} in this genre
                        </p>
                    </div>
                </div>

                {genre?.description && (
                    <p className="text-gray-300 leading-relaxed">
                        {genre.description}
                    </p>
                )}
            </div>

            {/* Movies Section */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Film size={20} className="text-yellow-500" />
                    <h2 className="text-xl font-bold text-white">Movies</h2>
                </div>

                {movies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {movies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                onMovieClick={handleMovieClick}
                                onWishlistClick={handleWishlistClick}
                                isInWishlist={wishlist.some((m) => m.id === movie.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400 bg-zinc-900 rounded-xl border border-zinc-800">
                        <Film size={48} className="mb-4 opacity-50" />
                        <p className="text-lg">No movies in this genre yet</p>
                        <Link
                            to="/"
                            className="mt-4 text-yellow-500 hover:underline text-sm"
                        >
                            Browse all movies
                        </Link>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};
