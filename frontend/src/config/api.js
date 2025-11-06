// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://localhost:5000/api'
  : 'https://yourtodo-backend.vercel.app/api';

export default API_BASE_URL;