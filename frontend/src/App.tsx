import { useState, useCallback, useEffect, useRef } from 'react';
import { BlockitClient, DocumentRef } from '@lark-opdev/block-docs-addon-api';
import './index.css';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GrammarTab } from '@/components/features/GrammarTab';
import { ToneTab } from '@/components/features/ToneTab';

export const DocMiniApp = new BlockitClient().initAPI();

export default () => {
  const docRef = useRef<DocumentRef | null>(null);

  useEffect(() => {
    (async () => {
      // Get document ref when component mounts
      docRef.current = await DocMiniApp.getActiveDocumentRef();
    })();
  }, []);

  return (
    <div className="w-full h-full min-h-screen bg-slate-50 flex flex-col p-4 border-l">
      <h1 className="text-xl font-bold mb-4 text-slate-800">Grammarly Lark</h1>
      
      <Tabs defaultValue="grammar" className="w-full flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grammar">Kiểm tra</TabsTrigger>
          <TabsTrigger value="tone">Sắc thái</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grammar" className="flex-1 overflow-y-auto mt-4">
          <GrammarTab docRef={docRef} />
        </TabsContent>
        
        <TabsContent value="tone" className="flex-1 overflow-y-auto mt-4">
          <ToneTab docRef={docRef} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
