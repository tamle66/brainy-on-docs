import { useState, useCallback, useEffect, useRef } from 'react';
import { BlockitClient, DocumentRef } from '@lark-opdev/block-docs-addon-api';
import './index.css';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GrammarTab } from '@/components/features/GrammarTab';
import { ToneTab } from '@/components/features/ToneTab';
import { RewriteTab } from '@/components/features/RewriteTab';
import { SettingsTab } from '@/components/features/SettingsTab';

export const DocMiniApp = new BlockitClient().initAPI();

export default () => {
  const docRef = useRef<DocumentRef | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState<string>('');

  useEffect(() => {
    // Load system prompt from localStorage on mount
    const savedPrompt = localStorage.getItem('lark_addon_system_prompt');
    if (savedPrompt) {
      setSystemPrompt(savedPrompt);
    }
  }, []);

  const handleSetSystemPrompt = (prompt: string) => {
    setSystemPrompt(prompt);
    localStorage.setItem('lark_addon_system_prompt', prompt);
  };

  useEffect(() => {
    (async () => {
      // Get document ref when component mounts
      docRef.current = await DocMiniApp.getActiveDocumentRef();
      setIsReady(true);
    })();
  }, []);

  return (
    <div className="w-full h-full min-h-screen bg-background flex flex-col p-4 font-sans text-foreground">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Trợ lý AI</h1>
      </div>

      {isReady ? (
        <Tabs defaultValue="rewrite" className="w-full flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4 bg-muted rounded-xl p-1 h-auto border border-border/50">
            <TabsTrigger value="grammar" className="rounded-lg data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium text-xs py-2 text-muted-foreground transition-all">Soát lỗi</TabsTrigger>
            <TabsTrigger value="tone" className="rounded-lg data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium text-xs py-2 text-muted-foreground transition-all">Giọng văn</TabsTrigger>
            <TabsTrigger value="rewrite" className="rounded-lg data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium text-xs py-2 text-muted-foreground transition-all">Viết lại</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium text-xs py-2 text-muted-foreground transition-all">Cấu hình</TabsTrigger>
          </TabsList>

          <TabsContent value="grammar" className="flex-1 overflow-y-auto mt-4">
            <GrammarTab docRef={docRef} systemPrompt={systemPrompt} />
          </TabsContent>

          <TabsContent value="tone" className="flex-1 overflow-y-auto mt-4">
            <ToneTab docRef={docRef} systemPrompt={systemPrompt} />
          </TabsContent>

          <TabsContent value="rewrite" className="flex-1 overflow-y-auto mt-4">
            <RewriteTab docRef={docRef} systemPrompt={systemPrompt} />
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-y-auto mt-4">
            <SettingsTab systemPrompt={systemPrompt} setSystemPrompt={handleSetSystemPrompt} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-sm gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          Đang đồng bộ dữ liệu...
        </div>
      )}
    </div>
  );
};
