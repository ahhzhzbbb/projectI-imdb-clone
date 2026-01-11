import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { MovieCard } from '../components/movie/MovieCard';
import type { IMovie } from '../types';
import { movieAPI } from '../api';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../store/AuthContext';
import { Search } from 'lucide-react';

/**
 * Search Results Page
 */
export const SearchPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const { isAuthenticated } = useAuth();
    const { wishlist, loadWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<IMovie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadMovies();
        if (isAuthenticated) {
            loadWishlist();
        }
    }, []);

    useEffect(() => {
        if (query) {
            const filtered = movies.filter((movie) =>
                movie.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredMovies(filtered);
        } else {
            setFilteredMovies(movies);
        }
    }, [query, movies]);

    const loadMovies = async () => {
        setIsLoading(true);
        try {
            const response = await movieAPI.getAllMovies();
            const moviesData = response.data.movies || [];
            setMovies(moviesData);
        } catch (error) {
            console.error('Failed to load movies:', error);
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
                    <div className="text-gray-400 text-xl">Searching...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            {/* Search Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Search size={24} className="text-yellow-500" />
                    <h1 className="text-3xl font-black text-white">Search Results</h1>
                </div>
                <p className="text-gray-400">
                    {query ? (
                        <>
                            Found <span className="text-yellow-500 font-bold">{filteredMovies.length}</span> results for "{query}"
                        </>
                    ) : (
                        'Enter a search term to find movies'
                    )}
                </p>
            </div>

            {/* Results Grid */}
            {filteredMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredMovies.map((movie) => (
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
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Search size={48} className="mb-4 opacity-50" />
                    <p className="text-lg mb-2">No movies found for "{query}"</p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-yellow-500 hover:underline"
                    >
                        Browse all movies
                    </button>
                </div>
            )}
        </MainLayout>
    );
};
