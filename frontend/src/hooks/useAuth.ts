import { useAuth } from '../store/AuthContext';

/**
 * Hook kiểm tra user có role admin không
 */
export const useIsAdmin = (): boolean => {
  const { user } = useAuth();
  return user?.role?.roleName === 'ADMIN' || false;
};

/**
 * Hook kiểm tra user có được xác thực không
 */
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

/**
 * Hook lấy user hiện tại
 */
export const useCurrentUser = () => {
  const { user } = useAuth();
  return user;
};
