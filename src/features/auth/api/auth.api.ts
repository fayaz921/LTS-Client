import axiosInstance from '../../../lib/axios';
import type { CreateUserCommand, LoginUserCommand, ApiResponse } from '../types/auth.types';


// Sign In (Register) Call
export const SignUpUser = async (command: CreateUserCommand): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post('/Auth/SignIn', command);
  return response.data;
};


// Login Call
export const loginUser = async (command: LoginUserCommand): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post('/Auth/Login', command);
  return response.data;
};