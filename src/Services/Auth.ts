import axios from 'axios';

// Base API URL - update this to match your backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  token: string;
  user_name: string;
  user_email: string;
  [key: string]: any;
}

interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
  data?: any;
}

/**
 * User login function
 * @param credentials - Login credentials
 * @returns Login response
 */
export const userLogin = async (credentials: LoginCredentials): Promise<ApiResponse> => {
  try {
    const response = await axios.post('/auth/assistLogin', credentials);
    return response.data;
  } catch (error: any) {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      return {
        status: 'error',
        message: error.response.data?.message || 'Login failed',
        data: error.response.data
      };
    } else if (error.request) {
      // Network error
      return {
        status: 'error',
        message: 'Network error. Please check your connection.',
        data: null
      };
    } else {
      // Other error
      return {
        status: 'error',
        message: 'An unexpected error occurred.',
        data: null
      };
    }
  }
};

/**
 * Get user privileges
 * @param user - User object with token
 * @returns Privileges response
 */
export const privileges = async (user: User): Promise<ApiResponse> => {
  try {
    const response = await axios.get('/auth/access', {
      headers: {
        'Authorization': user.token
      }
    });
    return response.data;
  } catch (error: any) {
    // Re-throw the error to be handled by the calling function
    throw error;
  }
}; 