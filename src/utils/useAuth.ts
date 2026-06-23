import { useState, useEffect } from 'react';
import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser, 
  UserSession 
} from './auth';

/**
 * Custom hook để quản lý xác thực
 * @example
 * const { user, loading, error, login, logout } = useAuth();
 */
export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra phiên người dùng khi component mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Lỗi kiểm tra phiên:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  /**
   * Đăng nhập
   */
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const result = await signIn(email, password);
    
    if (result.success) {
      setUser(result.user || null);
    } else {
      setError(result.error || 'Lỗi đăng nhập');
    }
    
    setLoading(false);
    return result;
  };

  /**
   * Đăng ký
   */
  const register = async (
    email: string,
    password: string,
    fullName?: string
  ) => {
    setLoading(true);
    setError(null);

    const result = await signUp(email, password, fullName);
    
    if (result.success) {
      setUser(result.user || null);
    } else {
      setError(result.error || 'Lỗi đăng ký');
    }
    
    setLoading(false);
    return result;
  };

  /**
   * Đăng xuất
   */
  const logout = async () => {
    setLoading(true);
    setError(null);

    const result = await signOut();
    
    if (result.success) {
      setUser(null);
    } else {
      setError(result.error || 'Lỗi đăng xuất');
    }
    
    setLoading(false);
    return result;
  };

  /**
   * Xóa thông báo lỗi
   */
  const clearError = () => setError(null);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  };
}

/**
 * Custom hook để bảo vệ route
 * @example
 * const ProtectedRoute = () => {
 *   const auth = useAuthProtection();
 *   return auth.isAuthenticated ? <Dashboard /> : <Auth />;
 * };
 */
export function useAuthProtection() {
  const { user, loading, isAuthenticated } = useAuth();

  return {
    user,
    loading,
    isAuthenticated,
    requireAuth: isAuthenticated,
  };
}
