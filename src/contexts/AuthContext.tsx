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

// Check existing login session
useEffect(() => {
const storedUser = localStorage.getItem("user");
const token = localStorage.getItem("token");


if (storedUser && token) {
  try {
    setUser(JSON.parse(storedUser));
  } catch (error) {
    console.error("Invalid user in localStorage", error);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}

setIsLoading(false);


}, []);

// Login
const login = useCallback(async (credentials: LoginCredentials) => {
setIsLoading(true);


try {
  const response = await authService.login(credentials);

  if (!response?.token || !response?.user) {
    throw new Error("Invalid login response");
  }

  localStorage.setItem("token", response.token);
  localStorage.setItem("user", JSON.stringify(response.user));

  setUser(response.user);
} catch (error) {
  console.error("Login error:", error);
  throw new Error("Invalid email or password");
} finally {
  setIsLoading(false);
}


}, []);

// Register
const register = useCallback(async (data: RegisterData) => {
setIsLoading(true);


try {
  await authService.register(data);
} catch (error) {
  console.error("Register error:", error);
  throw new Error("Registration failed. Please try again.");
} finally {
  setIsLoading(false);
}


}, []);

// Logout
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
{children}
</AuthContext.Provider>
);
};
