import React from 'react';
import { useAuth } from '../utils/useAuth';
import { LogOut, Mail, Shield, Clock } from 'lucide-react';

/**
 * Component hiển thị thông tin người dùng đã đăng nhập
 * Sử dụng hook useAuth để quản lý trạng thái
 */
export const UserProfile: React.FC = () => {
  const { user, loading, logout, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <p className="text-sm text-yellow-800">Vui lòng đăng nhập để tiếp tục</p>
      </div>
    );
  }

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      // Chuyển hướng hoặc reload
      window.location.href = '/';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      {/* Header */}
      <div className="text-center mb-6 pb-6 border-b">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <Shield className="text-blue-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Hồ Sơ Người Dùng</h2>
      </div>

      {/* Thông tin người dùng */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <Mail className="text-gray-400 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-base font-medium text-gray-900">{user.email}</p>
          </div>
        </div>

        {user.name && (
          <div className="flex items-start gap-3">
            <Shield className="text-gray-400 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600">Tên</p>
              <p className="text-base font-medium text-gray-900">{user.name}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <Clock className="text-gray-400 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-sm text-gray-600">ID Người Dùng</p>
            <p className="text-xs font-mono text-gray-900 break-all">{user.id}</p>
          </div>
        </div>
      </div>

      {/* Nút đăng xuất */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
      >
        <LogOut size={20} />
        Đăng Xuất
      </button>

      {/* Thông tin bảo mật */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>💡 Mẹo:</strong> Tài khoản của bạn được bảo vệ bởi Supabase. 
          Không bao giờ chia sẻ mật khẩu với ai khác.
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
