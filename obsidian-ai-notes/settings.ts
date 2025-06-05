import { App, PluginSettingTab, Setting } from 'obsidian';
import AiNotesPlugin from './main';

export interface AiNotesSettings {
  apiKey: string;
  customApiUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  fileNamePrefix: string;
}

export const DEFAULT_SETTINGS: AiNotesSettings = {
  apiKey: '',
  customApiUrl: 'https://api.openai.com/v1',
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
  systemPrompt: 'You are a helpful assistant creating comprehensive notes.',
  fileNamePrefix: 'ai-note-'
};

export class AiNotesSettingTab extends PluginSettingTab {
  plugin: AiNotesPlugin;

  constructor(app: App, plugin: AiNotesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'AI Notes Settings' });

    containerEl.createEl('h3', { text: 'API Settings' });
    new Setting(containerEl)
      .setName('OpenAI API Key')
      .setDesc('Stored locally. Keep it secure.')
      .addText(text =>
        text
          .setPlaceholder('sk-...')
          .setValue(this.plugin.settings.apiKey)
          .onChange(async value => {
            this.plugin.settings.apiKey = value.trim();
            await this.plugin.saveSettings();
          }));

    new Setting(containerEl)
      .setName('Custom API URL')
      .setDesc('Optional URL if using a proxy or different endpoint')
      .addText(text =>
        text
          .setPlaceholder('https://api.openai.com/v1')
          .setValue(this.plugin.settings.customApiUrl)
          .onChange(async value => {
            this.plugin.settings.customApiUrl = value.trim();
            await this.plugin.saveSettings();
          }));

    containerEl.createEl('h3', { text: 'Generation Settings' });

    new Setting(containerEl)
      .setName('Model')
      .addText(text =>
        text
          .setPlaceholder('gpt-4')
          .setValue(this.plugin.settings.model)
          .onChange(async value => {
            this.plugin.settings.model = value.trim();
            await this.plugin.saveSettings();
          }));

    new Setting(containerEl)
      .setName('Temperature')
      .addSlider(slider =>
        slider
          .setLimits(0, 1, 0.1)
          .setValue(this.plugin.settings.temperature)
          .onChange(async value => {
            this.plugin.settings.temperature = value;
            await this.plugin.saveSettings();
          }));

    new Setting(containerEl)
      .setName('Max Tokens')
      .addText(text =>
        text
          .setPlaceholder('2000')
          .setValue(String(this.plugin.settings.maxTokens))
          .onChange(async value => {
            const num = parseInt(value, 10);
            if (!isNaN(num)) {
              this.plugin.settings.maxTokens = num;
              await this.plugin.saveSettings();
            }
          }));

    new Setting(containerEl)
      .setName('System Prompt')
      .addTextArea(text =>
        text
          .setPlaceholder('You are a helpful assistant...')
          .setValue(this.plugin.settings.systemPrompt)
          .onChange(async value => {
            this.plugin.settings.systemPrompt = value;
            await this.plugin.saveSettings();
          }));

    containerEl.createEl('h3', { text: 'File Settings' });

    new Setting(containerEl)
      .setName('File Name Prefix')
      .addText(text =>
        text
          .setPlaceholder('ai-note-')
          .setValue(this.plugin.settings.fileNamePrefix)
          .onChange(async value => {
            this.plugin.settings.fileNamePrefix = value.trim();
            await this.plugin.saveSettings();
          }));
  }
}
