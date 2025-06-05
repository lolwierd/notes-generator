import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';
import { AiNotesSettings } from './settings';

export class ApiClient {
  private client: OpenAIApi;
  private settings: AiNotesSettings;

  constructor(settings: AiNotesSettings) {
    this.settings = settings;
    const configuration = new Configuration({
      apiKey: settings.apiKey,
      basePath: settings.customApiUrl || 'https://api.openai.com/v1'
    });
    this.client = new OpenAIApi(configuration);
  }

  async generateNote(topic: string): Promise<string> {
    if (!this.settings.apiKey) throw new Error('API key is missing');
    const messages: ChatCompletionRequestMessage[] = [
      { role: 'system', content: this.settings.systemPrompt },
      { role: 'user', content: `Write a comprehensive note about ${topic}.` }
    ];
    try {
      const resp = await this.client.createChatCompletion({
        model: this.settings.model,
        messages,
        temperature: this.settings.temperature,
        max_tokens: this.settings.maxTokens
      });
      return resp.data.choices[0].message?.content || '';
    } catch (err) {
      console.error('OpenAI generateNote error', err);
      throw err;
    }
  }

  async expandSelection(text: string): Promise<string> {
    if (!this.settings.apiKey) throw new Error('API key is missing');
    const messages: ChatCompletionRequestMessage[] = [
      { role: 'system', content: this.settings.systemPrompt },
      { role: 'user', content: `Expand on the following content in detail:\n${text}` }
    ];
    try {
      const resp = await this.client.createChatCompletion({
        model: this.settings.model,
        messages,
        temperature: this.settings.temperature,
        max_tokens: this.settings.maxTokens
      });
      return resp.data.choices[0].message?.content || '';
    } catch (err) {
      console.error('OpenAI expandSelection error', err);
      throw err;
    }
  }
}
