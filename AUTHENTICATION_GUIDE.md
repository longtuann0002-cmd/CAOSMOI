# 🔐 Hướng Dẫn Sử Dụng Hệ Thống Xác Thực Supabase

## 📚 Tổng Quan

Bạn đã có 2 cách xác thực trong ứng dụng:

### 1. **Xác Thực Cục Bộ** (Local Authentication)
- Dùng tên đăng nhập + mật khẩu
- Lưu trữ trong LocalStorage
- Phù hợp: dev, demo, thử nghiệm

### 2. **Xác Thực Supabase** (Cloud Authentication) ← **CẤU HÌNH MỚI**
- Dùng email + mật khẩu
- Lưu trữ trên Supabase cloud
- Phù hợp: production, chia sẻ dữ liệu

---

## 🚀 Bắt Đầu Nhanh

### Bước 1: Cấu Hình Supabase

Làm theo hướng dẫn trong file [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### Bước 2: Thêm Component Auth Vào Ứng Dụng

**Option A: Sử dụng component Auth riêng biệt**

```typescript
import { Auth } from './components/Auth';

function LoginPage() {
  return (
    <Auth 
      onAuthSuccess={(email) => {
        console.log('Đăng nhập thành công:', email);
        // Chuyển hướng đến dashboard
      }}
    />
  );
}
```

**Option B: Kiểm tra người dùng hiện tại**

```typescript
import { getCurrentUser, signOut } from './utils/auth';

useEffect(() => {
  const checkUser = async () => {
    const user = await getCurrentUser();
    if (user) {
      console.log('Người dùng:', user.email);
    }
  };
  checkUser();
}, []);
```

---

## 📖 API Tham Chiếu

### Đăng Ký Tài Khoản

```typescript
import { signUp } from './utils/auth';

const result = await signUp(
  'user@example.com',
  'password123',
  'Tên Người Dùng'
);

if (result.success) {
  console.log('Đăng ký thành công!');
  console.log('Email:', result.user?.email);
} else {
  console.error('Lỗi:', result.error);
}
```

### Đăng Nhập

```typescript
import { signIn } from './utils/auth';

const result = await signIn('user@example.com', 'password123');

if (result.success) {
  console.log('Đăng nhập thành công!');
  console.log('ID người dùng:', result.user?.id);
} else {
  console.error('Lỗi:', result.error);
}
```

### Lấy Thông Tin Người Dùng Hiện Tại

```typescript
import { getCurrentUser } from './utils/auth';

const user = await getCurrentUser();
if (user) {
  console.log('Email:', user.email);
  console.log('ID:', user.id);
  console.log('Tên:', user.name);
} else {
  console.log('Không có người dùng đã đăng nhập');
}
```

### Đăng Xuất

```typescript
import { signOut } from './utils/auth';

const result = await signOut();
if (result.success) {
  console.log('Đã đăng xuất');
} else {
  console.error('Lỗi đăng xuất:', result.error);
}
```

### Thiết Lập Lại Mật Khẩu

```typescript
import { resetPassword } from './utils/auth';

const result = await resetPassword('user@example.com');
if (result.success) {
  console.log('Email thiết lập lại đã được gửi');
} else {
  console.error('Lỗi:', result.error);
}
```

### Cập Nhật Mật Khẩu

```typescript
import { updatePassword } from './utils/auth';

const result = await updatePassword('newpassword123');
if (result.success) {
  console.log('Mật khẩu đã được cập nhật');
} else {
  console.error('Lỗi:', result.error);
}
```

---

## 🎨 Tùy Chỉnh Component Auth

### Thay Đổi Màu Sắc

```typescript
// Trong Auth.tsx - thay đổi các class Tailwind
className="bg-blue-600 hover:bg-blue-700"  // Thành
className="bg-purple-600 hover:bg-purple-700"  // Màu tím
```

### Thêm Logo

```typescript
// Trong Auth.tsx - thêm sau dòng <h1>
<img 
  src="/logo.png" 
  alt="Logo" 
  className="w-16 h-16 mx-auto mb-4"
/>
```

### Thêm Điều Khoản Sử Dụng

```typescript
// Trong form, thêm:
<label className="flex items-center text-sm">
  <input type="checkbox" className="mr-2" required />
  Tôi đồng ý với <a href="/terms" className="text-blue-600">Điều Khoản Sử Dụng</a>
</label>
```

---

## 🔌 Tích Hợp Với App.tsx

### Cách 1: Hiển Thị Auth Nếu Chưa Đăng Nhập

```typescript
import { Auth } from './components/Auth';
import { useState, useEffect } from 'react';
import { getCurrentUser } from './utils/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!user) {
    return <Auth onAuthSuccess={() => window.location.reload()} />;
  }

  return (
    <div>
      {/* Nội dung ứng dụng chính */}
    </div>
  );
}
```

### Cách 2: Nút Đăng Xuất Trong Sidebar

```typescript
import { signOut } from './utils/auth';

async function handleLogout() {
  const result = await signOut();
  if (result.success) {
    window.location.href = '/';
  }
}

// Trong JSX:
<button 
  onClick={handleLogout}
  className="text-red-600 hover:text-red-700"
>
  <LogOut size={20} /> Đăng Xuất
</button>
```

---

## 🧪 Kiểm Thử

### Kiểm Thử Cục Bộ

1. Chạy ứng dụng:
```bash
npm run dev
```

2. Mở browser: `http://localhost:3000`

3. Kiểm tra:
- ✅ Tạo tài khoản mới
- ✅ Đăng nhập
- ✅ Đăng xuất
- ✅ Không có lỗi console

### Kiểm Thử trên Supabase Dashboard

1. Vào https://app.supabase.com
2. Chọn dự án của bạn
3. Vào **Authentication** → **Users**
4. Xem danh sách người dùng đã đăng ký

---

## 🛡️ Bảo Mật

### Qui Tắc Tốt Nhất

1. **Không lưu mật khẩu trong localStorage**
   - Supabase tự quản lý
   - Sử dụng session cookie

2. **Kích hoạt Confirming Email**
   - Settings → Email Templates
   - Người dùng phải xác nhận email

3. **Thiết Đặt Rate Limiting**
   - Chặn brute force attacks
   - Cấu hình trong Supabase Auth settings

4. **Sử Dụng HTTPS**
   - Production phải dùng HTTPS
   - Bảo vệ dữ liệu truyền tải

5. **Bật 2FA (Two-Factor Authentication)** (nâng cao)
   - Thêm lớp bảo mật thứ 2
   - Supabase hỗ trợ TOTP

---

## 🐛 Xử Lý Sự Cố

### Lỗi: "Supabase chưa được cấu hình"

**Nguyên nhân:** 
- `.env.local` không tồn tại hoặc trống

**Giải pháp:**
```bash
# Tạo file .env.local
cp .env.local.example .env.local

# Điền vào giá trị Supabase URL và Key
# Sau đó khởi động lại: npm run dev
```

### Lỗi: "Email already registered"

**Nguyên nhân:**
- Email đã tồn tại

**Giải pháp:**
- Sử dụng email khác
- Hoặc đăng nhập với email đã có

### Lỗi: "Invalid password"

**Nguyên nhân:**
- Mật khẩu không chính xác hoặc quá ngắn (< 6 ký tự)

**Giải pháp:**
- Kiểm tra email/mật khẩu
- Mật khẩu tối thiểu 6 ký tự

### Lỗi: "Network error"

**Nguyên nhân:**
- Không kết nối internet
- Supabase server down

**Giải pháp:**
- Kiểm tra kết nối internet
- Kiểm tra status Supabase: status.supabase.com

---

## 📞 Liên Hệ Hỗ Trợ

Nếu cần giúp đỡ:
1. Kiểm tra [Supabase Docs](https://supabase.com/docs)
2. Xem logs trong browser Console (F12)
3. Liên hệ Supabase Support

---

## ✅ Danh Sách Kiểm Tra (Checklist)

- [ ] Tạo dự án Supabase
- [ ] Sao chép URL và API Key
- [ ] Tạo `.env.local`
- [ ] Bật Email/Password provider
- [ ] Chạy `npm install`
- [ ] Chạy `npm run dev`
- [ ] Kiểm tra đăng ký/đăng nhập hoạt động
- [ ] Kiểm tra người dùng xuất hiện trong Supabase Dashboard
- [ ] Cấu hình email (tuỳ chọn)
- [ ] Deploy lên production

---

Chúc bạn thành công! 🎉
