import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { analyzeTone } from '@/services/api';
import { DocMiniApp } from '@/App';

export const ToneTab = ({ docRef, systemPrompt }: { docRef: any, systemPrompt?: string }) => {
  const [loading, setLoading] = useState(false);
  const [targetTone, setTargetTone] = useState("Professional");
  const [result, setResult] = useState<any>(null);

  const handleRewrite = async () => {
    setLoading(true);
    try {
      if (!docRef.current) return;
      const rootBlock = await DocMiniApp.Document.getRootBlock(docRef.current);
      let fullText = '';
      
      const extractText = async (block: any) => {
        if (block.data?.plain_text) {
          fullText += block.data.plain_text + '\n';
        }
        for (const child of block.childSnapshots || []) {
           await extractText(child);
        }
      };
      
      await extractText(rootBlock);
      
      if (!fullText.trim()) {
        return;
      }
      
      const res = await analyzeTone(fullText, targetTone, 'vi', systemPrompt);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Giọng văn mục tiêu</label>
        <Select value={targetTone} onValueChange={setTargetTone}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn giọng văn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Professional">Chuyên nghiệp</SelectItem>
            <SelectItem value="Friendly">Thân thiện</SelectItem>
            <SelectItem value="Persuasive">Thuyết phục</SelectItem>
            <SelectItem value="Urgent">Cấp bách</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleRewrite} disabled={loading} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm font-medium">
        {loading ? 'Đang xử lý...' : 'Phân tích & Điều chỉnh'}
      </Button>

      {result && (
        <Card className="mt-4 border-blue-100 bg-blue-50/30 shadow-sm">
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Giọng văn hiện tại: {result.current_tone}</span>
              <span className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">Độ phù hợp: {result.tone_score}/100</span>
            </div>
            <div className="text-sm text-foreground p-3 bg-white rounded-lg border border-border/50 shadow-inner">
              {result.rewritten_text}
            </div>
            <Button size="sm" variant="outline" className="w-full mt-2 rounded-full font-medium" onClick={() => navigator.clipboard.writeText(result.rewritten_text)}>
              Sao chép kết quả
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
