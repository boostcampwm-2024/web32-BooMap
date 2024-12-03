import { ResponseFormatText } from 'openai/resources';

export class OpenAiRequestDto {
  private model = 'gpt-4o-mini';
  private response_format: ResponseFormatText = { type: 'text' };
  private temperature = 1;
  private max_tokens = 4096;
  private top_p = 1;
  private frequency_penalty = 0;
  private presence_penalty = 0;
  private messages: any[];
  private tools: any[];

  setPrompt(prompt: string) {
    this.messages = [
      {
        role: 'system',
        content: [
          {
            text: prompt,
            type: 'text',
          },
        ],
      },
    ];
  }

  setAiContent(aiContent: string) {
    this.messages.push({
      role: 'user',
      content: [
        {
          text: aiContent,
          type: 'text',
        },
      ],
    });
  }

  setTools(tool: any) {
    this.tools = [];
    this.tools.push(tool);
  }

  toObject() {
    return {
      model: this.model,
      response_format: this.response_format,
      temperature: this.temperature,
      max_tokens: this.max_tokens,
      top_p: this.top_p,
      frequency_penalty: this.frequency_penalty,
      presence_penalty: this.presence_penalty,
      messages: this.messages,
      tools: this.tools,
    };
  }
}
