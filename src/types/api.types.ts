import { AxiosResponse } from 'axios';
import { BaseApiResponse } from './base.types';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: AxiosResponse
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export type ApiResponse<T = unknown> = BaseApiResponse<T>;
