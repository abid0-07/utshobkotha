import api from "./api-service";

// Define types to match your .NET backend
type LoginRequest = {
  email: string;
  password: string;
};

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  role: string;
};

type AuthResponse = {
  token: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
};

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/Login", credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/SignUp", userData);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post("/ForgotPassword", { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post("/ResetPassword", { token, newPassword });
  },
};
