import { DocMiniApp } from '@/App';
import { DocumentRef, BlockSnapshot } from '@lark-opdev/block-docs-addon-api';
import { GrammarError } from '@/services/grammarService';

/**
 * Get full document plain text using Document.getDocAsPlainText()
 * Falls back to block traversal if API unavailable.
 */
export async function getDocumentText(docRef: DocumentRef | null): Promise<string> {
  if (!docRef) return '';
  try {
    // Preferred: single SDK call for full document
    const text = await DocMiniApp.Document.getDocAsPlainText();
    return text?.trim() ?? '';
  } catch {
    // Fallback: manual block traversal
    try {
      const rootBlock = await DocMiniApp.Document.getRootBlock(docRef);
      let fullText = '';
      const extract = async (block: BlockSnapshot) => {
        if ((block.data as any)?.plain_text) {
          fullText += (block.data as any).plain_text + '\n';
        }
        for (const child of block.childSnapshots || []) {
          await extract(child);
        }
      };
      await extract(rootBlock);
      return fullText.trim();
    } catch {
      return '';
    }
  }
}

/**
 * Get all textual blocks in the document as a flat list
 */
export async function getAllTextualBlocks(docRef: DocumentRef): Promise<BlockSnapshot[]> {
  const rootBlock = await DocMiniApp.Document.getRootBlock(docRef);
  const textBlocks: BlockSnapshot[] = [];
  
  const collectBlocks = (block: BlockSnapshot) => {
    const textualTypes = ['text', 'heading1', 'heading2', 'heading3',
      'heading4', 'heading5', 'heading6', 'heading7', 'heading8', 'heading9',
      'bullet', 'ordered', 'todo', 'quote'];
    if (textualTypes.includes(block.type as string)) {
      textBlocks.push(block);
    }
    for (const child of block.childSnapshots || []) collectBlocks(child);
  };
  
  collectBlocks(rootBlock);
  return textBlocks;
}

/**
 * Simple hash to detect document changes without full string compare
 */
export function hashText(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit int
  }
  return hash.toString(36);
}

/**
 * Traverse provided blocks, find where each error.original appears,
 * and attach blockRef + range to the error for use with highlightTexts().
 */
export async function resolveErrorsToRefs(
  errors: GrammarError[],
  textBlocks: BlockSnapshot[]
): Promise<GrammarError[]> {
  if (errors.length === 0 || textBlocks.length === 0) return errors;

  try {
    // For each error, find the first block whose plain_text contains original
    const resolved = errors.map((error) => {
      const targetText = error.original;
      for (const block of textBlocks) {
        const plainText: string = (block.data as any)?.plain_text ?? '';
        const idx = plainText.indexOf(targetText);
        if (idx === -1) continue;

        // Map character position in plain_text to range in elements array
        // The SDK range is [startIndex, endIndex] in the element character space
        const elements: any[] = (block.data as any)?.text?.elements ?? [];
        let charOffset = 0;
        let rangeStart = -1;
        let rangeEnd = -1;

        for (const el of elements) {
          const content: string = el.text_run?.content ?? '';
          const elStart = charOffset;
          const elEnd = charOffset + content.length;

          if (rangeStart === -1 && idx < elEnd && idx >= elStart) {
            rangeStart = idx - elStart + charOffset; // absolute within block
          }
          const targetEnd = idx + targetText.length;
          if (rangeStart !== -1 && targetEnd <= elEnd) {
            rangeEnd = targetEnd - elStart + charOffset;
            break;
          }
          charOffset = elEnd;
        }

        if (rangeStart !== -1 && rangeEnd !== -1) {
          return {
            ...error,
            blockRef: block.ref,
            range: [rangeStart, rangeEnd] as [number, number],
          };
        }
      }
      // Could not resolve position — return error without blockRef
      return error;
    });

    return resolved;
  } catch (e) {
    console.warn('[docService] resolveErrorsToRefs failed:', e);
    return errors;
  }
}
