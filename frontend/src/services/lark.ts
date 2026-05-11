import { DocMiniApp } from '@/App';

export async function extractFullDocText(docRef: any): Promise<string> {
  if (!docRef.current) return '';
  const rootBlock = await DocMiniApp.Document.getRootBlock(docRef.current);
  let fullText = '';
  const extract = async (block: any) => {
    if (block.data?.plain_text) fullText += block.data.plain_text + '\n';
    for (const child of block.childSnapshots || []) await extract(child);
  };
  await extract(rootBlock);
  return fullText.trim();
}

export async function extractFullDocMarkdown(): Promise<string> {
  try {
    return await DocMiniApp.Document.getDocAsMarkdown();
  } catch (err) {
    console.warn('Failed to get doc as markdown', err);
    return '';
  }
}

export async function extractFullDocBlockRefs(docRef: any): Promise<any[]> {
  if (!docRef.current) return [];
  const rootBlock = await DocMiniApp.Document.getRootBlock(docRef.current);
  const refs: any[] = [];
  const extract = async (block: any) => {
    if (block.ref) refs.push(block.ref);
    for (const child of block.childSnapshots || []) await extract(child);
  };
  await extract(rootBlock);
  return refs;
}
