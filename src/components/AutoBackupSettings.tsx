import React, { useState } from 'react';
import {
  getAutoBackupConfig,
  saveAutoBackupConfig,
  useAutoBackup,
  AutoBackupConfig,
} from '../utils/useAutoBackup';
import {
  ToggleLeft,
  ToggleRight,
  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export const AutoBackupSettings: React.FC = () => {
  const config = getAutoBackupConfig();
  const [localConfig, setLocalConfig] = useState<AutoBackupConfig>(config);
  const [saved, setSaved] = useState(false);

  const { updateInterval } = useAutoBackup(localConfig);

  const handleToggle = () => {
    const newConfig = {
      ...localConfig,
      enabled: !localConfig.enabled,
    };
    setLocalConfig(newConfig);
    setSaved(false);
  };

  const handleIntervalChange = (minutes: number) => {
    const newConfig = {
      ...localConfig,
      intervalMinutes: Math.max(5, minutes),
    };
    setLocalConfig(newConfig);
    setSaved(false);
  };

  const handleSave = () => {
    saveAutoBackupConfig(localConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

    if (localConfig.enabled) {
      updateInterval(localConfig.intervalMinutes);
    }
  };

  const presets = [
    { label: '15 phút', minutes: 15 },
    { label: '1 giờ', minutes: 60 },
    { label: '6 giờ', minutes: 360 },
    { label: '1 ngày', minutes: 1440 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="text-orange-600" />
          Cài Đặt Backup Tự Động
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Tự động sao lưu dữ liệu theo lịch định kỳ
        </p>
      </div>

      {/* Toggle Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Bật Backup Tự Động</h3>
            <p className="text-sm text-gray-600">
              {localConfig.enabled
                ? 'Backup đang được chạy tự động'
                : 'Backup tự động đang tắt'}
            </p>
          </div>
          <button
            onClick={handleToggle}
            className="focus:outline-none"
          >
            {localConfig.enabled ? (
              <ToggleRight className="text-green-600" size={32} />
            ) : (
              <ToggleLeft className="text-gray-400" size={32} />
            )}
          </button>
        </div>
      </div>

      {/* Interval Settings */}
      {localConfig.enabled && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">Thời Gian Backup</h3>

          {/* Presets */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {presets.map((preset) => (
              <button
                key={preset.minutes}
                onClick={() => handleIntervalChange(preset.minutes)}
                className={`py-2 px-3 rounded-lg transition text-sm font-medium ${
                  localConfig.intervalMinutes === preset.minutes
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="flex items-center gap-3">
            <label className="text-gray-700 font-medium">Hoặc nhập tùy chỉnh (phút):</label>
            <input
              type="number"
              min="5"
              value={localConfig.intervalMinutes}
              onChange={(e) => handleIntervalChange(parseInt(e.target.value) || 5)}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Info */}
          <div className="mt-4 p-3 bg-white rounded border border-blue-200 text-sm text-blue-800">
            ℹ️ Dữ liệu sẽ được backup mỗi <strong>{localConfig.intervalMinutes} phút</strong>
            {localConfig.intervalMinutes >= 1440 && (
              <p className="mt-1">
                (≈ {Math.round(localConfig.intervalMinutes / 1440)} ngày)
              </p>
            )}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleSave}
          disabled={
            JSON.stringify(localConfig) === JSON.stringify(config)
          }
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Lưu Cấu Hình
        </button>

        {saved && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={20} />
            <span>Đã lưu!</span>
          </div>
        )}
      </div>

      {/* Info Boxes */}
      <div className="space-y-3">
        {localConfig.enabled && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex gap-2">
            <CheckCircle size={20} className="flex-shrink-0" />
            <div>
              <strong>Backup tự động đang hoạt động</strong>
              <p className="mt-1">
                Dữ liệu sẽ được sao lưu tự động mỗi {localConfig.intervalMinutes} phút.
                5 bản backup gần nhất sẽ được giữ lại.
              </p>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex gap-2">
          <AlertCircle size={20} className="flex-shrink-0" />
          <div>
            <strong>💾 Gợi Ý Bảo Mật:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Sử dụng backup tự động hàng ngày để bảo vệ dữ liệu</li>
              <li>Định kỳ tải xuống các backup quan trọng</li>
              <li>Kiểm tra backup hoạt động từ tab "Quản Lý Backup"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoBackupSettings;
