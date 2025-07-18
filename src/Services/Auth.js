import axios from 'axios';

// Base API URL - update this to match your backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

/**
 * User login function
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Login response
 */
export const userLogin = async (credentials) => {
  try {
    const response = await axios.post('/auth/assistLogin', credentials);
    return response.data;
  } catch (error) {
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
 * @param {Object} user - User object with token
 * @returns {Promise<Object>} Privileges response
 */
export const privileges = async (user) => {
  try {
    const response = await axios.get('/auth/access', {
      headers: {
        'Authorization': user.token
      }
    });
    return response.data;
  } catch (error) {
    // Re-throw the error to be handled by the calling function
    throw error;
  }
};
