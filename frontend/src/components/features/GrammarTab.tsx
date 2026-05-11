import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DocumentRef } from '@lark-opdev/block-docs-addon-api';
import { DocMiniApp } from '@/App';

import { GrammarError, checkGrammar } from '@/services/grammarService';
import { getDocumentText, hashText, resolveErrorsToRefs, getAllTextualBlocks } from '@/services/docService';
import { applyErrorHighlights, clearErrorHighlights } from '@/services/highlightService';

import { SuggestionCard } from '@/components/ui/SuggestionCard';
import { StatusBar, ScanStatus } from '@/components/ui/StatusBar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

const POLL_INTERVAL_MS = 5000;
const DEBOUNCE_MS = 1500;

interface GrammarTabProps {
  docRef: React.MutableRefObject<DocumentRef | null>;
}

export const GrammarTab: React.FC<GrammarTabProps> = ({ docRef }) => {
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [activeErrorId, setActiveErrorId] = useState<string | null>(null);

  const blockHashesRef = useRef<Map<number, string>>(new Map());
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const selectionDebounceRef = useRef<ReturnType<typeof setTimeout>>();
  const isAnalyzingRef = useRef(false);
  const ignoredSignaturesRef = useRef<Set<string>>(new Set());
  const errorsRef = useRef<GrammarError[]>([]);

  useEffect(() => {
    errorsRef.current = errors;
  }, [errors]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lark_addon_ignored_errors');
      if (stored) {
        ignoredSignaturesRef.current = new Set(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load ignored errors:', e);
    }
  }, []);

  // ─── Core scan function (Incremental Parallel Block-level) ─────────────────
  const runScan = useCallback(async (force = false) => {
    if (isAnalyzingRef.current) return;
    const currentDocRef = docRef.current;
    if (!currentDocRef) return;

    try {
      isAnalyzingRef.current = true;
      setStatus('analyzing');

      // 1. Get current blocks
      const blocks = await getAllTextualBlocks(currentDocRef);
      const currentBlockIds = new Set(blocks.map(b => b.id));

      // 2. Identify dirty blocks (changed or new) and removed blocks
      const dirtyBlocks = blocks.filter(b => {
        const text = (b.data as any)?.plain_text ?? '';
        const currentHash = hashText(text);
        const prevHash = blockHashesRef.current.get(b.id);
        return force || currentHash !== prevHash;
      });

      // Identify removed block IDs
      const removedBlockIds: number[] = [];
      blockHashesRef.current.forEach((_, blockId) => {
        if (!currentBlockIds.has(blockId)) {
          removedBlockIds.push(blockId);
        }
      });

      // 3. Process removals immediately
      if (removedBlockIds.length > 0) {
        setErrors(prev => prev.filter(e => 
          e.blockRef && !removedBlockIds.includes(e.blockRef.blockId)
        ));
        removedBlockIds.forEach(id => blockHashesRef.current.delete(id));
      }

      // 4. Process dirty blocks in PARALLEL with limited concurrency
      if (dirtyBlocks.length > 0) {
        // Clear highlights once at start of a meaningful change
        await clearErrorHighlights(currentDocRef);

        // Pre-clear errors for dirty blocks in state
        const dirtyIds = dirtyBlocks.map(b => b.id);
        setErrors(prev => prev.filter(e => 
          e.blockRef && !dirtyIds.includes(e.blockRef.blockId)
        ));

        // Worker Pool Logic (Concurrency = 3)
        const CONCURRENCY = 3;
        const queue = [...dirtyBlocks];
        
        const worker = async () => {
          while (queue.length > 0) {
            const block = queue.shift();
            if (!block) break;

            const plainText = (block.data as any)?.plain_text ?? '';
            if (!plainText.trim()) {
              blockHashesRef.current.set(block.id, hashText(plainText));
              continue;
            }

            try {
              // Call AI for this block
              const blockErrors = await checkGrammar(plainText);
              
              // Resolve positions within this specific block
              const resolvedBlockErrors = await resolveErrorsToRefs(blockErrors, [block]);

              // Filter out ignored signatures
              const validErrors = resolvedBlockErrors.filter(e => {
                const sig = `${e.original}::${e.replacement}`;
                return !ignoredSignaturesRef.current.has(sig);
              });

              // Update errors state block-by-block (REAL-TIME UI UPDATE)
              setErrors(prev => {
                const filtered = prev.filter(e => e.blockRef?.blockId !== block.id);
                const newState = [...filtered, ...validErrors];
                
                // Re-apply highlights in background
                applyErrorHighlights(newState).catch(() => {});
                
                return newState;
              });

              blockHashesRef.current.set(block.id, hashText(plainText));
            } catch (blockErr) {
              console.error(`[GrammarTab] Failed to process block ${block.id}:`, blockErr);
            }
          }
        };

        // Start workers
        const workers = Array(Math.min(CONCURRENCY, dirtyBlocks.length))
          .fill(null)
          .map(() => worker());
        
        await Promise.all(workers);
      }

      setLastChecked(new Date());
      setStatus('done');
    } catch (err) {
      console.error('[GrammarTab] parallel scan failed:', err);
      setStatus('error');
    } finally {
      isAnalyzingRef.current = false;
    }
  }, [docRef]);

  // ─── Polling + debounce ───────────────────────────────────────────────────
  useEffect(() => {
    setStatus('watching');

    const poll = setInterval(async () => {
      if (isAnalyzingRef.current) return;
      const currentDocRef = docRef.current;
      if (!currentDocRef) return;

      // Check if any block has changed hash
      const blocks = await getAllTextualBlocks(currentDocRef).catch(() => []);
      let hasChange = false;
      
      for (const b of blocks) {
        const text = (b.data as any)?.plain_text ?? '';
        if (blockHashesRef.current.get(b.id) !== hashText(text)) {
          hasChange = true;
          break;
        }
      }
      
      // Also check for removals
      if (!hasChange) {
        const currentBlockIds = new Set(blocks.map(b => b.id));
        blockHashesRef.current.forEach((_, id) => {
          if (!currentBlockIds.has(id)) {
            hasChange = true;
          }
        });
      }

      if (hasChange) {
        setStatus('watching');
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => runScan(), DEBOUNCE_MS);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      clearInterval(poll);
      clearTimeout(debounceRef.current);
    };
  }, [docRef, runScan]);

  // ─── Auto-scroll on cursor change ──────────────────────────────────────────
  useEffect(() => {
    const handleSelectionChange = () => {
      clearTimeout(selectionDebounceRef.current);
      selectionDebounceRef.current = setTimeout(async () => {
        if (!docRef.current) return;
        try {
          const selection = await DocMiniApp.Selection.getSelection(docRef.current);
          if (selection && selection.length > 0 && selection[0].type === 'text') {
            const blockId = selection[0].ref.blockId;
            const range = selection[0].ref.range;
            
            // Lấy danh sách lỗi LATEST từ ref
            const currentErrors = errorsRef.current;
            
            // Tìm lỗi có chứa con trỏ
            const activeErr = currentErrors.find(e => 
              e.blockRef?.blockId === blockId && 
              e.range && 
              range[0] >= e.range[0] && 
              range[0] <= e.range[1]
            );

            if (activeErr) {
              setActiveErrorId(activeErr.id);
              // Scroll card vào view
              const el = document.getElementById(`suggestion-card-${activeErr.id}`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            } else {
              setActiveErrorId(null);
            }
          } else {
            setActiveErrorId(null);
          }
        } catch (err) {
          console.warn('Failed to get selection for auto-scroll:', err);
        }
      }, 300); // Debounce 300ms
    };

    if (docRef.current) {
      DocMiniApp.Selection.onSelectionChange(docRef.current, handleSelectionChange);
    }
    
    return () => {
      if (docRef.current) {
        DocMiniApp.Selection.offSelectionChange(docRef.current, handleSelectionChange);
      }
      clearTimeout(selectionDebounceRef.current);
    };
  }, [docRef]);

  // ─── Apply handler ────────────────────────────────────────────────────────
  const handleApply = useCallback(async (error: GrammarError) => {
    const currentDocRef = docRef.current;
    if (!currentDocRef || !error.blockRef) {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(error.replacement);
      return;
    }

    try {
      // Get current block snapshot
      const blockSnapshot = await DocMiniApp.Block.getBlock(error.blockRef);
      const data = blockSnapshot.data as any;
      const elements: any[] = data?.text?.elements ?? [];

      // Replace original text in the matching text_run element
      let charOffset = 0;
      const newElements = elements.map((el) => {
        if (!el.text_run) return el;
        const content: string = el.text_run.content;
        const start = charOffset;
        charOffset += content.length;

        if (error.range && start <= error.range[0] && charOffset >= error.range[1]) {
          const before = content.slice(0, error.range[0] - start);
          const after = content.slice(error.range[1] - start);
          return {
            ...el,
            text_run: { ...el.text_run, content: before + error.replacement + after },
          };
        }
        return el;
      });

      // Update the block in Lark
      await DocMiniApp.Block.updateBlock(error.blockRef, {
        ...data,
        text: { elements: newElements },
      });

      // ─── OPTIMIZATION: Prevent re-scan of this block ────────────────────────
      // 1. Calculate the NEW text content after replacement to update hash
      let updatedPlainText = '';
      newElements.forEach(el => {
        if (el.text_run) updatedPlainText += el.text_run.content;
      });
      blockHashesRef.current.set(error.blockRef.blockId, hashText(updatedPlainText));

      // 2. Remove ONLY this error from local state immediately
      setErrors(prev => {
        const updated = prev.filter((e) => e.id !== error.id);
        // Refresh highlights for remaining errors
        applyErrorHighlights(updated.filter(e => !dismissedIds.has(e.id))).catch(() => {});
        return updated;
      });
      
      setLastChecked(new Date());
    } catch (err) {
      console.error('[GrammarTab] apply failed, fallback to clipboard:', err);
      await navigator.clipboard.writeText(error.replacement);
    }
  }, [docRef, errors, dismissedIds]);

  const handleDismiss = useCallback(async (error: GrammarError) => {
    const currentDocRef = docRef.current;
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(error.id);
      return next;
    });

    // Persistent ignore
    const sig = `${error.original}::${error.replacement}`;
    ignoredSignaturesRef.current.add(sig);
    try {
      localStorage.setItem('lark_addon_ignored_errors', JSON.stringify(Array.from(ignoredSignaturesRef.current)));
    } catch (e) {
      console.warn('Failed to save ignored errors:', e);
    }

    // Re-apply highlights minus this dismissed error
    const remaining = errors.filter((e) => e.id !== error.id && !dismissedIds.has(e.id));
    if (currentDocRef) {
      await clearErrorHighlights(currentDocRef);
      await applyErrorHighlights(remaining);
    }
  }, [docRef, errors, dismissedIds]);

  // ─── Navigation handler ───────────────────────────────────────────────────
  const handleCardClick = useCallback(async (error: GrammarError) => {
    if (!error.blockRef) return;
    try {
      // Scroll to the block and highlight it
      await DocMiniApp.Viewport.scrollToBlock(error.blockRef, true);
      
      // Optionally set selection if range exists
      if (error.range) {
        // SelectionItem expects type: 'text' and a TextRef (BlockRef + range)
        await DocMiniApp.Selection.setSelection([{
          type: 'text',
          ref: {
            ...error.blockRef,
            range: error.range
          }
        }]);
      } else {
        // Fallback to block selection
        await DocMiniApp.Selection.setSelection([{
          type: 'block',
          ref: error.blockRef
        }]);
      }
    } catch (err) {
      console.warn('[GrammarTab] navigation failed:', err);
    }
  }, []);

  // ─── Visible errors (filter dismissed) ───────────────────────────────────
  const visibleErrors = errors.filter((e) => !dismissedIds.has(e.id));

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full gap-3">
      {/* Status bar */}
      <StatusBar status={status} lastChecked={lastChecked} errorCount={visibleErrors.length} />

      {/* Manual trigger */}
      <Button
        variant="outline"
        size="sm"
        disabled={status === 'analyzing'}
        onClick={() => runScan(true)}
        className="w-full rounded-lg h-8 text-xs font-medium border-dashed"
      >
        {status === 'analyzing' ? '⏳ Đang phân tích...' : '🔄 Kiểm tra lại ngay'}
      </Button>

      {/* Error list */}
      <ScrollArea className="flex-1">
        {/* Only show skeleton on initial load (no errors yet) */}
        {status === 'analyzing' && visibleErrors.length === 0 ? (
          <div className="space-y-3 pb-4">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
        ) : visibleErrors.length > 0 ? (
          <div className="space-y-3 pb-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-[11px] text-muted-foreground font-medium">
                {visibleErrors.length} lỗi được phát hiện
              </p>
              {status === 'analyzing' && (
                <span className="text-[10px] text-amber-500 animate-pulse font-medium">
                  🔄 Đang cập nhật...
                </span>
              )}
            </div>
            {visibleErrors.map((error) => (
              <div key={error.id} onClick={() => handleCardClick(error)} className="cursor-pointer active:scale-[0.98] transition-transform">
                <SuggestionCard
                  error={error}
                  onApply={handleApply}
                  onDismiss={handleDismiss}
                  isActive={activeErrorId === error.id}
                />
              </div>
            ))}
          </div>
        ) : status === 'done' ? (
          <div className="flex flex-col items-center justify-center gap-3 mt-12 text-center px-4">
            <span className="text-3xl">✨</span>
            <p className="text-sm font-semibold text-foreground/80">Không phát hiện lỗi nào</p>
            <p className="text-xs text-muted-foreground">Văn bản của bạn trông rất ổn!</p>
          </div>
        ) : status === 'error' ? (
          <div className="flex flex-col items-center justify-center gap-3 mt-12 text-center px-4">
            <span className="text-3xl">🔴</span>
            <p className="text-sm font-semibold text-destructive">Không thể kết nối AI</p>
            <Button size="sm" variant="outline" onClick={() => runScan(true)} className="text-xs">
              Thử lại
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 mt-12 text-center px-4">
            <span className="text-3xl">📄</span>
            <p className="text-sm text-muted-foreground">
              Hãy bắt đầu soạn thảo để Brainy kiểm tra
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
