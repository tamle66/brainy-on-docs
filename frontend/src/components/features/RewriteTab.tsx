import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { analyzeRewrite } from '@/services/api';
import { extractFullDocText, extractFullDocBlockRefs, extractFullDocMarkdown } from '@/services/lark';
import { DocMiniApp } from '@/App';
import type { Skill } from './SkillsTab';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEFAULT_SYSTEM_PROMPT = 'Bạn là trợ lý viết chuyên nghiệp. Viết lại đoạn văn được cung cấp sao cho tự nhiên, mạch lạc và rõ ràng hơn. Giữ nguyên ý nghĩa gốc. QUAN TRỌNG: Hãy tôn trọng và giữ nguyên các định dạng Markdown nếu có (như in đậm, in nghiêng, danh sách, tiêu đề).';

export const RewriteTab = ({ docRef, systemPrompt, skills = [] }: { docRef: any, systemPrompt: string, skills?: Skill[] }) => {
  const [loading, setLoading] = useState(false);
  const [selectionText, setSelectionText] = useState('');
  const [rewriteResult, setRewriteResult] = useState('');
  const [replacedState, setReplacedState] = useState(false);
  const [originalTextForUndo, setOriginalTextForUndo] = useState('');
  const [undoCountdown, setUndoCountdown] = useState(0);
  const [selectedStyleId, setSelectedStyleId] = useState('none');
  const [userPrompt, setUserPrompt] = useState('');
  const [capturedBlockRefs, setCapturedBlockRefs] = useState<any[]>([]);

  const activeStyles = skills.filter((s) => s.isActive && s.category === 'style');

  useEffect(() => {
    let timer: any;
    if (undoCountdown > 0) {
      timer = setTimeout(() => setUndoCountdown(prev => prev - 1), 1000);
    } else if (undoCountdown === 0 && replacedState) {
      setReplacedState(false);
    }
    return () => clearTimeout(timer);
  }, [undoCountdown, replacedState]);

  useEffect(() => {
    const handleSelectionChange = async () => {
      if (!docRef.current) return;
      try {
        const text = await DocMiniApp.Selection.getSelectionAsMarkdown(docRef.current);
        setSelectionText(text || '');
      } catch (err) {
        console.error('Failed to get selection:', err);
      }
    };
    if (docRef.current) {
      DocMiniApp.Selection.onSelectionChange(docRef.current, handleSelectionChange);
      handleSelectionChange();
    }
    return () => {
      if (docRef.current) DocMiniApp.Selection.offSelectionChange(docRef.current, handleSelectionChange);
    };
  }, [docRef]);

  const buildPrompt = (): string => {
    const base = systemPrompt || DEFAULT_SYSTEM_PROMPT;
    if (selectedStyleId !== 'none') {
      const style = activeStyles.find((s) => s.id === selectedStyleId);
      if (style) return `${base}\n\nPhong cách viết: ${style.prompt}`;
    }
    return base;
  };

  const handleRewrite = async () => {
    setReplacedState(false);
    setUndoCountdown(0);
    setLoading(true);
    setRewriteResult('');
    setCapturedBlockRefs([]);
    
    try {
      let inputText = selectionText.trim();
      let currentRefs: any[] = [];

      // Snapshot current selection blocks
      try {
        const selection = await DocMiniApp.Selection.getSelection(docRef.current);
        
        if (selection && selection.length > 0) {
          const refs: any[] = [];
          const seenIds = new Set<number | string>();
          
          selection.forEach(s => {
            const r = s.ref as any;
            if (r && r.docRef && r.blockId !== undefined) {
              if (!seenIds.has(r.blockId)) {
                seenIds.add(r.blockId);
                // Create a clean BlockRef
                refs.push({ docRef: r.docRef, blockId: r.blockId });
              }
            }
          });
          currentRefs = refs;
          alert(`Đã nhận diện ${refs.length} khối văn bản để thay thế.`);
        }

        // Fallback or supplement
        if (currentRefs.length === 0 && (DocMiniApp.Selection as any).getSelectedBlocks) {
          const blocks = await (DocMiniApp.Selection as any).getSelectedBlocks(docRef.current);
          if (blocks && blocks.length > 0) {
            currentRefs = blocks.map((b: any) => b.ref).filter(Boolean);
          }
        }
      } catch (e) {
        console.warn('Failed to get selection refs:', e);
      }

      if (!inputText && docRef.current) {
        inputText = await extractFullDocMarkdown();
        // If no selection, capture ALL block refs for full document replacement
        currentRefs = await extractFullDocBlockRefs(docRef);
      }
      
      if (!inputText || currentRefs.length === 0) {
        alert('Không tìm thấy nội dung để xử lý.');
        setLoading(false);
        return;
      }

      // Always try to get full doc text as context
      let contextText = '';
      if (docRef.current) {
         contextText = await extractFullDocMarkdown();
      }

      setCapturedBlockRefs(currentRefs);
      const result = await analyzeRewrite(inputText, contextText, buildPrompt(), userPrompt);
      setRewriteResult(result.rewritten_text || '');
    } catch (err: any) {
      console.error('Failed to rewrite:', err);
      alert('Lỗi kết nối: ' + (err.message || 'Vui lòng thử lại.'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => { if (rewriteResult) navigator.clipboard.writeText(rewriteResult); };

  const handleApply = async () => {
    try {
      if (!docRef.current || !rewriteResult || capturedBlockRefs.length === 0) return;
      
      // 1. Insert new content at the FIRST block position
      await DocMiniApp.Document.insertBlocksByMarkdown(rewriteResult, capturedBlockRefs[0]);
      
      // 2. Remove original blocks ONE BY ONE to ensure all are deleted
      for (const ref of capturedBlockRefs) {
        try {
          await DocMiniApp.Block.removeBlocks([ref]);
        } catch (e) {
          console.warn('Failed to remove a specific block during replacement:', e);
        }
      }
      
      setOriginalTextForUndo(selectionText);
      setReplacedState(true);
      setUndoCountdown(10);
      
      // Clear selection and result
      if (docRef.current) await DocMiniApp.Selection.clearSelection(docRef.current);
      setRewriteResult('');
      setCapturedBlockRefs([]);
      
    } catch (err: any) {
      console.error('Failed to apply:', err);
      handleCopy();
      alert('Thay thế bị lỗi. Kết quả đã được sao chép vào clipboard.');
    }
  };

  const handleUndo = () => {
    navigator.clipboard.writeText(originalTextForUndo);
    alert('Đã sao chép văn bản gốc vào clipboard.\nMẹo: Bấm Ctrl+Z trong trình soạn thảo để hoàn tác nhanh.');
    setReplacedState(false);
    setUndoCountdown(0);
  };

  const selectedStyle = activeStyles.find((s) => s.id === selectedStyleId);

  return (
    <div className="flex flex-col h-full gap-4 pb-6">
      {/* Selection indicator */}
      <div className="flex items-center gap-2 px-1 mb-1">
        <div className={`h-1.5 w-1.5 rounded-full ${selectionText.trim() ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
        <span className="text-[11px] text-muted-foreground">
          {selectionText.trim() ? `Đang áp dụng cho ${selectionText.trim().length} ký tự được bôi đen` : 'Đang áp dụng cho toàn bộ tài liệu'}
        </span>
      </div>

      {/* Style dropdown */}
      <Select value={selectedStyleId} onValueChange={setSelectedStyleId}>
        <SelectTrigger className="w-full h-11 rounded-xl text-xs border-muted-foreground/20 bg-background hover:bg-muted/30 transition-colors shadow-sm">
          <SelectValue placeholder="Chọn phong cách viết..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Mặc định (tự nhiên, rõ ràng)</SelectItem>
          {activeStyles.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              <span className="flex items-center gap-1.5">
                <span>{s.icon}</span>
                <span>{s.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedStyle && (
        <p className="text-[11px] text-muted-foreground px-1 -mt-2">{selectedStyle.description}</p>
      )}

      {/* User Prompt Textarea */}
      <Textarea
        placeholder="Yêu cầu cụ thể (VD: Làm đoạn này ngắn gọn hơn...)"
        className="w-full text-sm min-h-[60px] resize-none"
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        disabled={loading}
      />

      {/* Rewrite button */}
      <Button
        onClick={handleRewrite}
        disabled={loading}
        className="w-full rounded-full h-11 text-sm font-medium shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98] gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            {selectionText.trim() ? 'Viết lại đoạn được chọn' : 'Viết lại toàn bộ tài liệu'}
          </>
        )}
      </Button>

      {/* Result */}
      <ScrollArea className="flex-1">
        {loading ? (
          <Skeleton className="h-32 w-full rounded-xl" />
        ) : replacedState ? (
          <Card className="rounded-xl border border-green-200 shadow-sm bg-green-50/30">
            <CardContent className="p-5 flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-sm font-medium text-green-800">Đã thay thế thành công!</p>
              <Button size="sm" variant="outline" onClick={handleUndo} className="h-9 px-4 rounded-full text-xs font-medium border-green-200 text-green-700 hover:bg-green-100/50">
                Hoàn tác ({undoCountdown}s)
              </Button>
            </CardContent>
          </Card>
        ) : rewriteResult ? (
          <Card className="rounded-xl border border-border shadow-sm bg-card">
            <CardHeader className="pb-2 pt-4 px-4 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bản thảo gợi ý
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground p-4 leading-relaxed markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {rewriteResult}
              </ReactMarkdown>
            </CardContent>
            <CardFooter className="flex gap-2 p-4 pt-0">
              <Button size="sm" onClick={handleApply} className="flex-1 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-9 shadow-sm active:scale-[0.98]">
                Thay thế
              </Button>
              <Button size="sm" variant="outline" onClick={handleCopy} className="rounded-md border border-input text-foreground hover:bg-muted font-medium h-9 px-4 active:scale-[0.98]">
                Sao chép
              </Button>
            </CardFooter>
          </Card>
        ) : null}
      </ScrollArea>
    </div>
  );
};
