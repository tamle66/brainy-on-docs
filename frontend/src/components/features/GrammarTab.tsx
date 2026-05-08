import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { analyzeGrammar } from '@/services/api';
import { DocMiniApp } from '@/App';

export const GrammarTab = ({ docRef, systemPrompt }: { docRef: any, systemPrompt?: string }) => {
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
      
      const result = await analyzeGrammar(fullText, 'vi', systemPrompt);
      setErrors(result.errors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <Button onClick={handleScan} disabled={loading} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm font-medium">
        {loading ? 'Đang phân tích...' : 'Soát lỗi toàn văn bản'}
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
              <Card key={idx} className="border border-border/50 shadow-sm rounded-xl overflow-hidden bg-card">
                <CardHeader className="pb-2 bg-muted/20 px-4 pt-4 border-b border-border/50">
                  <CardTitle className="text-sm font-semibold text-destructive flex items-center gap-2">
                    <span className="line-through opacity-80">{error.original}</span>
                    <span className="text-muted-foreground/40">→</span>
                    <span className="text-green-600 font-bold">{error.replacement}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-foreground/80 pb-3 pt-3 px-4">
                  {error.reason}
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0">
                  <Button size="sm" variant="outline" className="w-full rounded-full h-8 font-medium hover:bg-muted" onClick={() => navigator.clipboard.writeText(error.replacement)}>
                    Sao chép gợi ý
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-10 text-sm font-medium">
            Văn bản của bạn trông rất ổn. Không tìm thấy lỗi nào!
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
