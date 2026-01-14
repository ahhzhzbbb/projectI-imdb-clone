/**
 * API endpoints constants
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: '/auth/login',
        SIGNUP: '/auth/signup',
        LOGOUT: '/auth/signout',
        ME: '/auth/me',
    },

    // Movies
    MOVIES: {
        BASE: '/movies',
        DETAIL: (id: number | string) => `/movies/${id}`,
        SEARCH: '/movies/search',
    },

    // Actors
    ACTORS: {
        BASE: '/actors',
        DETAIL: (id: number | string) => `/actors/${id}`,
    },

    // Directors
    DIRECTORS: {
        BASE: '/directors',
        DETAIL: (id: number | string) => `/directors/${id}`,
    },

    // Genres
    GENRES: {
        BASE: '/genres',
        DETAIL: (id: number | string) => `/genres/${id}`,
        OF_MOVIE: (movieId: number | string) => `/genres/movie/${movieId}`,
    },

    // Reviews
    REVIEWS: {
        OF_MOVIE: (movieId: number | string) => `/reviews/movie/${movieId}`,
        CREATE: (movieId: number | string) => `/reviews/movie/${movieId}`,
        UPDATE: (movieId: number | string) => `/reviews/movie/${movieId}`,
        DELETE: (movieId: number | string) => `/reviews/movie/${movieId}`,
    },

    // Wishlist
    WISHLIST: {
        BASE: '/wishlists',
        ADD: (movieId: number | string) => `/wishlists/${movieId}`,
        REMOVE: (movieId: number | string) => `/wishlists/${movieId}`,
    },

    // Episodes
    EPISODES: {
        DETAIL: (id: number | string) => `/episodes/${id}`,
        RATINGS: (id: number | string) => `/episode-ratings/episode/${id}`,
    },
} as const;
