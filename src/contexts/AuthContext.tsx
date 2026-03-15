import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User, LoginCredentials, RegisterData } from "@/types";
import { authService } from "@/services/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check existing login session on mount
  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login Logic
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);

      if (!response?.token || !response?.user) {
        throw new Error("Invalid login response from server");
      }

      // Consistently use "token" to match api.ts interceptor
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setUser(response.user);
    } catch (error: any) {
      console.error("Login error:", error);
      // Pass the actual error message if available, otherwise default
      throw new Error(error.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register Logic (Updated to auto-login)
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      
      // If your backend returns user + token upon successful registration:
      if (response?.token && response?.user) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
      }
      // If your backend ONLY returns a success message, the user will 
      // be redirected to /login by your RegisterPage logic.
    } catch (error: any) {
      console.error("Register error:", error);
      throw new Error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout Logic
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};