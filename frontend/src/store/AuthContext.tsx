import React, { createContext, useContext, useState, useCallback } from 'react';
import type { IUser } from '../types';
import { authAPI } from '../api/authAPI';

interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, confirmPassword: string, phoneNumber?: string) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await authAPI.getCurrentUser();
      // Backend return UserInfoResponse với userId, username, roles (["ROLE_ADMIN"], ["ROLE_USER"]), phoneNumber
      console.log('getCurrentUser response:', response.data);
      const roles = response.data.roles || [];
      // Extract role name: "ROLE_ADMIN" -> "ADMIN", "ROLE_USER" -> "USER"
      const roleName = roles.length > 0 
        ? roles[0].replace('ROLE_', '') 
        : 'USER';
      
      console.log('Parsed roleName:', roleName, 'from roles:', roles);
      
      setUser({
        userId: response.data.userId,
        username: response.data.username,
        phoneNumber: response.data.phoneNumber,
        createdAt: new Date().toISOString(),
        role: {
          id: 1,
          roleName: roleName,
        },
      });
    } catch (error) {
      console.error('Failed to get current user:', error);
      localStorage.removeItem('jwtToken');
      setUser(null);
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await authAPI.login({ username, password });
        // Backend return UserInfoResponse với jwtToken
        if (response.data.jwtToken) {
          localStorage.setItem('jwtToken', response.data.jwtToken);
        }
        await getCurrentUser();
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [getCurrentUser]
  );

  const signup = useCallback(
    async (
      username: string,
      password: string,
      confirmPassword: string,
      phoneNumber?: string
    ) => {
      setIsLoading(true);
      try {
        await authAPI.signup({
          username,
          password,
          confirmPassword,
          phoneNumber,
        });
        // Sau khi signup thành công, tự động login
        await login(username, password);
      } catch (error) {
        console.error('Signup failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
  }, []);

  const value: IAuthContext = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    getCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};
