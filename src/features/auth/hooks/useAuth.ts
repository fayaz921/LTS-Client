import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { confirmOtp, forgetPassword, loginUser,logoutUser,SignUpUser, verifyEmail } from '../api/auth.api';
import { useAuthStore } from '../../../store/authStore';

interface JwtPayload {
  nameid: string;
  unique_name: string;
  email: string;
  role: string;
  [key: string]: string;
}
export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (response.isSuccess && response.data?.accessToken) {
        
        // response.data object hai — .accessToken se nikalo
        const token = response.data.accessToken;
        const decoded = jwtDecode<JwtPayload>(token);

        setAuth({
          id: decoded.nameid,
          name: decoded.unique_name,
          email: decoded.email,
          role: decoded.role,
          organizationId: '',
          organizationName: '',
          organizationPlan: '',
          isActive: true,
        }, token);

        navigate('/app/dashboard');
      } else {
        alert(response.message || 'Login failed');
      }
    },
    onError: () => {
      alert('Login failed. Check credentials.');
    }
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearAuth();
      navigate('/login');
    },
    onError: () => {
      // Error aaye tab bhi logout karo
      clearAuth();
      navigate('/login');
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: SignUpUser,
  });
};
export const useConfirmOtp = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: confirmOtp,
    onSuccess: (response) => {
      if (response.isSuccess) {
        alert('Email verified! Please login.');
        navigate('/');
      } else {
        alert(response.message || 'OTP verification failed');
      }
    },
    onError: (error: unknown) => {
      alert((error as unknown as { response?: { data?: { message?: string } } })?.response?.data?.message || 'OTP verification failed.');
    }
  });
};

export const useForgetPassword = () => {
  return useMutation({
    mutationFn: forgetPassword,
    onError: (error: unknown) => {
      alert((error as unknown as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to send OTP.');
    }
  });
};

export const useVerifyEmail = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (response) => {
      if (response.isSuccess) {
        alert('Password reset successful! Please login.');
        navigate('/login');
      } else {
        alert(response.message || 'Password reset failed');
      }
    },
    onError: (error: unknown) => {
      alert((error as unknown as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Password reset failed.');
    }
  });
};
