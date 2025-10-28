import axios from 'axios';

export interface ApiError {
  status: number;
  message: string;
  code: string;
  details?: unknown;
}


export const getErrorMessage = (error: unknown, defaultMessage = 'An error occurred'): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.response?.statusText) {
      return error.response.statusText;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};


export const parseApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      status: error.response?.status || 0,
      message: getErrorMessage(error),
      code: `${error.response?.status || 'UNKNOWN'}`,
      details: error.response?.data
    };
  }

  return {
    status: 0,
    message: getErrorMessage(error),
    code: 'UNKNOWN_ERROR',
    details: error
  };
};


export const ERROR_CODES = {
  // Client errors (4xx)
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  TOO_MANY_REQUESTS: 429,

  // Server errors (5xx)
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const;


export const isApiError = (error: unknown): error is { response?: { status: number; data?: unknown } } => {
  return axios.isAxiosError(error);
};


export const getErrorMessageByStatus = (status: number): string => {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This resource already exists or there is a conflict.';
    case 422:
      return 'Validation failed. Please check your input.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error occurred. Please try again later.';
    case 502:
      return 'Bad gateway. The server is temporarily unavailable.';
    case 503:
      return 'Service unavailable. Please try again later.';
    case 504:
      return 'Gateway timeout. The server took too long to respond.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};


export const isRetryableError = (status: number): boolean => {
  return status === 429 || (status >= 500 && status <= 599);
};


export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export const getErrorSeverity = (status: number): ErrorSeverity => {
  if (status === 429) return 'warning';
  if (status >= 500) return 'critical';
  if (status >= 400) return 'error';
  return 'info';
};
