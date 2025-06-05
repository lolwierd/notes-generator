import { App, Notice, TFile, MarkdownView } from 'obsidian';

export async function createNewNote(app: App, title: string, content: string): Promise<TFile | null> {
  try {
    const filename = sanitizeFileName(title) + '.md';
    const file = await app.vault.create(filename, content);
    return file;
  } catch (err) {
    console.error('Error creating note', err);
    new Notice('Failed to create note');
    return null;
  }
}

export function insertLinkAtCursor(app: App, file: TFile): void {
  const view = app.workspace.getActiveViewOfType(MarkdownView);
  const editor = view?.editor;
  if (!editor) return;
  const link = app.metadataCache.fileToLinktext(file, '', true);
  editor.replaceSelection(`[[${link}]]`);
}

export function sanitizeFileName(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '-');
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  return `${cleaned}-${timestamp}`;
}
