import { useState, useEffect, useRef } from 'react';
import { BlockitClient, DocumentRef } from '@lark-opdev/block-docs-addon-api';
import './index.css';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GripVertical } from 'lucide-react';
import { RewriteTab } from '@/components/features/RewriteTab';
import { GrammarTab } from '@/components/features/GrammarTab';
import { SkillsActionTab } from '@/components/features/SkillsActionTab';
import { SettingsTab } from '@/components/features/SettingsTab';
import { SkillsTab, loadSkills, Skill } from '@/components/features/SkillsTab';

export const DocMiniApp = new BlockitClient().initAPI();

export default () => {
  const docRef = useRef<DocumentRef | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const savedPrompt = localStorage.getItem('lark_addon_system_prompt');
    if (savedPrompt) setSystemPrompt(savedPrompt);
    setSkills(loadSkills());
  }, []);

  const handleSetSystemPrompt = (prompt: string) => {
    setSystemPrompt(prompt);
    localStorage.setItem('lark_addon_system_prompt', prompt);
  };

  const handleSkillsChange = (updated: Skill[]) => setSkills(updated);

  useEffect(() => {
    (async () => {
      try {
        console.log('Initializing DocMiniApp...');
        // Timeout after 5 seconds if SDK doesn't respond
        const timeout = setTimeout(() => {
          if (!isReady) {
            console.warn('Initialization timeout. Forcing ready state.');
            setIsReady(true);
          }
        }, 5000);

        docRef.current = await DocMiniApp.getActiveDocumentRef();
        console.log('DocRef initialized:', docRef.current);
        clearTimeout(timeout);
        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize Add-on:', err);
        setIsReady(true); // Still show UI even if docRef fails
      }
    })();
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-background flex flex-col p-4 pt-2 font-sans text-foreground relative">
      {/* Nút gợi ý kéo thả (Resize Hint) nằm ở sát mép trái */}
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-16 flex items-center justify-center text-muted-foreground/30 hover:text-muted-foreground/80 cursor-ew-resize transition-colors z-50 group"
        title="Kéo mép trái để thay đổi kích thước"
      >
        <GripVertical className="w-3 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
      </div>

      {isReady ? (
        <Tabs defaultValue="rewrite" className="w-full flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 rounded-xl p-1 h-11 mb-2 shrink-0">
            <TabsTrigger value="rewrite" className="rounded-lg data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm font-semibold text-xs py-2 text-muted-foreground/70 transition-all">Viết lại</TabsTrigger>
            <TabsTrigger value="grammar" className="rounded-lg data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm font-semibold text-xs py-2 text-muted-foreground/70 transition-all">Kiểm tra</TabsTrigger>
            <TabsTrigger value="skills-action" className="rounded-lg data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm font-semibold text-xs py-2 text-muted-foreground/70 transition-all">Kỹ năng</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm font-semibold text-xs py-2 text-muted-foreground/70 transition-all">
              <svg className="w-3.5 h-3.5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rewrite" className="flex-1 overflow-y-auto mt-2 min-h-0 pb-4">
            <RewriteTab docRef={docRef} systemPrompt={systemPrompt} skills={skills} />
          </TabsContent>

          <TabsContent value="grammar" className="flex-1 overflow-y-auto mt-2 min-h-0 pb-4">
            <GrammarTab docRef={docRef} />
          </TabsContent>

          <TabsContent value="skills-action" className="flex-1 overflow-y-auto mt-2 min-h-0 pb-4">
            <SkillsActionTab docRef={docRef} skills={skills} />
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-y-auto mt-2 min-h-0 pb-4">
            <SettingsTab systemPrompt={systemPrompt} setSystemPrompt={handleSetSystemPrompt} />
            <div className="mt-6 border-t border-border/60 pt-6">
              <SkillsTab skills={skills} onSkillsChange={handleSkillsChange} />
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-sm gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Đang đồng bộ dữ liệu...
        </div>
      )}
    </div>
  );
};
