import axiosInstance from '../../../lib/axios';
import type { GetMeResponse } from '../types/auth.types';

import type {
  CreateUserCommand, LoginUserCommand,
  VerifyOtpCommand, ForgetPasswordCommand,
  VerifyEmailCommand, ApiResponse, LoginResponse
} from '../types/auth.types';

export const SignUpUser = async (command: CreateUserCommand): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post('/Auth/SignIn', command);
  return response.data;
};

export const loginUser = async (command: LoginUserCommand): Promise<ApiResponse<LoginResponse>> => {
  const response = await axiosInstance.post('/Auth/Login', command);
  return response.data;
};

export const confirmOtp = async (command: VerifyOtpCommand): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post('/Auth/ConfirmOtp', command);
  return response.data;
};

export const forgetPassword = async (command: ForgetPasswordCommand): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post('/Auth/ForgetPassword', command);
  return response.data;
};

export const verifyEmail = async (command: VerifyEmailCommand): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post('/Auth/VerifyEmail', command);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await axiosInstance.post('/Auth/Logout');
};

export const refreshToken = async (): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post('/Auth/RefreshToken');
  return response.data;
};


export const getMe = async (): Promise<ApiResponse<GetMeResponse>> => {
  const response = await axiosInstance.get('/Auth/Me');
  console.log('GetMe response:', response.data); // Debugging log
  return response.data;
};