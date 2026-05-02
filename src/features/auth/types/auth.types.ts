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