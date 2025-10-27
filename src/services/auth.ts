import { apiService } from './api';
import { ApiError } from '@/types/api.types';
import { LoginCredentials, LoginResponse, AuthUser } from '@/types/auth.types';

// Constants
const STORAGE_KEY = 'mozzart_username';
const TIMESTAMP_KEY = 'mozzart_username_timestamp';
const SESSION_DURATION = 24 * 60 * 60 * 1000;

// Helper function to save user session
const saveUserSession = (username: string): void => {
  const timestamp = Date.now();

  localStorage.setItem(STORAGE_KEY, username);
  localStorage.setItem(TIMESTAMP_KEY, timestamp.toString());

  // Dispatch login event for other components
  window.dispatchEvent(
    new CustomEvent('mozzart-login', {
      detail: { username },
    })
  );
};

// Auth service object with methods
export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Validate credentials by making a request to the matches endpoint
      await apiService.get('/api/matches', {
        headers: {
          username: credentials.username,
        },
      });

      // If successful, save to localStorage
      saveUserSession(credentials.username);

      return {
        success: true,
        message: 'Login successful',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: false,
        message: 'Login failed: Unable to connect to server',
      };
    }
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TIMESTAMP_KEY);

    // Dispatch logout event for other components
    window.dispatchEvent(new CustomEvent('mozzart-logout'));
  },

  getCurrentUser(): AuthUser | null {
    const username = localStorage.getItem(STORAGE_KEY);
    const timestamp = localStorage.getItem(TIMESTAMP_KEY);

    if (!username || !timestamp) {
      return null;
    }

    const savedTime = parseInt(timestamp);
    const now = Date.now();

    // Check if session is still valid
    if (now - savedTime >= SESSION_DURATION) {
      authService.logout();
      return null;
    }

    return {
      username,
      timestamp: savedTime,
    };
  },

  isLoggedIn(): boolean {
    return authService.getCurrentUser() !== null;
  },

  // Method to refresh session (extend the timestamp)
  refreshSession(): void {
    const user = authService.getCurrentUser();
    if (user) {
      saveUserSession(user.username);
    }
  },
};

export default authService;
