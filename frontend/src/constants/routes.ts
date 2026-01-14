/**
 * Route paths constants - centralized route definitions
 */
export const ROUTES = {
    // Public routes
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    SEARCH: '/search',

    // Movie routes
    MOVIE_DETAIL: '/movie/:movieId',
    EPISODE_DETAIL: '/episode/:episodeId',

    // Genre routes
    GENRES: '/genres',
    GENRE_DETAIL: '/genre/:genreId',

    // Actor routes
    ACTOR_DETAIL: '/actor/:actorId',

    // User routes
    PROFILE: '/profile',
    WISHLIST: '/wishlist',

    // Admin routes
    ADMIN: '/admin',
    ADMIN_MOVIES: '/admin/movies',
    ADMIN_ACTORS: '/admin/actors',
    ADMIN_DIRECTORS: '/admin/directors',
    ADMIN_GENRES: '/admin/genres',
    ADMIN_MOVIE_GENRES: '/admin/movie-genres',
    ADMIN_MOVIE_ACTORS: '/admin/movie-actors',
} as const;

/**
 * Helper to build route paths with parameters
 */
export const buildRoute = {
    movieDetail: (movieId: number | string) => `/movie/${movieId}`,
    episodeDetail: (episodeId: number | string) => `/episode/${episodeId}`,
    genreDetail: (genreId: number | string) => `/genre/${genreId}`,
    actorDetail: (actorId: number | string) => `/actor/${actorId}`,
    search: (query: string) => `/search?q=${encodeURIComponent(query)}`,
};
