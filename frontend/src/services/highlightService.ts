import { HighlightTextColor, HighlightTextRef, DocumentRef } from '@lark-opdev/block-docs-addon-api';
import { DocMiniApp } from '@/App';
import { GrammarError } from '@/services/grammarService';

/**
 * Apply yellow highlight + underline to all resolved errors in the document.
 * Only errors with blockRef + range are highlighted; unresolved ones are silently skipped.
 */
export async function applyErrorHighlights(errors: GrammarError[]): Promise<void> {
  const refs = buildHighlightRefs(errors);
  if (refs.length === 0) return;
  try {
    await DocMiniApp.Block.TextualBlock.highlightTexts(refs);
  } catch (e) {
    console.warn('[highlightService] applyErrorHighlights failed:', e);
  }
}

/**
 * Clear ALL highlights on the document (called before every re-scan).
 */
export async function clearErrorHighlights(docRef: DocumentRef): Promise<void> {
  try {
    await DocMiniApp.Block.TextualBlock.clearAllHighlightTexts(docRef);
  } catch (e) {
    console.warn('[highlightService] clearErrorHighlights failed:', e);
  }
}

/**
 * Build HighlightTextRef[] from GrammarError[] (only errors with blockRef + range).
 * Uses YELLOW_500_TINT + ['background', 'underline'] — Grammarly-style.
 */
export function buildHighlightRefs(errors: GrammarError[]): HighlightTextRef[] {
  return errors
    .filter((e): e is GrammarError & { blockRef: NonNullable<GrammarError['blockRef']>; range: [number, number] } =>
      !!e.blockRef && !!e.range
    )
    .map((e) => ({
      ...e.blockRef,
      range: e.range,
      style: {
        color: HighlightTextColor.YELLOW_500_TINT,
        elements: ['background', 'underline'] as ('background' | 'underline')[],
      },
    }));
}
