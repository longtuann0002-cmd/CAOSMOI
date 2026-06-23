import React, { useState, useEffect, useRef } from 'react';
import {
  createBackup,
  getBackupsList,
  deleteBackup,
  restoreBackup,
  exportBackupAsFile,
  importBackupFromFile,
  getTotalBackupSize,
  formatFileSize,
  BackupConfig,
} from '../utils/backupService';
import {
  Download,
  Upload,
  Trash2,
  RotateCcw,
  Plus,
  Calendar,
  HardDrive,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface BackupManagerProps {
  onBackupCreated?: () => void;
  onBackupRestored?: () => void;
}

export const BackupManager: React.FC<BackupManagerProps> = ({
  onBackupCreated,
  onBackupRestored,
}) => {
  const [backups, setBackups] = useState<BackupConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tải danh sách backups
  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = () => {
    const list = getBackupsList().sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setBackups(list);
  };

  // Tạo backup mới
  const handleCreateBackup = async () => {
    setLoading(true);
    setMessage(null);

    const result = await createBackup();

    if (result.success) {
      setMessage({
        type: 'success',
        text: `✓ Backup "${result.backup?.name}" đã được tạo thành công!`,
      });
      loadBackups();
      onBackupCreated?.();
    } else {
      setMessage({
        type: 'error',
        text: `✗ Lỗi tạo backup: ${result.error}`,
      });
    }

    setLoading(false);
  };

  // Khôi phục backup
  const handleRestoreBackup = async (backupName: string) => {
    setLoading(true);
    setMessage(null);

    const result = await restoreBackup(backupName);

    if (result.success) {
      setMessage({
        type: 'success',
        text: `✓ Đã khôi phục backup "${backupName}" thành công!`,
      });
      setConfirmRestore(false);
      setSelectedBackup(null);
      onBackupRestored?.();
    } else {
      setMessage({
        type: 'error',
        text: `✗ Lỗi khôi phục: ${result.error}`,
      });
    }

    setLoading(false);
  };

  // Xóa backup
  const handleDeleteBackup = (backupName: string) => {
    if (deleteBackup(backupName)) {
      setMessage({
        type: 'success',
        text: `✓ Đã xóa backup "${backupName}"`,
      });
      loadBackups();
    } else {
      setMessage({
        type: 'error',
        text: 'Lỗi xóa backup',
      });
    }
  };

  // Xuất backup
  const handleExportBackup = (backupName: string) => {
    if (exportBackupAsFile(backupName)) {
      setMessage({
        type: 'success',
        text: `✓ Đã tải xuống backup "${backupName}.json"`,
      });
    } else {
      setMessage({
        type: 'error',
        text: 'Lỗi xuất backup',
      });
    }
  };

  // Import backup
  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage(null);

    const result = await importBackupFromFile(file);

    if (result.success) {
      setMessage({
        type: 'success',
        text: `✓ Đã import backup "${result.backupName}" thành công!`,
      });
      loadBackups();
    } else {
      setMessage({
        type: 'error',
        text: `✗ Lỗi import: ${result.error}`,
      });
    }

    setLoading(false);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const totalSize = getTotalBackupSize();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HardDrive className="text-blue-600" />
          Quản Lý Backup
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Sao lưu và khôi phục dữ liệu ứng dụng tự động hoặc thủ công
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Tổng Backups</p>
          <p className="text-2xl font-bold text-blue-900">{backups.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium">Tổng Dung Lượng</p>
          <p className="text-2xl font-bold text-green-900">{formatFileSize(totalSize)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Tối Đa Giữ Lại</p>
          <p className="text-2xl font-bold text-purple-900">5 bản</p>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`rounded-lg p-4 mb-6 flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle size={20} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={20} className="flex-shrink-0" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleCreateBackup}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          <Plus size={20} />
          Tạo Backup Mới
        </button>

        <label className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer">
          <Upload size={20} />
          Import Backup
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportBackup}
            disabled={loading}
            className="hidden"
          />
        </label>
      </div>

      {/* Backup List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Danh Sách Backups</h3>

        {backups.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <Clock className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-gray-600">Chưa có backup nào</p>
            <p className="text-gray-500 text-sm">Nhấn "Tạo Backup Mới" để bắt đầu</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {backups.map((backup) => (
              <div
                key={backup.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <p className="font-medium text-gray-900">{backup.name}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span>{new Date(backup.timestamp).toLocaleString('vi-VN')}</span>
                    <span>
                      {backup.tables.length} bảng • {formatFileSize(backup.size)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Restore Button */}
                  <button
                    onClick={() => {
                      setSelectedBackup(backup.name);
                      setConfirmRestore(true);
                    }}
                    disabled={loading || confirmRestore}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                    title="Khôi phục"
                  >
                    <RotateCcw size={18} />
                  </button>

                  {/* Export Button */}
                  <button
                    onClick={() => handleExportBackup(backup.name)}
                    disabled={loading}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                    title="Tải xuống"
                  >
                    <Download size={18} />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteBackup(backup.name)}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Restore Modal */}
      {confirmRestore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Xác Nhận Khôi Phục</h3>
            <p className="text-gray-600 mb-4">
              Bạn có chắc muốn khôi phục backup "{selectedBackup}"? Dữ liệu hiện tại sẽ bị thay thế.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmRestore(false);
                  setSelectedBackup(null);
                }}
                disabled={loading}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (selectedBackup) handleRestoreBackup(selectedBackup);
                }}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                {loading ? 'Đang khôi phục...' : 'Xác Nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>💡 Mẹo:</strong> Các backups cũ hơn 5 bản sẽ tự động bị xóa. 
          Tải xuống các backups quan trọng để lưu trữ lâu dài.
        </p>
      </div>
    </div>
  );
};

export default BackupManager;
