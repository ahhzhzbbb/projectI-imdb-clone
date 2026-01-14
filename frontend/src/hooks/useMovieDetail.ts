import { useState, useEffect, useCallback } from 'react';
import type { IMovieDetail, IReview, IActor } from '../types';
import { movieAPI, reviewAPI, movieActorAPI, genreAPI } from '../api';

interface UseMovieDetailReturn {
    movie: IMovieDetail | null;
    reviews: IReview[];
    actors: IActor[];
    isLoading: boolean;
    error: string | null;
    loadMovieDetail: () => Promise<void>;
    loadReviews: () => Promise<void>;
    loadActors: () => Promise<void>;
}

/**
 * Custom hook để quản lý data fetching cho MovieDetailPage
 * Tách logic data fetching ra khỏi component
 */
export const useMovieDetail = (movieId: string | undefined): UseMovieDetailReturn => {
    const [movie, setMovie] = useState<IMovieDetail | null>(null);
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [actors, setActors] = useState<IActor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadMovieDetail = useCallback(async () => {
        if (!movieId) return;

        setIsLoading(true);
        try {
            // Fetch movie detail and genres in parallel
            const [detailResponse, genresResponse] = await Promise.all([
                movieAPI.getMovieDetail(movieId),
                genreAPI.getGenresOfMovie(movieId),
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
    }, [movieId]);

    const loadReviews = useCallback(async () => {
        if (!movieId) return;

        try {
            const response = await reviewAPI.getMovieReviews(movieId);
            const reviewsData = response.data.reviews || response.data.data || response.data || [];
            setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        } catch (err: any) {
            console.error('Failed to load reviews:', err);
            setReviews([]);
        }
    }, [movieId]);

    const loadActors = useCallback(async () => {
        if (!movieId) return;

        try {
            const response = await movieActorAPI.getActorsOfMovie(movieId);
            const actorsData = response.data || [];
            setActors(Array.isArray(actorsData) ? actorsData : []);
        } catch (err: any) {
            console.error('Failed to load actors:', err);
            setActors([]);
        }
    }, [movieId]);

    // Auto-load when movieId changes
    useEffect(() => {
        if (movieId) {
            loadMovieDetail();
            loadReviews();
            loadActors();
        }
    }, [movieId, loadMovieDetail, loadReviews, loadActors]);

    return {
        movie,
        reviews,
        actors,
        isLoading,
        error,
        loadMovieDetail,
        loadReviews,
        loadActors,
    };
};
