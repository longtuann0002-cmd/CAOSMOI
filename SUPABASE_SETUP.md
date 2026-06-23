# Hướng Dẫn Cài Đặt Supabase Authentication

## 📋 Bước 1: Tạo Dự Án Trên Supabase

1. Truy cập [supabase.com](https://supabase.com)
2. Đăng nhập hoặc tạo tài khoản
3. Nhấn "New project"
4. Điền thông tin:
   - **Project name**: Tên dự án của bạn (VD: `camlease-app`)
   - **Database password**: Mật khẩu cơ sở dữ liệu mạnh
   - **Region**: Chọn khu vực gần nhất (VD: Singapore, Tokyo)
5. Nhấn "Create new project" và chờ khởi tạo

## 🔑 Bước 2: Lấy Credentials

1. Vào **Project Settings** (⚙️) -> **API**
2. Sao chép:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 📝 Bước 3: Tạo File `.env.local`

1. Tại thư mục gốc project, tạo file `.env.local`
2. Sao chép nội dung từ `.env.local.example`
3. Điền vào các giá trị đã lấy ở bước 2

**Ví dụ:**
```
VITE_SUPABASE_URL=https://abc123xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔐 Bước 4: Bật Authentication

1. Vào **Authentication** (🔐) trong Supabase
2. Chọn **Providers**
3. Tìm **Email** (Email/Password)
4. Bật toggle (Enable)
5. Cấu hình (tuỳ chọn):
   - Bật "Confirm email" để yêu cầu xác nhận email
   - Cấu hình các tùy chọn bảo mật khác

## 💾 Bước 5: Tạo Bảng Người Dùng (Tuỳ Chọn)

Nếu bạn muốn lưu thêm thông tin người dùng, chạy SQL này trong **SQL Editor**:

```sql
-- Bảng người dùng
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Bảng người dùng Bật RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Cho phép người dùng xem hồ sơ của chính họ
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

-- Cho phép người dùng cập nhật hồ sơ của chính họ
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id);

-- Cho phép insert hồ sơ mới
CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Tạo trigger để tự động tạo hồ sơ khi người dùng đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🧪 Bước 6: Kiểm Tra Kết Nối

Chạy lệnh:
```bash
npm run dev
```

Mở browser tại `http://localhost:3000` và kiểm tra:
- Có thể tạo tài khoản mới
- Có thể đăng nhập/đăng xuất
- Không có lỗi console

## 📧 Bước 7: Cấu Hình Email (Tuỳ Chọn)

Để sử dụng email tùy chỉnh thay vì email mặc định của Supabase:

1. Vào **Settings** → **Email Templates**
2. Chỉnh sửa các template email
3. Hoặc tích hợp dịch vụ email như SendGrid, Mailgun

## 🛡️ Lưu Ý Bảo Mật

⚠️ **QUAN TRỌNG:**
- Không bao giờ commit `.env.local` vào Git
- Không chia sẻ `VITE_SUPABASE_ANON_KEY` công khai
- Luôn sử dụng HTTPS trong production
- Cấu hình RLS (Row-Level Security) cho tất cả bảng
- Định kỳ thay đổi mật khẩu database

## 🚀 Tiếp Theo

Bây giờ bạn có thể:
1. Sử dụng component `<Auth />` để đăng ký/đăng nhập
2. Sử dụng `getCurrentUser()` để lấy thông tin người dùng hiện tại
3. Sử dụng `signOut()` để đăng xuất
4. Tích hợp xác thực vào ứng dụng của bạn

## 🐛 Xử Lý Sự Cố

**Lỗi: "Supabase chưa được cấu hình"**
- Kiểm tra `.env.local` có tồn tại không
- Kiểm tra `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` không trống

**Lỗi: "Email already registered"**
- Email đã tồn tại trong hệ thống
- Hãy đăng nhập thay vì đăng ký

**Lỗi: "Invalid email"**
- Kiểm tra định dạng email (phải có @)

**Không nhận được email xác nhận**
- Kiểm tra thư mục spam/junk
- Kiểm tra email template cấu hình trong Supabase
