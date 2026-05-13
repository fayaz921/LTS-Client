export interface UpdateProfileCommand {
  name: string;
  phone: string;
  location: string;
}

export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  role: string;
  profilePictureUrl: string | null;
  joinedAt: string;
}

export interface ChangePasswordCommand {
  currentPassword: string;
  otp: string;
  newPassword: string;
}