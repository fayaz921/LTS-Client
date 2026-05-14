import axiosInstance from '../../../lib/axios';
import type { UpdateProfileCommand, ProfileResponse } from '../types/profile.types';
import type { ApiResponse } from '../../auth/types/auth.types';

export const getProfile = async (): Promise<ApiResponse<ProfileResponse>> => {
  const response = await axiosInstance.get('/Profile/GetProfile');
  return response.data;
};

export const updateProfile = async (command: UpdateProfileCommand): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.put('/Profile/UpdateProfile', command);
  return response.data;
};

export const updateProfilePicture = async (file: File): Promise<ApiResponse<string>> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.put('/Profile/UpdateProfilePicture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};


export const sendChangePasswordOtp = async (email: string): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post('/Auth/ForgetPassword', { email });
  return response.data;
};

export const changePassword = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post('/Auth/VerifyEmail', data);
  return response.data;
};