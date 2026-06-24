import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Backup configuration
 */
export interface BackupConfig {
  name: string;
  timestamp: string;
  tables: string[];
  size: number;
}

/**
 * Lấy tất cả dữ liệu từ một bảng
 */
async function getTableData(tableName: string): Promise<any[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase.from(tableName).select('*');
    
    if (error) {
      console.warn(`Lỗi lấy dữ liệu từ bảng ${tableName}:`, error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error(`Lỗi khi lấy dữ liệu bảng ${tableName}:`, err);
    return [];
  }
}

/**
 * Tạo backup toàn bộ dữ liệu
 * @param tables Danh sách bảng cần backup (nếu trống sẽ backup tất cả)
 */
export async function createBackup(
  tables: string[] = ['customers', 'cameras', 'contracts', 'expenses']
): Promise<{ success: boolean; backup?: BackupConfig; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase chưa được cấu hình' };
  }

  try {
    const backup: Record<string, any> = {};
    let totalSize = 0;

    // Lấy dữ liệu từ tất cả các bảng
    for (const table of tables) {
      const data = await getTableData(table);
      backup[table] = data;
      totalSize += JSON.stringify(data).length;
    }

    const backupConfig: BackupConfig = {
      name: `backup_${new Date().toISOString().replace(/[:.]/g, '-')}`,
      timestamp: new Date().toISOString(),
      tables,
      size: totalSize,
    };

    // Lưu backup vào localStorage
    const backupData = {
      config: backupConfig,
      data: backup,
    };

    localStorage.setItem(
      `camlease_backup_${backupConfig.name}`,
      JSON.stringify(backupData)
    );

    // Cập nhật danh sách backups
    const backups = getBackupsList();
    backups.push(backupConfig);
    localStorage.setItem('camlease_backups_list', JSON.stringify(backups));

    return {
      success: true,
      backup: backupConfig,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Lỗi không xác định',
    };
  }
}

/**
 * Lấy danh sách tất cả các backups
 */
export function getBackupsList(): BackupConfig[] {
  try {
    const backups = localStorage.getItem('camlease_backups_list');
    return backups ? JSON.parse(backups) : [];
  } catch {
    return [];
  }
}

/**
 * Lấy chi tiết một backup
 */
export function getBackupData(backupName: string): { config: BackupConfig; data: Record<string, any> } | null {
  try {
    const backup = localStorage.getItem(`camlease_backup_${backupName}`);
    return backup ? JSON.parse(backup) : null;
  } catch {
    return null;
  }
}

/**
 * Khôi phục dữ liệu từ một backup
 * @param backupName Tên backup cần khôi phục
 */
export async function restoreBackup(backupName: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase chưa được cấu hình' };
  }

  try {
    const backup = getBackupData(backupName);
    if (!backup) {
      return { success: false, error: 'Backup không tìm thấy' };
    }

    const { data } = backup;

    // Khôi phục dữ liệu cho từng bảng
    for (const [tableName, tableData] of Object.entries(data)) {
      if (!Array.isArray(tableData) || tableData.length === 0) {
        continue;
      }

      // Xóa dữ liệu cũ
      try {
        await supabase?.from(tableName).delete().neq('id', null);
      } catch {
        // Bỏ qua lỗi xóa
      }

      // Chèn dữ liệu mới
      try {
        await supabase?.from(tableName).insert(tableData);
      } catch (err) {
        console.warn(`Lỗi khôi phục bảng ${tableName}:`, err);
      }
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
 * Xóa một backup
 */
export function deleteBackup(backupName: string): boolean {
  try {
    localStorage.removeItem(`camlease_backup_${backupName}`);

    const backups = getBackupsList();
    const filtered = backups.filter((b) => b.name !== backupName);
    localStorage.setItem('camlease_backups_list', JSON.stringify(filtered));

    return true;
  } catch {
    return false;
  }
}

/**
 * Xuất backup thành file JSON
 */
export function exportBackupAsFile(backupName: string): boolean {
  try {
    const backup = getBackupData(backupName);
    if (!backup) return false;

    const dataStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${backupName}.json`;
    link.click();
    URL.revokeObjectURL(url);

    return true;
  } catch {
    return false;
  }
}

/**
 * Import backup từ file JSON
 */
export async function importBackupFromFile(file: File): Promise<{ success: boolean; error?: string; backupName?: string }> {
  try {
    const content = await file.text();
    const backup = JSON.parse(content);

    if (!backup.config || !backup.data) {
      return { success: false, error: 'Định dạng file backup không hợp lệ' };
    }

    const backupName = backup.config.name;
    localStorage.setItem(
      `camlease_backup_${backupName}`,
      JSON.stringify(backup)
    );

    const backups = getBackupsList();
    backups.push(backup.config);
    localStorage.setItem('camlease_backups_list', JSON.stringify(backups));

    return { success: true, backupName };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Lỗi import backup',
    };
  }
}

/**
 * Thiết lập backup tự động
 * @param intervalMs Khoảng thời gian backup (ms)
 */
export function setupAutoBackup(intervalMs: number = 3600000): (() => void) {
  let isAutoBackupEnabled = true;

  const backupInterval = setInterval(async () => {
    if (isAutoBackupEnabled) {
      console.log('[AutoBackup] Bắt đầu backup tự động...');
      const result = await createBackup();
      
      if (result.success) {
        console.log('[AutoBackup] Backup thành công:', result.backup?.name);
      } else {
        console.warn('[AutoBackup] Backup thất bại:', result.error);
      }

      // Xóa backup cũ (giữ lại 5 bản gần nhất)
      const backups = getBackupsList().sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      for (let i = 5; i < backups.length; i++) {
        deleteBackup(backups[i].name);
        console.log('[AutoBackup] Xóa backup cũ:', backups[i].name);
      }
    }
  }, intervalMs);

  // Trả về hàm để dừng auto backup
  return () => {
    isAutoBackupEnabled = false;
    clearInterval(backupInterval);
    console.log('[AutoBackup] Đã dừng backup tự động');
  };
}

/**
 * Lấy kích thước tổng cộng của tất cả backups
 */
export function getTotalBackupSize(): number {
  const backups = getBackupsList();
  return backups.reduce((total, backup) => total + backup.size, 0);
}

/**
 * Định dạng kích thước file
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
