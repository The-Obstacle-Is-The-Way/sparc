declare module 'ai' {
  export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  } : T;

  export class StreamingTextResponse extends Response {
    constructor(stream: ReadableStream, init?: ResponseInit);
  }
  
  export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
  }

  export interface CoreMessage {
    role: string;
    content: string;
  }

  export interface LanguageModel {
    provider: string;
    model: string;
    apiKey?: string;
    baseURL?: string;
    params?: Record<string, any>;
  }

  export function streamObject<T>(
    options: {
      model: any;
      messages?: CoreMessage[];
      temperature?: number;
      maxTokens?: number;
      topP?: number;
      topK?: number;
      frequencyPenalty?: number;
      presencePenalty?: number;
      schema?: any;
      system?: string;
      prompt?: string;
      mode?: string;
      [key: string]: any;
    },
    callbacks?: {
      onStart?: () => Promise<void> | void;
      onToken?: (token: string) => Promise<void> | void;
      onObjectEmitted?: (object: T) => Promise<void> | void;
      onCompletion?: (completion: string) => Promise<void> | void;
      onFinal?: (completion: string) => Promise<void> | void;
    }
  ): Promise<{
    toTextStreamResponse: () => StreamingTextResponse;
  }>;

  export function generateText(
    options: {
      model: any;
      messages?: CoreMessage[];
      temperature?: number;
      maxTokens?: number;
      topP?: number;
      topK?: number;
      frequencyPenalty?: number;
      presencePenalty?: number;
      schema?: any;
      system?: string;
      prompt?: string;
      mode?: string;
      [key: string]: any;
    }
  ): Promise<{ text: string }>;

  export function openai(model: string): any;
} 