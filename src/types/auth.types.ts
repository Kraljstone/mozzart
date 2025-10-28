import { BaseApiResponse, Timestamped } from './base.types';

export interface LoginCredentials {
  username: string;
}

export type LoginResponse = BaseApiResponse;

export interface AuthUser extends Timestamped {
  username: string;
}
