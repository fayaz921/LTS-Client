import { useMutation } from '@tanstack/react-query';
import { registerUser, loginUser } from '../api/auth.api';
import { useAuthStore } from '../../../store/authStore';

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert("Registration Successful! Please check email for OTP.");
    },
    onError: (error: any) => {
      alert(error.response?.data?.Message || "Registration failed");
    }
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      // Image 2 ke authStore mein token aur user save karega
      setAuth(response.data.user, response.data.token);
    }
  });
};