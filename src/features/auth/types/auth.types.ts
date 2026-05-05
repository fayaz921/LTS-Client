export interface CreateUserCommand {
  organizationName: string;
  ownerName: string;
  email: string;
  password: string;
}

export interface LoginUserCommand {
  email: string;
  password: string;
}


export interface VerifyOtpCommand {
  email: string;
  otp: string;
}

export interface ForgetPasswordCommand {
  email: string;
}

export interface VerifyEmailCommand {
  email: string;
  otp: string;
  newPassword: string;
}


export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  isSuccess: boolean;
}


// Login response ka type
// LoginResponse already hai — bas use karo
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// User info — JWT se parse hoga
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
  organizationName: string;
  organizationPlan: string;
  isActive: boolean;
}