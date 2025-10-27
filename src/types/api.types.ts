import { AxiosResponse } from 'axios';

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
