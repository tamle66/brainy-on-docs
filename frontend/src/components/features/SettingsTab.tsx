import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface SettingsTabProps {
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
}

export const SettingsTab = ({ systemPrompt, setSystemPrompt }: SettingsTabProps) => {
  const [localPrompt, setLocalPrompt] = useState(systemPrompt);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLocalPrompt(systemPrompt);
  }, [systemPrompt]);

  const handleSave = () => {
    setSystemPrompt(localPrompt);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="system-prompt" className="text-sm font-semibold">
          System Prompt chung
        </Label>
        <p className="text-xs text-muted-foreground">
          Chỉ thị hệ thống này sẽ được áp dụng khi bấm nút "Viết lại đoạn này". Để dùng các prompt chuyên biệt, hãy tạo Skills trong tab Skills.
        </p>
        <Textarea
          id="system-prompt"
          placeholder="Ví dụ: Bạn là một chuyên gia về ngôn ngữ học và văn phong doanh nghiệp..."
          value={localPrompt}
          onChange={(e) => setLocalPrompt(e.target.value)}
          className="min-h-[150px] resize-none"
        />
      </div>
      
      <Button onClick={handleSave} className="w-full rounded-full h-9 text-sm font-medium">
        {isSaved ? "✓ Đã lưu!" : "Lưu cài đặt"}
      </Button>
    </div>
  );
};
