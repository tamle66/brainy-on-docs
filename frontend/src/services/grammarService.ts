import { analyzeGrammar } from '@/services/api';
import { BlockRef } from '@lark-opdev/block-docs-addon-api';

export interface GrammarError {
  id: string;
  original: string;
  replacement: string;
  reason: string;
  type: 'spelling' | 'grammar';
  // Resolved after matching in doc blocks:
  blockRef?: BlockRef;
  range?: [number, number];
}

/**
 * Call backend API to check grammar, return typed GrammarError[]
 */
export async function checkGrammar(text: string): Promise<GrammarError[]> {
  const result = await analyzeGrammar(text, 'vi');
  const raw: any[] = result.errors || [];
  return raw.map((e) => ({
    id: crypto.randomUUID(),
    original: e.original ?? '',
    replacement: e.replacement ?? '',
    reason: e.reason ?? '',
    type: e.type === 'grammar' ? 'grammar' : 'spelling',
  }));
}
