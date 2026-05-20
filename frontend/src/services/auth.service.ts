import { apiClient } from '@/lib';
import type { User, ApiResponse } from '@/types';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: User['role'];
}

export const authService = {
  login: (data: LoginPayload) => apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data),
  register: (data: RegisterPayload) => apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),
  me: () => apiClient.get<ApiResponse<User>>('/auth/me'),
};
