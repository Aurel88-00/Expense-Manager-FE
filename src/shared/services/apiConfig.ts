import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { 
  getErrorMessage, 
  getErrorMessageByStatus, 
  getErrorSeverity,
  ERROR_CODES
} from '../utils/errorUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;
const retryCount: Record<string, number> = {};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status || 0;
    const config = error.config;

    // Handle 400 Bad Request
    if (status === ERROR_CODES.BAD_REQUEST) {
      const message = getErrorMessage(error, getErrorMessageByStatus(status));
      toast.error(message);
      console.error('Bad Request (400):', error.response?.data);
      return Promise.reject(error);
    }

    // Handle 429 Too Many Requests
    if (status === ERROR_CODES.TOO_MANY_REQUESTS) {
      const retryKey = `${config?.method}_${config?.url}`;
      const currentRetries = retryCount[retryKey] || 0;

      if (currentRetries < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetries); 
        retryCount[retryKey] = currentRetries + 1;

        toast.loading(
          `Rate limited. Retrying in ${Math.ceil(delay / 1000)}s (Attempt ${currentRetries + 1}/${MAX_RETRIES})...`,
          { id: `rate-limit-${retryKey}` }
        );

        await new Promise(resolve => setTimeout(resolve, delay));

        if (config) {
          return api(config);
        }
      } else {
        delete retryCount[retryKey];
        const message = 'Too many requests. Please wait a few minutes and try again.';
        toast.error(message);
        console.error('Rate Limit Exceeded (429):', error.response?.data);
        return Promise.reject(error);
      }
    }

    // Handle 500+ Server Errors
    if (status >= 500) {
      const retryKey = `${config?.method}_${config?.url}`;
      const currentRetries = retryCount[retryKey] || 0;

      if (currentRetries < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetries); 
        retryCount[retryKey] = currentRetries + 1;

        const severity = getErrorSeverity(status);
        const message = getErrorMessageByStatus(status);

        toast.loading(
          `Server error. Retrying in ${Math.ceil(delay / 1000)}s...`,
          { id: `server-error-${retryKey}` }
        );

        console.error(`Server Error (${status}):`, {
          status,
          severity,
          message,
          data: error.response?.data
        });

        await new Promise(resolve => setTimeout(resolve, delay));

        if (config) {
          return api(config);
        }
      } else {
        delete retryCount[retryKey];
        const message = getErrorMessageByStatus(status);
        toast.error(`${message} (Retried ${MAX_RETRIES} times)`);
        console.error(`Server Error (${status}) - Max Retries Exceeded:`, error.response?.data);
        return Promise.reject(error);
      }
    }

    // Handle other 4xx errors
    if (status >= 400 && status < 500) {
      const message = getErrorMessage(error, getErrorMessageByStatus(status));
      toast.error(message);
      console.warn(`Client Error (${status}):`, error.response?.data);
      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection and try again.');
      console.error('Network Error:', error.message);
      return Promise.reject(error);
    }

    // Fallback error handling
    const fallbackMessage = getErrorMessage(error, 'An unexpected error occurred');
    toast.error(fallbackMessage);
    console.error('Unexpected Error:', error);

    return Promise.reject(error);
  }
);

export default api;
