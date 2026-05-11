import React, { useState } from 'react';
import { GrammarError } from '@/services/grammarService';
import { Button } from '@/components/ui/button';

interface SuggestionCardProps {
  error: GrammarError;
  onApply: (error: GrammarError) => Promise<void>;
  onDismiss: (error: GrammarError) => void;
  isActive?: boolean;
}

const TYPE_CONFIG = {
  spelling: {
    icon: '✏️',
    label: 'Lỗi chính tả',
    badgeClass: 'bg-amber-500/15 text-amber-600 border border-amber-400/30',
    borderClass: 'border-l-amber-400',
  },
  grammar: {
    icon: '📝',
    label: 'Lỗi ngữ pháp',
    badgeClass: 'bg-blue-500/15 text-blue-600 border border-blue-400/30',
    borderClass: 'border-l-blue-400',
  },
} as const;

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ error, onApply, onDismiss, isActive = false }) => {
  const [applying, setApplying] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const config = TYPE_CONFIG[error.type] ?? TYPE_CONFIG.spelling;

  const handleApply = async () => {
    setApplying(true);
    try {
      await onApply(error);
    } finally {
      setApplying(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    // Slight delay so animation plays before unmounting
    setTimeout(() => onDismiss(error), 280);
  };

  return (
    <div
      id={`suggestion-card-${error.id}`}
      className={`
        rounded-xl border bg-card shadow-sm overflow-hidden
        border-l-4 ${config.borderClass}
        transition-all duration-300 ease-out
        ${isActive ? 'ring-2 ring-primary border-primary shadow-md scale-[1.02]' : 'border-border/50 scale-100'}
        ${dismissed ? 'opacity-0 -translate-x-2 scale-95 pointer-events-none' : 'opacity-100 translate-x-0'}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <span className="text-base">{config.icon}</span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.badgeClass}`}>
          {config.label}
        </span>
      </div>

      {/* Error → Replacement */}
      <div className="px-4 pb-2 flex items-baseline gap-2 flex-wrap">
        <span className="text-sm font-mono line-through text-destructive/80 bg-destructive/8 px-1.5 py-0.5 rounded">
          {error.original}
        </span>
        <span className="text-muted-foreground text-xs">→</span>
        <span className="text-sm font-mono font-semibold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded">
          {error.replacement}
        </span>
      </div>

      {/* Reason */}
      <p className="px-4 pb-3 text-xs text-muted-foreground leading-relaxed">
        {error.reason}
      </p>

      {/* Actions */}
      <div className="px-4 pb-3 flex gap-2">
        <Button
          size="sm"
          disabled={applying}
          onClick={handleApply}
          className="flex-1 h-8 text-xs rounded-lg font-semibold"
        >
          {applying ? 'Đang áp dụng...' : 'Áp dụng'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDismiss}
          className="flex-1 h-8 text-xs rounded-lg text-muted-foreground hover:text-foreground"
        >
          Bỏ qua
        </Button>
      </div>
    </div>
  );
};
