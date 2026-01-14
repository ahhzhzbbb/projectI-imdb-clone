/**
 * UI Constants - colors, sizes, timeouts, etc.
 */

// Carousel settings
export const CAROUSEL = {
    AUTO_SLIDE_INTERVAL: 5000, // ms
    TRANSITION_DURATION: 700, // ms
};

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50,
};

// Rating
export const RATING = {
    MIN: 1,
    MAX: 10,
    DEFAULT: 5,
};

// Debounce delays
export const DEBOUNCE = {
    SEARCH: 300, // ms
    INPUT: 150, // ms
};

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER: 'user',
    THEME: 'theme',
    LAST_SEARCH: 'last_search',
};

// Session Storage Keys
export const SESSION_KEYS = {
    EPISODE_PREFIX: 'episode_',
};

// Breakpoints (match Tailwind)
export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
};

// Colors (for programmatic use)
export const COLORS = {
    PRIMARY: '#eab308', // yellow-500
    PRIMARY_HOVER: '#ca8a04', // yellow-600
    DANGER: '#dc2626', // red-600
    SUCCESS: '#16a34a', // green-600
    INFO: '#3b82f6', // blue-500
};

// User Roles
export const USER_ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER',
} as const;
