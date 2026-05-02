import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { confirmOtp, forgetPassword, loginUser,SignUpUser, verifyEmail } from '../api/auth.api';
import { useAuthStore } from '../../../store/authStore';


export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (response.isSuccess) {
        setAuth({
          id: '',
          name: '',
          email: '',
          role: '',
          organizationId: '',
          organizationName: '',
          organizationPlan: '',
          isActive: false
        } , response.data);
        navigate('/');
      } else {
        alert(response.message || 'Login failed');
      }
    },
    onError: (error: unknown) => {
      alert((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed. Check credentials.');
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
