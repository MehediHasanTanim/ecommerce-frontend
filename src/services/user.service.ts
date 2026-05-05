import { axiosInstance } from '@/lib/axios';
import { User } from '@/types/auth';

export const userService = {
  async getMe(): Promise<User> {
    const response = await axiosInstance.get<User>('me/');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await axiosInstance.patch<User>('me/', data);
    return response.data;
  },

  async changePassword(data: any): Promise<{ detail: string }> {
    const response = await axiosInstance.put('me/password/', data);
    return response.data;
  },
};
