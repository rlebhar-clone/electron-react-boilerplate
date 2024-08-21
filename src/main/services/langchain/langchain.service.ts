import { Ollama } from '@langchain/ollama';
import { v4 as uuidv4 } from 'uuid';

import { LLMMode } from './langchain.service.type';
import { PROMPT_TEMPLATES } from './prompts';

interface ControllerEntry {
  id: string;
  controller: AbortController;
}

// @ExposableToRenderer()
export class LangChainService {
  // eslint-disable-next-line no-use-before-define
  private static instance: LangChainService | null = null;

  static llm: Ollama;

  public static abortControllers: ControllerEntry[] = [];

  // private memory: BufferMemory;
  constructor() {
    console.log('Setup ollama...');

    LangChainService.llm = new Ollama({
      baseUrl: 'http://127.0.0.1:11434',
      model: 'llama3.1:latest',
      temperature: 0.2,
      maxRetries: 0,
      maxConcurrency: 1,
      cache: true,
      numThread: 4,
    });
  }

  public static getInstance(): LangChainService {
    if (LangChainService.instance === null) {
      LangChainService.instance = new LangChainService();
    }
    return LangChainService.instance;
  }

  // @exposedToRenderer()
  async abortAllRequests() {
    LangChainService.abortControllers.forEach((entry) => {
      console.log(
        'aborting for',
        entry.id,
        ' at ',
        new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          fractionalSecondDigits: 3,
        }),
      );
      entry.controller.abort();
    });
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    LangChainService.abortControllers = [];
  }

  removeAbortController(id: string) {
    LangChainService.abortControllers =
      LangChainService.abortControllers.filter((entry) => entry.id !== id);
  }

  // @exposedToRenderer()
  async *requestLLM(input: string, mode: LLMMode) {
    const id = uuidv4();
    const controller = new AbortController();
    try {
      const promptString = PROMPT_TEMPLATES[mode];

      LangChainService.abortControllers.push({ id, controller });
      const stream = await LangChainService.llm.stream(promptString + input, {
        signal: controller.signal,
      });

      for await (const chunk of stream) {
        yield chunk;
      }

      this.removeAbortController(id);
    } catch (error) {
      console.log('ERROR', error);
      this.removeAbortController(id);
      yield null;
    }
  }
}
