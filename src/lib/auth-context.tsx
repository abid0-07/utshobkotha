"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

// First, let's fix the type definitions to ensure consistency

// Update the Permission type to include all permissions used in the mock data
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
  | "register_events"

type SocialLoginProvider = "google" | "facebook" | "microsoft"

type UserRole = "admin" | "organizer" | "faculty" | "student"

// Update the User type to match how it's used in the code
type User = {
  id: string
  email: string
  name: string
  role: UserRole
  department?: string
  image?: string
  mfaEnabled: boolean
  phoneNumber?: string
  permissions: Permission[]
  socialLogins: SocialLoginProvider[]
  lastLogin: string
}

// Update the mock users to match the User type
// Replace the mockUsers array with this:
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "admin@diu.edu",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    department: "IT",
    image: "/placeholder.svg?height=30&width=30",
    mfaEnabled: false,
    phoneNumber: "+8801712345678",
    permissions: ["manage_users", "manage_events", "manage_settings", "view_analytics", "manage_finances"],
    socialLogins: [],
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
    mfaEnabled: false,
    phoneNumber: "+8801723456789",
    permissions: ["create_events", "manage_own_events", "view_own_analytics"],
    socialLogins: ["google"],
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
    mfaEnabled: false,
    phoneNumber: "+8801734567890",
    permissions: ["view_events", "register_events", "create_events"],
    socialLogins: [],
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
    mfaEnabled: false,
    phoneNumber: "+8801745678901",
    permissions: ["view_events", "register_events"],
    socialLogins: ["facebook"],
    lastLogin: "2023-06-04T16:45:00Z",
  },
]

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  loginWithSocial: (provider: SocialLoginProvider) => Promise<void>
  register: (name: string, email: string, password: string, role: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  requestPasswordReset: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  verifyMfaCode: (code: string) => Promise<boolean>
  enableMfa: () => Promise<void>
  disableMfa: () => Promise<void>
  hasPermission: (permission: Permission) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingMfaUser, setPendingMfaUser] = useState<User | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      // Remove password from user object before storing
      const { password, ...userWithoutPassword } = foundUser

      // Check if MFA is enabled
      if (userWithoutPassword.mfaEnabled) {
        setPendingMfaUser(userWithoutPassword)
        toast({
          title: "MFA Required",
          description: "Please enter the verification code sent to your device.",
        })
      } else {
        completeLogin(userWithoutPassword as User)
      }
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password.",
      })
      setIsLoading(false)
    }
  }

  const loginWithSocial = async (provider: SocialLoginProvider) => {
    setIsLoading(true)

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Find a user with the specified social login
    const foundUser = mockUsers.find((u) => u.socialLogins.includes(provider))

    if (foundUser) {
      // Remove password from user object before storing
      const { password, ...userWithoutPassword } = foundUser

      // Check if MFA is enabled
      if (userWithoutPassword.mfaEnabled) {
        setPendingMfaUser(userWithoutPassword)
        toast({
          title: "MFA Required",
          description: "Please enter the verification code sent to your device.",
        })
      } else {
        completeLogin(userWithoutPassword as User)
      }
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: `No account linked with ${provider}. Please register or use another method.`,
      })
      setIsLoading(false)
    }
  }

  // Now fix the completeLogin function
  const completeLogin = (userObj: User) => {
    // Update last login time
    const updatedUser: User = {
      ...userObj,
      lastLogin: new Date().toISOString(),
    }

    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))

    toast({
      title: "Login successful",
      description: `Welcome back, ${updatedUser.name}!`,
    })

    router.push("/")
    setIsLoading(false)
  }

  const verifyMfaCode = async (code: string): Promise<boolean> => {
    // Simulate API verification
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, any 6-digit code is accepted
    const isValid = /^\d{6}$/.test(code)

    if (isValid && pendingMfaUser) {
      completeLogin(pendingMfaUser)
      setPendingMfaUser(null)
      return true
    } else {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "Invalid verification code. Please try again.",
      })
      setIsLoading(false)
      return false
    }
  }

  const enableMfa = async () => {
    if (!user) return

    setIsLoading(true)

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const updatedUser = {
      ...user,
      mfaEnabled: true,
    }

    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))

    toast({
      title: "MFA Enabled",
      description: "Two-factor authentication has been enabled for your account.",
    })

    setIsLoading(false)
  }

  const disableMfa = async () => {
    if (!user) return

    setIsLoading(true)

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const updatedUser = {
      ...user,
      mfaEnabled: false,
    }

    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))

    toast({
      title: "MFA Disabled",
      description: "Two-factor authentication has been disabled for your account.",
    })

    setIsLoading(false)
  }

  // Fix the register function
  const register = async (name: string, email: string, password: string, roleInput: string) => {
    setIsLoading(true)

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const userExists = mockUsers.some((u) => u.email === email)

    if (userExists) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Email already exists.",
      })
      setIsLoading(false)
      return
    }

    // Validate role
    const role = roleInput as UserRole
    if (!["admin", "organizer", "faculty", "student"].includes(role)) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Invalid role specified.",
      })
      setIsLoading(false)
      return
    }

    // Determine permissions based on role
    let permissions: Permission[] = []
    if (role === "admin") {
      permissions = ["manage_users", "manage_events", "manage_settings", "view_analytics", "manage_finances"]
    } else if (role === "organizer") {
      permissions = ["create_events", "manage_own_events", "view_own_analytics"]
    } else if (role === "faculty") {
      permissions = ["view_events", "register_events", "create_events"]
    } else {
      permissions = ["view_events", "register_events"]
    }

    // Create new user
    const newUser: User = {
      id: String(mockUsers.length + 1),
      email,
      name,
      role,
      image: "/placeholder.svg?height=30&width=30",
      mfaEnabled: false,
      phoneNumber: "",
      permissions,
      socialLogins: [],
      lastLogin: new Date().toISOString(),
    }

    // For demo purposes - wouldn't store this in a real app
    mockUsers.push({ ...newUser, password })

    // Set the current user
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))

    toast({
      title: "Registration successful",
      description: "Your account has been created.",
    })

    router.push("/")
    setIsLoading(false)
  }

  const requestPasswordReset = async (email: string) => {
    setIsLoading(true)

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const userExists = mockUsers.some((u) => u.email === email)

    if (userExists) {
      toast({
        title: "Reset Email Sent",
        description: "If an account exists with this email, you will receive password reset instructions.",
      })
    } else {
      // For security reasons, don't reveal if the email exists or not
      toast({
        title: "Reset Email Sent",
        description: "If an account exists with this email, you will receive password reset instructions.",
      })
    }

    setIsLoading(false)
  }

  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true)

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, we would validate the token and update the password
    // For demo purposes, we'll just show a success message

    toast({
      title: "Password Reset Successful",
      description: "Your password has been updated. You can now log in with your new password.",
    })

    router.push("/auth/login")
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")

    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    return user.permissions.includes(permission)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithSocial,
        register,
        logout,
        isLoading,
        requestPasswordReset,
        resetPassword,
        verifyMfaCode,
        enableMfa,
        disableMfa,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

