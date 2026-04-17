import apiClient, { setTokens, clearTokens, getRefreshToken } from './client';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  TokenResponse,
  MessageResponse,
} from '../types';

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>('/auth/login', data);
  const tokens = response.data;
  setTokens(tokens.access_token, tokens.refresh_token);
  return tokens;
}

export async function register(data: RegisterRequest): Promise<User> {
  const response = await apiClient.post<User>('/auth/register', data);
  return response.data;
}

export async function refreshToken(): Promise<TokenResponse> {
  const currentRefreshToken = getRefreshToken();
  if (!currentRefreshToken) {
    throw new Error('No refresh token available');
  }
  const response = await apiClient.post<TokenResponse>('/auth/refresh', {
    refresh_token: currentRefreshToken,
  });
  const tokens = response.data;
  setTokens(tokens.access_token, tokens.refresh_token);
  return tokens;
}

export async function logout(): Promise<MessageResponse> {
  const currentRefreshToken = getRefreshToken();
  if (!currentRefreshToken) {
    clearTokens();
    return { message: 'Successfully logged out' };
  }
  try {
    const response = await apiClient.post<MessageResponse>('/auth/logout', {
      refresh_token: currentRefreshToken,
    });
    return response.data;
  } finally {
    clearTokens();
  }
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
}

export async function updateMe(data: UpdateProfileRequest): Promise<User> {
  const response = await apiClient.put<User>('/auth/me', data);
  return response.data;
}