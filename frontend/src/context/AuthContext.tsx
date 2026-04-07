import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginRequest, RegisterRequest, AuthContextType } from '../types/auth';
import apiClient from '../api/client';
import { setRefreshToken, getRefreshToken } from '../api/client';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!accessToken;

  // Set up axios interceptor to use in-memory token
  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  // Listen for token refresh events from the interceptor
  useEffect(() => {
    const handleTokenRefreshed = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { access_token, refresh_token } = customEvent.detail;
      setAccessToken(access_token);
      if (refresh_token) {
        setRefreshToken(refresh_token);
      }
    };

    const handleAuthError = () => {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    };

    window.addEventListener('token-refreshed', handleTokenRefreshed);
    window.addEventListener('auth-error', handleAuthError);

    return () => {
      window.removeEventListener('token-refreshed', handleTokenRefreshed);
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const response = await apiClient.get('/auth/me');
      setUser(response.data);
    } catch {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedRefreshToken = getRefreshToken();
      if (!storedRefreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.post('/auth/refresh', {
          refresh_token: storedRefreshToken,
        });
        const { access_token, refresh_token: newRefreshToken } = response.data;
        setAccessToken(access_token);
        setRefreshToken(newRefreshToken);

        // Temporarily set the token for the getMe call
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        const meResponse = await apiClient.get('/auth/me');
        delete apiClient.defaults.headers.common['Authorization'];
        setUser(meResponse.data);
      } catch {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [fetchUser]);

  const login = async (data: LoginRequest) => {
    const response = await apiClient.post('/auth/login', data);
    const { access_token, refresh_token } = response.data;
    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    // Fetch user data after login
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    const meResponse = await apiClient.get('/auth/me');
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(meResponse.data);
  };

  const register = async (data: RegisterRequest) => {
    // Register returns a User object, not tokens. So we need to login after registration.
    await apiClient.post('/auth/register', data);

    // Now login with the same credentials
    const loginResponse = await apiClient.post('/auth/login', {
      email: data.email,
      password: data.password,
    });
    const { access_token, refresh_token } = loginResponse.data;
    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    // Fetch user data
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    const meResponse = await apiClient.get('/auth/me');
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(meResponse.data);
  };

  const logout = async () => {
    try {
      const currentRefreshToken = getRefreshToken();
      if (currentRefreshToken) {
        await apiClient.post('/auth/logout', { refresh_token: currentRefreshToken });
      }
    } catch {
      // ignore logout errors
    }
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};