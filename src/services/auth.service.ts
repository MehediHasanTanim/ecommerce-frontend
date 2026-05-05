import { axiosInstance } from '@/lib/axios';
import { 
  LoginResponse, 
  RegisterResponse, 
  RefreshResponse 
} from '@/types/auth';

export const authService = {
  async register(data: any): Promise<RegisterResponse> {
    const response = await axiosInstance.post<RegisterResponse>('auth/register/', data);
    return response.data;
  },

  async login(data: any): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>('auth/login/', data);
    return response.data;
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const response = await axiosInstance.post<RefreshResponse>('auth/refresh/', { 
      refresh: refreshToken 
    });
    return response.data;
  },

  async forgotPassword(username: string): Promise<{ detail: string }> {
    const response = await axiosInstance.post('auth/forgot-password/', { username });
    return response.data;
  },

  async resetPassword(data: any): Promise<{ detail: string }> {
    const response = await axiosInstance.post('auth/reset-password/', data);
    return response.data;
  },
};
