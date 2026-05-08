import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { analyzeGrammar } from '@/services/api';
import { DocMiniApp } from '@/App';

export const GrammarTab = ({ docRef }: { docRef: any }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any[]>([]);

  // Implement Lark block extraction
  const handleScan = async () => {
    setLoading(true);
    try {
      if (!docRef.current) return;
      const rootBlock = await DocMiniApp.Document.getRootBlock(docRef.current);
      let fullText = '';
      
      const extractText = async (block: any) => {
        const isTextual = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(block.type); // Textual types in Lark BlockType enum or similar
        if (block.data?.plain_text) {
          fullText += block.data.plain_text + '\n';
        }
        for (const child of block.childSnapshots || []) {
           await extractText(child);
        }
      };
      
      await extractText(rootBlock);
      
      if (!fullText.trim()) {
        setErrors([]);
        return;
      }
      
      const result = await analyzeGrammar(fullText);
      setErrors(result.errors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <Button onClick={handleScan} disabled={loading} className="w-full">
        {loading ? 'Đang phân tích...' : 'Quét lỗi ngay'}
      </Button>

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : errors.length > 0 ? (
          <div className="space-y-4 pb-4">
            {errors.map((error, idx) => (
              <Card key={idx} className="border-red-100 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-red-500">
                    <span className="line-through">{error.original}</span>
                    <span className="text-green-600 ml-2">{error.replacement}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-600 pb-2">
                  {error.reason}
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                    Sửa nhanh
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-400 mt-10 text-sm">
            Không tìm thấy lỗi nào. Tuyệt vời!
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
