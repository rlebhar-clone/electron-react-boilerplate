import { LLMMode } from './langchain.service.type';

export const PROMPT_TEMPLATES: Record<LLMMode, string> = {
  improve: ` Guidelines:
  - Correct any grammar, spelling, and punctuation errors
  - Improve clarity and coherence
  - Enhance vocabulary and phrasing where appropriate
  - Maintain the original tone and intent
  - Keep the same language as the input
  - Preserve any technical terms or specific references
  - Do not add new information or change the meaning.
  - IMPORTANT : DO NOT COMMENT ON YOUR ANSWER. Your answer must be only the improved version of the input, nothing else.

  Following the guidelines enhance the following text to make it more professional and polished: {input}`,
  question: `You are a knowledgeable AI assistant helping a user. Answer the following question as accurately and concisely as possible.
   If you're unsure about any part of the answer, state so clearly. Avoid speculation and stick to factual information.
   INPUT:`,
  translate: ``,
  complete: ``,
  spelling: ``,
};
// private prompts = {
//     improve: PromptTemplate.fromTemplate(`
//       Enhance the following text to make it more professional and polished:
//       {input}
//       Guidelines:
//       - Correct any grammar, spelling, and punctuation errors
//       - Improve clarity and coherence
//       - Enhance vocabulary and phrasing where appropriate
//       - Maintain the original tone and intent
//       - Keep the same language as the input
//       - Preserve any technical terms or specific references
//       - Do not add new information or change the meaning
//       - IMPORTANT : DO NOT COMMENT ON YOUR ANSWER. Your answer must be only the improved version of the input, nothing else.
//     `),
//     language: PromptTemplate.fromTemplate(`
//       Translate the input {input} to {language}.
//       Never comment on your anwser, do not provide any explanation.`),
//     spelling: PromptTemplate.fromTemplate(`
//       Fix only the spelling and ortography errors in the input : {input}.
//        But keep exactly the same words and punctuation.
//        Never comment on your anwser, do not provide any explanation.`),
//     complete: PromptTemplate.fromTemplate(`
//       Complete the input : {input} so it sounds more professional, remove all grammar errors.
//       Never comment on your anwser, do not provide any explanation.`),
//     question: PromptTemplate.fromTemplate(``),
//   };
