import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { changePassword, getProfile, sendChangePasswordOtp, updateProfile, updateProfilePicture } from '../api/profile.api';
import type { UpdateProfileCommand } from '../types/profile.types';

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: UpdateProfileCommand) => updateProfile(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => updateProfilePicture(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useSendChangePasswordOtp = () => {
  return useMutation({
    mutationFn: (email: string) => sendChangePasswordOtp(email),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};