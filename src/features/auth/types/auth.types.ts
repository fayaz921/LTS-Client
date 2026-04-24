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

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  isSuccess: boolean;
}