import { useEffect, useRef } from 'react';
import { setupAutoBackup } from './backupService';

/**
 * Cấu hình auto backup
 */
export interface AutoBackupConfig {
  enabled: boolean;
  intervalMinutes: number; // 60 = 1 giờ, 1440 = 1 ngày
  lastBackupTime?: string;
}

const DEFAULT_CONFIG: AutoBackupConfig = {
  enabled: false,
  intervalMinutes: 1440, // 1 ngày
};

/**
 * Lấy cấu hình auto backup từ localStorage
 */
export function getAutoBackupConfig(): AutoBackupConfig {
  try {
    const config = localStorage.getItem('camlease_auto_backup_config');
    return config ? JSON.parse(config) : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

/**
 * Lưu cấu hình auto backup
 */
export function saveAutoBackupConfig(config: AutoBackupConfig): void {
  localStorage.setItem('camlease_auto_backup_config', JSON.stringify(config));
}

/**
 * Custom hook để sử dụng auto backup
 * @example
 * useAutoBackup({ enabled: true, intervalMinutes: 60 });
 */
export function useAutoBackup(
  config: Partial<AutoBackupConfig> = {}
): {
  isEnabled: boolean;
  enable: () => void;
  disable: () => void;
  updateInterval: (minutes: number) => void;
} {
  const stopBackupRef = useRef<(() => void) | null>(null);

  // Khởi tạo auto backup
  useEffect(() => {
    const savedConfig = getAutoBackupConfig();
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    if (mergedConfig.enabled) {
      const intervalMs = mergedConfig.intervalMinutes * 60 * 1000;
      console.log(
        `[AutoBackup] Khởi động backup tự động mỗi ${mergedConfig.intervalMinutes} phút`
      );
      stopBackupRef.current = setupAutoBackup(intervalMs);
    }

    // Cleanup
    return () => {
      if (stopBackupRef.current) {
        stopBackupRef.current();
        stopBackupRef.current = null;
      }
    };
  }, [config]);

  const enable = () => {
    const config = getAutoBackupConfig();
    config.enabled = true;
    saveAutoBackupConfig(config);
    window.location.reload(); // Reload để áp dụng cấu hình
  };

  const disable = () => {
    const config = getAutoBackupConfig();
    config.enabled = false;
    saveAutoBackupConfig(config);
    if (stopBackupRef.current) {
      stopBackupRef.current();
      stopBackupRef.current = null;
    }
  };

  const updateInterval = (minutes: number) => {
    const config = getAutoBackupConfig();
    config.intervalMinutes = Math.max(5, minutes); // Tối thiểu 5 phút
    saveAutoBackupConfig(config);
    window.location.reload();
  };

  return {
    isEnabled: getAutoBackupConfig().enabled,
    enable,
    disable,
    updateInterval,
  };
}
