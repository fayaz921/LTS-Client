import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth.api';
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
        navigate('/app/cases');
      } else {
        alert(response.message || 'Login failed');
      }
    },
    onError: (error: unknown) => {
      alert((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed. Check credentials.');
    }
  });
};