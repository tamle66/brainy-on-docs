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

export const ToneTab = ({ docRef }: { docRef: any }) => {
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
      
      const res = await analyzeTone(fullText, targetTone);
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
        <label className="text-sm font-medium text-slate-700">Sắc thái mục tiêu</label>
        <Select value={targetTone} onValueChange={setTargetTone}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn sắc thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Professional">Chuyên nghiệp</SelectItem>
            <SelectItem value="Friendly">Thân thiện</SelectItem>
            <SelectItem value="Persuasive">Thuyết phục</SelectItem>
            <SelectItem value="Urgent">Cấp bách</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleRewrite} disabled={loading} className="w-full">
        {loading ? 'Đang viết lại...' : 'Viết lại văn bản'}
      </Button>

      {result && (
        <Card className="mt-4 border-blue-100 bg-blue-50/30 shadow-sm">
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600">Sắc thái hiện tại: {result.current_tone}</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">Điểm: {result.tone_score}/100</span>
            </div>
            <div className="text-sm text-slate-800 p-3 bg-white rounded border border-blue-100">
              {result.rewritten_text}
            </div>
            <Button size="sm" variant="default" className="w-full mt-2">
              Áp dụng
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
