import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiError, ApiConfig } from '@/types/api.types';

// Default configuration
const defaultConfig: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create axios instance
const axiosInstance = axios.create(defaultConfig);

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const message =
        (error.response.data as { error?: string })?.error ||
        `HTTP ${error.response.status}: ${error.response.statusText}`;
      throw new ApiError(message, error.response.status, error.response);
    } else if (error.request) {
      // Request was made but no response received
      throw new ApiError('Network error', 0);
    } else {
      // Something else happened
      throw new ApiError(error.message || 'Unknown error', 0);
    }
  }
);

// Helper function for making requests
const request = async <T>(
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>({
      url: endpoint,
      ...config,
    });
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new ApiError('Request timeout', 408);
      }
      throw new ApiError(error.message || 'Network error', 0);
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error',
      0
    );
  }
};

// Export API service object directly
export const apiService = {
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return request<T>(endpoint, { ...config, method: 'GET' });
  },

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return request<T>(endpoint, {
      ...config,
      method: 'POST',
      data,
    });
  },

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return request<T>(endpoint, {
      ...config,
      method: 'PUT',
      data,
    });
  },

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return request<T>(endpoint, { ...config, method: 'DELETE' });
  },
};

// Keep the factory function for custom configurations if needed
export const createApiService = (config: Partial<ApiConfig> = {}) => {
  const mergedConfig = { ...defaultConfig, ...config };
  const customAxiosInstance = axios.create(mergedConfig);

  // Apply same interceptors
  customAxiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response) {
        const message =
          (error.response.data as { error?: string })?.error ||
          `HTTP ${error.response.status}: ${error.response.statusText}`;
        throw new ApiError(message, error.response.status, error.response);
      } else if (error.request) {
        throw new ApiError('Network error', 0);
      } else {
        throw new ApiError(error.message || 'Unknown error', 0);
      }
    }
  );

  const customRequest = async <T>(
    endpoint: string,
    requestConfig: AxiosRequestConfig = {}
  ): Promise<T> => {
    try {
      const response = await customAxiosInstance.request<T>({
        url: endpoint,
        ...requestConfig,
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new ApiError('Request timeout', 408);
        }
        throw new ApiError(error.message || 'Network error', 0);
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        0
      );
    }
  };

  return {
    async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
      return customRequest<T>(endpoint, { ...config, method: 'GET' });
    },

    async post<T>(
      endpoint: string,
      data?: unknown,
      config?: AxiosRequestConfig
    ): Promise<T> {
      return customRequest<T>(endpoint, {
        ...config,
        method: 'POST',
        data,
      });
    },

    async put<T>(
      endpoint: string,
      data?: unknown,
      config?: AxiosRequestConfig
    ): Promise<T> {
      return customRequest<T>(endpoint, {
        ...config,
        method: 'PUT',
        data,
      });
    },

    async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
      return customRequest<T>(endpoint, { ...config, method: 'DELETE' });
    },
  };
};
