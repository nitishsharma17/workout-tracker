
const isProduction = import.meta.env.PROD;

const API_BASE_URL = isProduction
  ? import.meta.env.VITE_API_BASE_URL        
  : 'http://localhost:8080';                 

export const API_URLS = {
  LOGIN: `${API_BASE_URL}/api/users/login`,
  REGISTER: `${API_BASE_URL}/api/users/register`,
  WORKOUTS: `${API_BASE_URL}/api/workouts`,
  ADMIN: `${API_BASE_URL}/api/admin`,
  REVIEWS: `${API_BASE_URL}/api/reviews`,
  PROFILE: `${API_BASE_URL}/api/users/profile`,
  FEATURED_WORKOUTS: `${API_BASE_URL}/api/workouts/featured`,
};
