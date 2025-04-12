"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import api from "./api-service";

// Permission types for role-based access control
type Permission =
  | "manage_users"
  | "manage_events"
  | "manage_settings"
  | "view_analytics"
  | "manage_finances"
  | "create_events"
  | "manage_own_events"
  | "view_own_analytics"
  | "view_events"
  | "register_events";

type UserRole = "admin" | "organizer" | "faculty" | "student";

// User type definition
type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  image?: string;
  phoneNumber?: string;
  permissions: Permission[];
  lastLogin: string;
};

// API response types
type AuthResponse = {
  token: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  department?: string;
  image?: string;
  phoneNumber?: string;
};

// For fallback/development mode
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "admin@diu.edu",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    department: "IT",
    image: "/placeholder.svg?height=30&width=30",
    phoneNumber: "+8801712345678",
    permissions: [
      "manage_users",
      "manage_events",
      "manage_settings",
      "view_analytics",
      "manage_finances",
    ],
    lastLogin: "2023-06-01T10:30:00Z",
  },
  {
    id: "2",
    email: "organizer@diu.edu",
    password: "organizer123",
    name: "Event Organizer",
    role: "organizer",
    department: "Computer Science",
    image: "/placeholder.svg?height=30&width=30",
    phoneNumber: "+8801723456789",
    permissions: ["create_events", "manage_own_events", "view_own_analytics"],
    lastLogin: "2023-06-02T14:20:00Z",
  },
  {
    id: "3",
    email: "faculty@diu.edu",
    password: "faculty123",
    name: "Faculty Member",
    role: "faculty",
    department: "Engineering",
    image: "/placeholder.svg?height=30&width=30",
    phoneNumber: "+8801734567890",
    permissions: ["view_events", "register_events", "create_events"],
    lastLogin: "2023-06-03T09:15:00Z",
  },
  {
    id: "4",
    email: "student@diu.edu",
    password: "student123",
    name: "Student User",
    role: "student",
    department: "Business",
    image: "/placeholder.svg?height=30&width=30",
    phoneNumber: "+8801745678901",
    permissions: ["view_events", "register_events"],
    lastLogin: "2023-06-04T16:45:00Z",
  },
];

// Context type definition
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Configuration flag for development mode
const USE_MOCK_DATA = false; // Set to false to use real API

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    if (USE_MOCK_DATA) {
      // Mock login for development
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        completeLogin(userWithoutPassword as User);
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password.",
        });
        setIsLoading(false);
      }
    } else {
      // Real API login
      try {
        const response = await api.post<AuthResponse>("/Login", {
          email,
          password,
        });

        // Create user object from API response
        const user: User = {
          id: response.data.userId,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role as UserRole,
          department: response.data.department,
          image: response.data.image,
          phoneNumber: response.data.phoneNumber,
          permissions: response.data.permissions as Permission[],
          lastLogin: new Date().toISOString(),
        };

        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        completeLogin(user);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description:
            error.response?.data?.message || "Invalid email or password.",
        });
        setIsLoading(false);
      }
    }
  };

  const completeLogin = (userObj: User) => {
    // Update last login time
    const updatedUser: User = {
      ...userObj,
      lastLogin: new Date().toISOString(),
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    toast({
      title: "Login successful",
      description: `Welcome back, ${updatedUser.name}!`,
    });

    router.push("/");
    setIsLoading(false);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    roleInput: string
  ) => {
    setIsLoading(true);

    if (USE_MOCK_DATA) {
      // Mock register for development
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const userExists = mockUsers.some((u) => u.email === email);

      if (userExists) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "Email already exists.",
        });
        setIsLoading(false);
        return;
      }

      const role = roleInput as UserRole;
      if (!["admin", "organizer", "faculty", "student"].includes(role)) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "Invalid role specified.",
        });
        setIsLoading(false);
        return;
      }

      let permissions: Permission[] = [];
      if (role === "admin") {
        permissions = [
          "manage_users",
          "manage_events",
          "manage_settings",
          "view_analytics",
          "manage_finances",
        ];
      } else if (role === "organizer") {
        permissions = [
          "create_events",
          "manage_own_events",
          "view_own_analytics",
        ];
      } else if (role === "faculty") {
        permissions = ["view_events", "register_events", "create_events"];
      } else {
        permissions = ["view_events", "register_events"];
      }

      const newUser: User = {
        id: String(mockUsers.length + 1),
        email,
        name,
        role,
        image: "/placeholder.svg?height=30&width=30",
        phoneNumber: "",
        permissions,
        lastLogin: new Date().toISOString(),
      };

      mockUsers.push({ ...newUser, password });
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });

      router.push("/");
    } else {
      // Real API register
      try {
        const response = await api.post<AuthResponse>("/SignUp", {
          name,
          email,
          password,
          role: roleInput,
        });

        // Create user object from API response
        const user: User = {
          id: response.data.userId,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role as UserRole,
          department: response.data.department,
          image: response.data.image || "/placeholder.svg?height=30&width=30",
          phoneNumber: response.data.phoneNumber || "",
          permissions: response.data.permissions as Permission[],
          lastLogin: new Date().toISOString(),
        };

        // Store token in localStorage
        localStorage.setItem("token", response.data.token);

        // Store user in state and localStorage
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        toast({
          title: "Registration successful",
          description: "Your account has been created.",
        });

        router.push("/");
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description:
            error.response?.data?.message || "Failed to create account.",
        });
      }
    }

    setIsLoading(false);
  };

  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);

    if (USE_MOCK_DATA) {
      // Mock request for development
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Reset Email Sent",
        description:
          "If an account exists with this email, you will receive password reset instructions.",
      });
    } else {
      // Real API request
      try {
        await api.post("/ForgotPassword", { email });

        toast({
          title: "Reset Email Sent",
          description:
            "If an account exists with this email, you will receive password reset instructions.",
        });
      } catch (error) {
        // For security reasons, don't change the message even if there's an error
        toast({
          title: "Reset Email Sent",
          description:
            "If an account exists with this email, you will receive password reset instructions.",
        });
      }
    }

    setIsLoading(false);
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);

    if (USE_MOCK_DATA) {
      // Mock reset for development
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Password Reset Successful",
        description:
          "Your password has been updated. You can now log in with your new password.",
      });

      router.push("/auth/login");
    } else {
      // Real API reset
      try {
        await api.post("/ResetPassword", { token, newPassword });

        toast({
          title: "Password Reset Successful",
          description:
            "Your password has been updated. You can now log in with your new password.",
        });

        router.push("/auth/login");
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Password Reset Failed",
          description:
            error.response?.data?.message ||
            "Failed to reset password. Please try again.",
        });
      }
    }

    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Optional: Call logout endpoint if needed
    if (!USE_MOCK_DATA) {
      api.post("/Logout").catch(() => {
        // Silent catch - we don't want to show errors on logout
      });
    }

    router.push("/");

    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        requestPasswordReset,
        resetPassword,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
