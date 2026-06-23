# 💾 Hướng Dẫn Backup Tự Động

## 📚 Tổng Quan

Hệ thống backup tự động giúp bạn:
- ✅ Bảo vệ dữ liệu khỏi mất mát
- ✅ Khôi phục dữ liệu nhanh chóng nếu có sự cố
- ✅ Duy trì lịch sử dữ liệu
- ✅ Tự động xóa backup cũ (giữ lại 5 bản gần nhất)

---

## 🚀 Bắt Đầu Nhanh

### 1️⃣ Sử Dụng Component AutoBackupSettings

```typescript
import { AutoBackupSettings } from './components/AutoBackupSettings';

export default function SettingsPage() {
  return <AutoBackupSettings />;
}
```

### 2️⃣ Hoặc Sử Dụng Hook useAutoBackup

```typescript
import { useAutoBackup } from './utils/useAutoBackup';

function Dashboard() {
  // Bật backup tự động mỗi 1 giờ
  useAutoBackup({ 
    enabled: true, 
    intervalMinutes: 60 
  });

  return <div>Dashboard</div>;
}
```

### 3️⃣ Quản Lý Backup

```typescript
import { BackupManager } from './components/BackupManager';

export default function BackupPage() {
  return (
    <BackupManager 
      onBackupCreated={() => console.log('Backup created')}
      onBackupRestored={() => console.log('Backup restored')}
    />
  );
}
```

---

## 📖 API Tham Chiếu

### Hàm Backup (`src/utils/backupService.ts`)

| Hàm | Mục Đích | Ví Dụ |
|-----|---------|--------|
| `createBackup()` | Tạo backup thủ công | `await createBackup(['customers', 'cameras'])` |
| `getBackupsList()` | Lấy danh sách backups | `const backups = getBackupsList()` |
| `restoreBackup()` | Khôi phục từ backup | `await restoreBackup('backup_2026-06-24...')` |
| `deleteBackup()` | Xóa một backup | `deleteBackup('backup_name')` |
| `exportBackupAsFile()` | Tải xuống backup | `exportBackupAsFile('backup_name')` |
| `importBackupFromFile()` | Import từ file | `await importBackupFromFile(file)` |
| `setupAutoBackup()` | Bắt đầu backup tự động | `setupAutoBackup(3600000)` |
| `getTotalBackupSize()` | Tổng dung lượng backups | `const size = getTotalBackupSize()` |
| `formatFileSize()` | Định dạng kích thước | `formatFileSize(1048576)` → "1 MB" |

### Hook useAutoBackup

```typescript
const {
  isEnabled,          // Backup tự động có bật không?
  enable,             // Hàm bật auto backup
  disable,            // Hàm tắt auto backup
  updateInterval,     // Cập nhật khoảng thời gian (phút)
} = useAutoBackup({ enabled: true, intervalMinutes: 1440 });
```

---

## 💡 Ví Dụ Thực Tế

### Tạo Backup Thủ Công

```typescript
import { createBackup } from './utils/backupService';

async function handleBackupClick() {
  const result = await createBackup();
  
  if (result.success) {
    alert(`Backup "${result.backup?.name}" created!`);
  } else {
    alert(`Error: ${result.error}`);
  }
}
```

### Khôi Phục Backup

```typescript
import { restoreBackup, getBackupsList } from './utils/backupService';

async function restoreLatestBackup() {
  const backups = getBackupsList();
  if (backups.length > 0) {
    const latestBackup = backups[0];
    const result = await restoreBackup(latestBackup.name);
    
    if (result.success) {
      alert('Data restored!');
      window.location.reload();
    }
  }
}
```

### Bật Auto Backup Lần Đầu

```typescript
import { saveAutoBackupConfig } from './utils/useAutoBackup';

// Bật backup tự động mỗi 1 ngày
saveAutoBackupConfig({
  enabled: true,
  intervalMinutes: 1440, // 24 giờ
});

// Reload để áp dụng
window.location.reload();
```

---

## 🎯 Các Tùy Chọn Cấu Hình

### Backup Intervals (Khoảng thời gian)

| Khoảng | Phút | Hợp Lệ Cho |
|--------|------|-----------|
| 15 phút | 15 | Dev/test |
| 1 giờ | 60 | Studio hoạt động suốt ngày |
| 6 giờ | 360 | Dữ liệu ít thay đổi |
| 1 ngày | 1440 | Ứng dụng không quá quan trọng |

