import { Ollama } from '@langchain/ollama';
import { FewShotPromptTemplate, PromptTemplate } from '@langchain/core/prompts';
import { EXAMPLE_PROMPT_IMPROV, EXAMPLES } from './examples';
import {
  ExposableToRenderer,
  exposedToRenderer,
} from '../../expose-renderer.decorator';

interface ControllerEntry {
  id: string;
  controller: AbortController;
}

import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

@ExposableToRenderer()
export class LangChainService {
  private static instance: LangChainService | null = null;
  static context: string = '';
  static llm: Ollama;
  public static abortControllers: ControllerEntry[] = [];
  private examplePrompt: PromptTemplate;
  private prompt: FewShotPromptTemplate;

  private prompts = {
    improve: PromptTemplate.fromTemplate(`
      Enhance the following text to make it more professional and polished:
      {input}

      Guidelines:
      - Correct any grammar, spelling, and punctuation errors
      - Improve clarity and coherence
      - Enhance vocabulary and phrasing where appropriate
      - Maintain the original tone and intent
      - Keep the same language as the input
      - Preserve any technical terms or specific references
      - Do not add new information or change the meaning
      - IMPORTANT : DO NOT COMMENT ON YOUR ANSWER. Your answer must be only the improved version of the input, nothing else.
    `),
    language: PromptTemplate.fromTemplate(`
      Translate the input {input} to {language}.
      Never comment on your anwser, do not provide any explanation.`),
    spelling: PromptTemplate.fromTemplate(`
      Fix only the spelling and ortography errors in the input : {input}.
       But keep exactly the same words and punctuation.
       Never comment on your anwser, do not provide any explanation.`),
    complete: PromptTemplate.fromTemplate(`
      Complete the input : {input} so it sounds more professional, remove all grammar errors.
      Never comment on your anwser, do not provide any explanation.`),
  };
  // private memory: BufferMemory;
  constructor() {
    console.log('Setup ollama...');
    LangChainService.llm = new Ollama({
      baseUrl: 'http://127.0.0.1:11434', // Explicitly use IPv4 localhost
      model: 'llama3.1:latest',
      temperature: 0.2,
      maxRetries: 0,
      maxConcurrency: 3,
      cache: true,
      numThread: 4,
    });

    this.examplePrompt = PromptTemplate.fromTemplate(
      '{sentence}\n{completion}',
    );

    this.prompt = new FewShotPromptTemplate({
      examples: EXAMPLES,
      prefix: `
      Previous inputs the user wrote:{context}
      The using is currently using the application : {applicationName}
      Provide a completion for the input sentence using the provided context.
      Never comment on your anwser, do not provide any explanation, just provide the completion
      Keep the partial sentence as it is.`,
      suffix: 'Partial sentence: {sentence}\nCompletion:',
      examplePrompt: this.examplePrompt,
      inputVariables: ['sentence', 'context', 'applicationName'],
    });
  }
  getContext(): string {
    return LangChainService.context;
  }
  public static getInstance(): LangChainService {
    if (LangChainService.instance === null) {
      LangChainService.instance = new LangChainService();
    } else {
    }
    return LangChainService.instance;
  }

  @exposedToRenderer()
  async addContext(newContext: string) {
    LangChainService.context += '\n\n\n' + newContext;
    fs.writeFileSync('context.txt', LangChainService.context);
    console.log('Context added...');
  }

  // async extractDialogs(text: string): Promise<string> {
  //   const prompt = PromptTemplate.fromTemplate(`
  //     You are an AI assistant specialized in extracting dialog from OCR text.
  //     Given the following OCR text, extract only the parts that appear to be dialog.
  //     Present each line of dialog on a new line, prefixed with a dash (-).
  //     If there's no clear dialog, return ""
  //     Never comment on your anwser, do not provide any explanation
  //     OCR Text:
  //     {text}

  //     Extracted Dialog:
  //   `);

  //   const formattedPrompt = await prompt.format({ text });

  //   try {
  //     console.log('Request dialog extraction...');
  //     const response = await LangChainService.llm.invoke(formattedPrompt);
  //     console.log('Dialog extracted.');
  //     return response.trim();
  //   } catch (error) {
  //     console.error('Error extracting dialogs:', error);
  //     return 'Error occurred while extracting dialogs.';
  //   }
  // }
  @exposedToRenderer()
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
    await new Promise((resolve) => setTimeout(resolve, 50));

    LangChainService.abortControllers = [];
  }

  removeAbortController(id: string) {
    LangChainService.abortControllers =
      LangChainService.abortControllers.filter((entry) => entry.id !== id);
  }

  @exposedToRenderer()
  async requestLLM(
    input: string,
    mode: 'improve' | 'language' | 'spelling' | 'complete',
    language = 'English',
  ) {
    console.log('Start request');
    console.log('input is ', input);
    const id = uuidv4();
    try {
      // const prompt = this.prompts[mode];

      if (mode === 'improve') {
        console.log('Mode improve');
        const promptString = `
      Guidelines:
      - Correct any grammar, spelling, and punctuation errors
      - Improve clarity and coherence
      - Enhance vocabulary and phrasing where appropriate
      - Maintain the original tone and intent
      - Keep the same language as the input
      - Preserve any technical terms or specific references
      - Do not add new information or change the meaning.
      - IMPORTANT : DO NOT COMMENT ON YOUR ANSWER. Your answer must be only the improved version of the input, nothing else.

      Following the guidelines enhance the following text to make it more professional and polished: ${input}`;

        const controller = new AbortController();
        LangChainService.abortControllers.push({ id, controller });

        const response = await LangChainService.llm.invoke(promptString, {
          signal: controller.signal,
        });
        console.log('llm end');
        this.removeAbortController(id);
        return response;
      }
    } catch (error) {
      console.log('ERROR', error);
      this.removeAbortController(id);
      return null;
    }
  }
}
