import axios from 'axios';
import type { CreateUserCommand, LoginUserCommand, ApiResponse } from '../types/auth.types';
const API_URL = 'http://localhost:7142/api/Auth'; // Apne backend ka URL check kar lein

// Sign In (Register) Call
export const registerUser = async (command: CreateUserCommand): Promise<ApiResponse<string>> => {
  const response = await axios.post(`${API_URL}/SignIn`, command);
  return response.data;
}


// Login Call
export const loginUser = async (command: LoginUserCommand): Promise<ApiResponse<any>> => {
  const response = await axios.post(`${API_URL}/Login`, command);
  return response.data;
};