import apiClient, { setTokens, clearTokens, getRefreshToken } from './client';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UpdateProfileRequest,
  MessageResponse,
} from '../types';

export const authApi = {
  async register(data: RegisterRequest): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/auth/login', data);
    const { access_token, refresh_token } = response.data;
    setTokens(access_token, refresh_token);
    return response.data;
  },

  async refresh(): Promise<TokenResponse> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await apiClient.post<TokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    const { access_token, refresh_token: newRefreshToken } = response.data;
    setTokens(access_token, newRefreshToken);
    return response.data;
  },

  async logout(): Promise<MessageResponse> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      return { message: 'Successfully logged out' };
    }
    try {
      const response = await apiClient.post<MessageResponse>('/auth/logout', {
        refresh_token: refreshToken,
      });
      return response.data;
    } finally {
      clearTokens();
    }
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  async updateMe(data: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.put<User>('/auth/me', data);
    return response.data;
  },
};