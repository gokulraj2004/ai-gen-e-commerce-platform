import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Note: Authorization header is set by AuthContext interceptor using in-memory token
// Refresh token is stored in memory and sent explicitly in request body

let refreshTokenStore: string | null = null;

export function setRefreshToken(token: string | null) {
  refreshTokenStore = token;
}

export function getRefreshToken(): string | null {
  return refreshTokenStore;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const currentRefreshToken = getRefreshToken();
      if (!currentRefreshToken) {
        window.dispatchEvent(new CustomEvent('auth-error'));
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: currentRefreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;

        setRefreshToken(newRefreshToken);

        // Dispatch custom event so AuthContext can update in-memory token
        window.dispatchEvent(new CustomEvent('token-refreshed', { detail: { access_token, refresh_token: newRefreshToken } }));

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return apiClient(originalRequest);
      } catch {
        setRefreshToken(null);
        window.dispatchEvent(new CustomEvent('auth-error'));
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;