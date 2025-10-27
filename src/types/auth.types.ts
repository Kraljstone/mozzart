export interface LoginCredentials {
  username: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
}

export interface AuthUser {
  username: string;
  timestamp: number;
}
