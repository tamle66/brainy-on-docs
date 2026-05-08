import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { analyzeRewrite } from '@/services/api';
import { DocMiniApp } from '@/App';

export const RewriteTab = ({ docRef, systemPrompt }: { docRef: any, systemPrompt: string }) => {
  const [loading, setLoading] = useState(false);
  const [selectionText, setSelectionText] = useState('');
  const [rewriteResult, setRewriteResult] = useState('');
  const [replacedState, setReplacedState] = useState(false);
  const [originalTextForUndo, setOriginalTextForUndo] = useState('');
  const [undoCountdown, setUndoCountdown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (undoCountdown > 0) {
      timer = setTimeout(() => {
        setUndoCountdown(prev => prev - 1);
      }, 1000);
    } else if (undoCountdown === 0 && replacedState) {
      setReplacedState(false);
    }
    return () => clearTimeout(timer);
  }, [undoCountdown, replacedState]);

  useEffect(() => {
    const handleSelectionChange = async () => {
      if (!docRef.current) return;
      try {
        const text = await DocMiniApp.Selection.getSelectionAsPlainText(docRef.current);
        setSelectionText(text || '');
      } catch (err) {
        console.error('Failed to get selection:', err);
      }
    };

    if (docRef.current) {
      DocMiniApp.Selection.onSelectionChange(docRef.current, handleSelectionChange);
      // Fetch initial
      handleSelectionChange();
    }

    return () => {
      if (docRef.current) {
        DocMiniApp.Selection.offSelectionChange(docRef.current, handleSelectionChange);
      }
    };
  }, [docRef]);


  const handleRewrite = async () => {
    if (!selectionText) return;
    setReplacedState(false);
    setUndoCountdown(0);
    setLoading(true);
    try {
      const result = await analyzeRewrite(selectionText, systemPrompt);
      setRewriteResult(result.rewritten_text || '');
    } catch (err: any) {
      console.error('Failed to rewrite text:', err);
      alert('Lỗi kết nối đến Backend: ' + (err.message || 'Vui lòng kiểm tra lại Ngrok hoặc Backend.'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (rewriteResult) {
      navigator.clipboard.writeText(rewriteResult);
    }
  };

  const handleApply = async () => {
    try {
      if (!docRef.current || !rewriteResult) return;
      
      const selection = await DocMiniApp.Selection.getSelection(docRef.current);
      if (selection && selection.length > 0) {
        // Collect all block references from the selection
        const blockRefs = selection
          .map(s => s.type === 'block' ? s.ref : s.blockSnapshot?.ref)
          .filter(Boolean) as any[];

        if (blockRefs.length === 0) throw new Error("No block refs found in selection");

        const firstBlockRef = blockRefs[0];

        // 1. Insert the new rewritten text as blocks
        await DocMiniApp.Document.insertBlocksByMarkdown(rewriteResult, firstBlockRef);
        
        // 2. Remove the old original blocks
        await DocMiniApp.Block.removeBlocks(blockRefs);

        // Save original text for undo capability
        setOriginalTextForUndo(selectionText);
        setReplacedState(true);
        setUndoCountdown(10);

        // Clear selection to tidy up
        await DocMiniApp.Selection.clearSelection(docRef.current);
        setRewriteResult('');
      }
    } catch (err: any) {
      console.error('Failed to apply rewrite:', err);
      handleCopy();
      alert('Thay thế bị lỗi: ' + (err.message || '') + '\nKết quả đã được sao chép vào clipboard để dán thủ công.');
    }
  };

  const handleUndo = () => {
    navigator.clipboard.writeText(originalTextForUndo);
    alert('Đã sao chép văn bản gốc vào khay nhớ tạm.\n\nMẹo: Bạn có thể bấm Ctrl+Z (hoặc Cmd+Z) trực tiếp trong trình soạn thảo để hoàn tác thao tác thay thế một cách nhanh nhất.');
    setReplacedState(false);
    setUndoCountdown(0);
  };

  return (
    <div className="flex flex-col h-full gap-4 pb-6">
      <Card className="rounded-xl border border-border shadow-sm overflow-hidden bg-card">
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Văn bản đang chọn</span>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
              <span className="text-[10px] font-medium text-muted-foreground">Đã kết nối</span>
            </div>
          </div>
          <Textarea 
            readOnly 
            value={selectionText} 
            placeholder="Bôi đen một đoạn văn bản trong tài liệu để bắt đầu..."
            className="min-h-[100px] text-sm resize-none bg-muted/30 border border-border/50 rounded-lg p-3 text-foreground focus-visible:ring-0 placeholder:text-muted-foreground/50 shadow-inner"
          />
        </CardContent>
      </Card>

      <Button 
        onClick={handleRewrite} 
        disabled={loading || !selectionText} 
        className="w-full rounded-full h-11 text-sm font-medium shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98] gap-2 flex items-center justify-center"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        {loading ? 'Đang xử lý...' : 'Viết lại đoạn này'}
      </Button>

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="space-y-3 mt-2">
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        ) : replacedState ? (
          <Card className="mt-2 rounded-xl border border-green-200 shadow-sm overflow-hidden bg-green-50/30">
            <CardContent className="p-5 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-sm font-medium text-green-800">Đã thay thế thành công!</p>
              <Button size="sm" variant="outline" onClick={handleUndo} className="mt-1 h-9 px-4 rounded-full text-xs font-medium border-green-200 text-green-700 hover:bg-green-100/50 hover:text-green-800 transition-colors">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                Hoàn tác ({undoCountdown}s)
              </Button>
            </CardContent>
          </Card>
        ) : rewriteResult ? (
          <Card className="mt-2 rounded-xl border border-border shadow-sm overflow-hidden bg-card">
            <CardHeader className="pb-2 pt-4 px-4 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                Bản thảo gợi ý
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground p-4 leading-relaxed bg-card">
              {rewriteResult}
            </CardContent>
            <CardFooter className="flex gap-2 p-4 pt-0 bg-card">
              <Button size="sm" onClick={handleApply} className="flex-1 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-9 shadow-sm transition-transform active:scale-[0.98]">
                Thay thế
              </Button>
              <Button size="sm" variant="outline" onClick={handleCopy} className="rounded-md border border-input text-foreground hover:bg-muted font-medium h-9 px-4 transition-transform active:scale-[0.98]">
                Sao chép
              </Button>
            </CardFooter>
          </Card>
        ) : null}
      </ScrollArea>
    </div>
  );
};
