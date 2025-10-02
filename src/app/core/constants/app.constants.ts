export const APP_CONSTANTS = {
  APP_NAME: 'RasuljonHub',
  APP_VERSION: '1.0.0',
  API_TIMEOUT: 30000,
  PAGE_SIZE: 12,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  DEBOUNCE_TIME: 300,
  TOAST_DURATION: 3000,
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'user_data',
  THEME_KEY: 'theme',
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:id',
  FAVORITES: '/favorites',
  CART: '/cart',
  VIDEO: '/video/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  COURSES: {
    LIST: '/courses',
    DETAIL: '/courses/:id',
    SEARCH: '/courses/search',
    PURCHASED: '/courses/purchased',
    PURCHASE: '/courses/:id/purchase',
  },
  REVIEWS: {
    LIST: '/courses/:id/reviews',
    CREATE: '/reviews',
  },
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized. Please login.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  COURSE_ADDED: 'Course added to cart!',
  COURSE_PURCHASED: 'Course purchased successfully!',
  REVIEW_SUBMITTED: 'Review submitted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
} as const;
