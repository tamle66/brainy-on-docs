import React from 'react';

export type ScanStatus = 'idle' | 'watching' | 'analyzing' | 'done' | 'error';

interface StatusBarProps {
  status: ScanStatus;
  lastChecked: Date | null;
  errorCount?: number;
}

const STATUS_CONFIG: Record<ScanStatus, { icon: string; text: string; dotClass: string }> = {
  idle:      { icon: '⚪', text: 'Chưa bắt đầu', dotClass: 'bg-muted-foreground/40' },
  watching:  { icon: '🟢', text: 'Đang theo dõi...', dotClass: 'bg-green-400 animate-pulse' },
  analyzing: { icon: '⏳', text: 'Đang phân tích...', dotClass: 'bg-amber-400 animate-pulse' },
  done:      { icon: '✅', text: '', dotClass: 'bg-green-500' },
  error:     { icon: '🔴', text: 'Không thể kết nối AI', dotClass: 'bg-destructive' },
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export const StatusBar: React.FC<StatusBarProps> = ({ status, lastChecked, errorCount }) => {
  const config = STATUS_CONFIG[status];

  const text = status === 'done'
    ? lastChecked
      ? `Cập nhật lúc ${formatTime(lastChecked)}${errorCount !== undefined ? ` • ${errorCount} lỗi` : ''}`
      : 'Đã kiểm tra'
    : config.text;

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border/40 text-xs text-muted-foreground">
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dotClass}`} />
      <span className="font-medium">{text}</span>
    </div>
  );
};
