import { supabase, isSupabaseConfigured } from './supabase';

/**
 * User session type
 */
export interface UserSession {
  id: string;
  email: string;
  name?: string;
}

/**
 * Đăng ký tài khoản mới
 * @param email Email người dùng
 * @param password Mật khẩu
 * @param fullName Tên đầy đủ (tuỳ chọn)
 * @returns Success status and error message if any
 */
export async function signUp(
  email: string,
  password: string,
  fullName?: string
): Promise<{ success: boolean; error?: string; user?: UserSession }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase chưa được cấu hình' };
  }

  try {
    const { data, error } = await supabase!.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name: fullName,
        },
      };
    }

    return { success: false, error: 'Không thể tạo tài khoản' };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Lỗi không xác định',
    };
  }
}

/**
 * Đăng nhập với email và mật khẩu
 * @param email Email người dùng
 * @param password Mật khẩu
 * @returns Success status and user session
 */
export async function signIn(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: UserSession }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase chưa được cấu hình' };
  }

  try {
    const { data, error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.full_name,
        },
      };
    }

    return { success: false, error: 'Không thể đăng nhập' };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Lỗi không xác định',
    };
  }
}

/**
 * Đăng xuất người dùng hiện tại
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase chưa được cấu hình' };
  }

  try {
    const { error } = await supabase!.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Lỗi không xác định',
    };
  }
}

/**
 * Lấy phiên người dùng hiện tại
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const {
      data: { user },
    } = await supabase!.auth.getUser();

    if (user) {
      return {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name,
      };
    }

    return null;
  } catch (err) {
    console.error('Lỗi lấy phiên người dùng:', err);
    return null;
  }
}

/**
 * Thiết lập lại mật khẩu qua email
 * @param email Email người dùng
 */
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase chưa được cấu hình' };
  }

  try {
    const { error } = await supabase!.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Lỗi không xác định',
    };
  }
}

/**
 * Cập nhật mật khẩu người dùng
 * @param newPassword Mật khẩu mới
 */
export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase chưa được cấu hình' };
  }

  try {
    const { error } = await supabase!.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Lỗi không xác định',
    };
  }
}