### Recommended Settings

**Cho Studio Cho Thuê (CAMLEASE):**
```javascript
{
  enabled: true,
  intervalMinutes: 60, // Backup mỗi giờ
}
```

**Cho Production:**
```javascript
{
  enabled: true,
  intervalMinutes: 360, // Backup mỗi 6 giờ
}
```

---

## 🛡️ Bảo Mật & Bảo Vệ

### Automated Protection
- ✅ Tự động tạo backup
- ✅ Giữ lại 5 bản gần nhất
- ✅ Xóa backup cũ tự động
- ✅ Lưu trữ trên Supabase + LocalStorage

### Manual Protection
- 📥 Tải xuống backup as JSON file
- 📤 Import backup từ file
- 🔄 Khôi phục bất kỳ lúc nào
- 🗑️ Xóa backup không cần thiết

### Recommended Practices

1. **Bật Auto Backup Hàng Ngày**
   ```javascript
   saveAutoBackupConfig({
     enabled: true,
     intervalMinutes: 1440
   });
   ```

2. **Định Kỳ Tải Xuống**
   - Tải xuống backup quan trọng mỗi tháng
   - Lưu trữ ngoài ứng dụng
   - Giữ trên USB drive hoặc cloud

3. **Kiểm Tra Backup Hoạt Động**
   - Vào "Quản Lý Backup"
   - Xem danh sách backups
   - Kiểm tra thời gian tạo

4. **Test Restore Thường Xuyên**
   - Khôi phục backup trên dev
   - Đảm bảo dữ liệu không bị hỏng

---

## ⚠️ Troubleshooting

### Backup không tự động

**Nguyên nhân:**
- Cấu hình chưa được lưu
- Browser tab không được focus
- Storage quota đầy

**Giải pháp:**
1. Vào AutoBackupSettings
2. Xác nhận "Bật Backup Tự Động" được bật
3. Nhấn "Lưu Cấu Hình"
4. Reload page

### Dung lượng backup quá lớn

**Nguyên nhân:**
- Dữ liệu quá nhiều
- Backup quá lâu chưa xóa

**Giải pháp:**
- Xóa backup cũ thủ công
- Tải xuống và xóa offline
- Giảm tần suất backup

### Khôi phục thất bại

**Nguyên nhân:**
- Supabase không kết nối
- Dữ liệu backup bị hỏng
- Permission không đủ

**Giải pháp:**
1. Kiểm tra kết nối internet
2. Kiểm tra Supabase status
3. Thử backup khác
4. Liên hệ support

---

## 📊 Giám Sát

### Xem Backup Statistics

```typescript
import { 
  getBackupsList, 
  getTotalBackupSize, 
  formatFileSize 
} from './utils/backupService';

const backups = getBackupsList();
const totalSize = getTotalBackupSize();

console.log(`Total backups: ${backups.length}`);
console.log(`Total size: ${formatFileSize(totalSize)}`);
```

### In Ra Thông Tin Backup

```typescript
const backups = getBackupsList();

backups.forEach(backup => {
  console.log(`
    Name: ${backup.name}
    Created: ${new Date(backup.timestamp).toLocaleString()}
    Tables: ${backup.tables.join(', ')}
    Size: ${formatFileSize(backup.size)}
  `);
});
```

---

## 🔄 Workflow Tỉnh Bằng

### Hàng Ngày
1. ✅ Backup tự động chạy mỗi giờ
2. ✅ Kiểm tra danh sách backup (không cần)
3. ✅ Ứng dụng hoạt động bình thường

### Hàng Tuần
1. ✅ Tải xuống 1 backup quan trọng
2. ✅ Lưu trữ ngoài ứng dụng
3. ✅ Kiểm tra log (console)

### Hàng Tháng
1. ✅ Review tất cả backups
2. ✅ Xóa backup không cần thiết
3. ✅ Test restore trên dev
4. ✅ Tải xuống backup critical

---

## 🎉 Kết Luận

Hệ thống backup tự động giúp:
- 🛡️ Bảo vệ dữ liệu 24/7
- ⚡ Khôi phục nhanh chóng
- 📊 Giám sát dễ dàng
- 🔄 Tự động dọn dẹp

**Bắt đầu ngay hôm nay!** 🚀
