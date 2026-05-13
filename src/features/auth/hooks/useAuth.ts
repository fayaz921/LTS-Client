import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { confirmOtp, forgetPassword, getMe, loginUser, logoutUser, SignUpUser, verifyEmail } from '../api/auth.api';
import { useAuthStore } from '../../../store/authStore';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (response) => {
      if (response.isSuccess && response.data?.accessToken) {
        const token = response.data.accessToken;

        // Step 1 — token pehle store karo taake /me call mein header jayega
        setAccessToken(token);

        try {
          // Step 2 — /me call karo — DB se fresh user data lo
          const meResponse = await getMe();

          if (meResponse.isSuccess && meResponse.data) {
            // Step 3 — poora user data store mein save karo
            setAuth({
              id: meResponse.data.id,
              name: meResponse.data.name,
              email: meResponse.data.email,
              role: meResponse.data.role,
              profileImage: meResponse.data.profileImage,
              organizationId: meResponse.data.organizationId,
              organizationName: meResponse.data.organizationName,
              organizationPlan: meResponse.data.organizationPlan,
              isActive: true,
            }, token);
          }
        } catch {
          // /me fail ho — sirf token se kaam chalaao
          setAuth({
            id: '',
            name: '',
            email: '',
            role: '',
            profileImage: null,
            organizationId: '',
            organizationName: '',
            organizationPlan: '',
            isActive: true,
          }, token);
        }

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
      alert((error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'OTP verification failed.');
    }
  });
};

export const useForgetPassword = () => {
  return useMutation({
    mutationFn: forgetPassword,
    onError: (error: unknown) => {
      alert((error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to send OTP.');
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
      alert((error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Password reset failed.');
    }
  });
};