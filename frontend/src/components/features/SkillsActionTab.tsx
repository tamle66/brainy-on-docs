import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { analyzeRewrite } from '@/services/api';
import { extractFullDocText, extractFullDocMarkdown } from '@/services/lark';
import { DocMiniApp } from '@/App';
import type { Skill } from './SkillsTab';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';



interface SkillsActionTabProps {
  docRef: any;
  skills: Skill[];
}

export const SkillsActionTab = ({ docRef, skills }: SkillsActionTabProps) => {
  const [selectionText, setSelectionText] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [loading, setLoading] = useState(false);
  const [inserting, setInserting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [result, setResult] = useState('');

  const activeSkills = skills.filter((s) => s.isActive && s.category === 'skill');

  // Auto-select first skill if none selected
  useEffect(() => {
    if (activeSkills.length > 0 && (!selectedSkillId || !activeSkills.find(s => s.id === selectedSkillId))) {
      setSelectedSkillId(activeSkills[0].id);
    }
  }, [activeSkills]);

  // Track selection
  useEffect(() => {
    const handleSelectionChange = async () => {
      if (!docRef.current) return;
      try {
        const text = await DocMiniApp.Selection.getSelectionAsMarkdown(docRef.current);
        setSelectionText(text || '');
      } catch (err) {
        console.warn('Failed to get selection:', err);
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

  const handleExecute = async () => {
    console.log('Execute triggered. Current skill ID:', selectedSkillId);
    const skill = activeSkills.find((s) => s.id === selectedSkillId);
    if (!skill) {
      console.warn('No active skill found for ID:', selectedSkillId);
      return;
    }

    setLoading(true);
    setResult('');
    try {
      // Use selection if available (must have actual content), otherwise full doc
      let inputText = selectionText.trim();
      console.log('Input text from selection:', inputText.length, 'chars');
      
      if (!inputText && docRef.current) {
        console.log('No selection, extracting full doc text...');
        inputText = await extractFullDocMarkdown();
      }

      if (!inputText) {
        alert('Không tìm thấy nội dung để xử lý. Hãy nhập văn bản vào tài liệu.');
        setLoading(false);
        return;
      }

      // Lấy toàn bộ nội dung làm context
      let contextText = '';
      if (docRef.current) {
         contextText = await extractFullDocMarkdown();
      }

      console.log('Calling AI with prompt for skill:', skill.name);
      // text, context, systemPrompt, userPrompt
      const res = await analyzeRewrite(inputText, contextText, skill.prompt);
      setResult(res.rewritten_text || '');
    } catch (err: any) {
      console.error('Skill execution failed:', err);
      alert('Lỗi: ' + (err.message || 'Vui lòng thử lại.'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) navigator.clipboard.writeText(result);
  };

  const handleInsert = async () => {
    setInserting(true);
    setErrorMsg('');
    try {
      if (!docRef.current || !result) {
        setInserting(false);
        return;
      }
      
      let targetRef = null;

      // Try to get cursor position
      try {
        const selection = await DocMiniApp.Selection.getSelection(docRef.current);
        if (selection && selection.length > 0) {
          targetRef = selection[0].type === 'block' ? selection[0].ref : selection[0].blockSnapshot?.ref;
        }
      } catch (e) {
        console.warn('No active selection/cursor found');
      }

      // If no cursor found, inform the user
      if (!targetRef) {
        setInfoMsg('Hãy click chuột vào tài liệu để chọn vị trí chèn.');
        setTimeout(() => setInfoMsg(''), 5000);
        setInserting(false);
        return;
      }

      // Perform the insertion
      await DocMiniApp.Document.insertBlocksByMarkdown(result, targetRef);
    } catch (err: any) {
      console.error('Insert failed:', err);
      handleCopy();
    } finally {
      setInserting(false);
    }
  };

  const currentSkill = activeSkills.find((s) => s.id === selectedSkillId);

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Input indicator */}
      <div className="flex items-center gap-2 px-1">
        <div className={`h-1.5 w-1.5 rounded-full ${selectionText.trim() ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
        <span className="text-[11px] text-muted-foreground">
          {selectionText.trim() ? `Đang áp dụng cho ${selectionText.trim().length} ký tự được bôi đen` : 'Đang áp dụng cho toàn bộ tài liệu'}
        </span>
      </div>

      {/* Skill selector */}
      {activeSkills.length > 0 ? (
        <>
          <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
            <SelectTrigger className="w-full h-11 rounded-xl text-xs border-muted-foreground/20 bg-background hover:bg-muted/30 transition-colors shadow-sm">
              <SelectValue placeholder="Chọn kỹ năng..." />
            </SelectTrigger>
            <SelectContent>
              {activeSkills.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  <span className="flex items-center gap-2">
                    <span>{s.icon}</span>
                    <span>{s.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {currentSkill && (
            <p className="text-[11px] text-muted-foreground px-1 -mt-2">{currentSkill.description}</p>
          )}

          <Button
            onClick={handleExecute}
            disabled={loading || !selectedSkillId}
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
                {selectionText.trim() ? 'Thực hiện trên đoạn đã chọn' : 'Thực hiện trên toàn bộ tài liệu'}
              </>
            )}
          </Button>
        </>
      ) : (
        <Card className="border-dashed border-2 border-border/60 bg-muted/20 rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-8 gap-2">
            <span className="text-2xl">⚡</span>
            <p className="text-xs text-muted-foreground text-center max-w-[200px]">
              Chưa có kỹ năng nào được bật. Vào tab ⚙️ để tạo hoặc bật kỹ năng.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      <div className="flex-1">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
            <Skeleton className="h-4 w-3/5 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>
        ) : result ? (
          <Card className="rounded-xl border border-border shadow-sm overflow-hidden bg-card">
            <CardHeader className="pb-2 pt-4 px-4 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {currentSkill ? `${currentSkill.icon} ${currentSkill.name}` : 'Kết quả'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground p-4 leading-relaxed markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result}
              </ReactMarkdown>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex flex-col gap-2">
              <div className="flex gap-2 w-full">
                <Button 
                  size="sm" 
                  onClick={handleInsert} 
                  disabled={inserting}
                  className="flex-1 rounded-full h-8 text-xs font-medium bg-primary text-primary-foreground shadow-sm active:scale-[0.98]"
                >
                  {inserting ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Đang chèn...
                    </div>
                  ) : 'Chèn vào tài liệu'}
                </Button>
                <Button size="sm" variant="outline" onClick={handleCopy} className="rounded-full h-8 text-xs font-medium active:scale-[0.98]">
                  Sao chép
                </Button>
              </div>
              
              {infoMsg && (
                <div className="w-full py-2 px-3 bg-amber-50 border border-amber-100 rounded-lg animate-in fade-in slide-in-from-bottom-1 duration-300">
                  <p className="text-[10px] text-amber-700 leading-tight flex items-center gap-1.5">
                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    {infoMsg}
                  </p>
                </div>
              )}
            </CardFooter>
          </Card>
        ) : null}
      </div>
    </div>
  );
};
