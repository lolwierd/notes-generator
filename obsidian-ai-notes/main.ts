import { Notice, Plugin } from 'obsidian';
import { ApiClient } from './api';
import { createNewNote, insertLinkAtCursor } from './utils';
import { AiNotesSettingTab, AiNotesSettings, DEFAULT_SETTINGS } from './settings';

export default class AiNotesPlugin extends Plugin {
  settings: AiNotesSettings = DEFAULT_SETTINGS;
  apiClient: ApiClient | null = null;

  async onload() {
    await this.loadSettings();
    this.apiClient = new ApiClient(this.settings);
    this.addSettingTab(new AiNotesSettingTab(this.app, this));

    this.addCommand({
      id: 'create-ai-note',
      name: 'Create AI Note',
      callback: () => this.handleCreateNote()
    });

    this.addCommand({
      id: 'expand-selection',
      name: 'Expand Selection',
      editorCallback: (editor) => this.handleExpandSelection(editor.getSelection())
    });
  }

  async handleCreateNote() {
    const topic = window.prompt('Enter a topic for the new note') || '';
    if (!topic || !this.apiClient) return;
    try {
      const content = await this.apiClient.generateNote(topic);
      const file = await createNewNote(this.app, `${this.settings.fileNamePrefix}${topic}`, content);
      if (file) {
        new Notice('AI note created');
        await this.app.workspace.openLinkText(file.basename, '', true);
      }
    } catch (err) {
      console.error(err);
      new Notice('Failed to create AI note');
    }
  }

  async handleExpandSelection(selection: string) {
    if (!selection) {
      new Notice('No text selected');
      return;
    }
    if (!this.apiClient) return;
    try {
      const expanded = await this.apiClient.expandSelection(selection);
      const file = await createNewNote(this.app, `${this.settings.fileNamePrefix}${Date.now()}`, expanded);
      if (file) {
        insertLinkAtCursor(this.app, file);
        new Notice('Expanded note created');
      }
    } catch (err) {
      console.error(err);
      new Notice('Failed to expand selection');
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
