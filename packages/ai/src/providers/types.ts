export type LLMProviderName =
  | "gemini"
  | "groq"
  | "huggingface"
  | "openai"
  | "openrouter"
  | "cerebras";

export interface LLMGenerateParams {
  systemPrompt: string;
  userPrompt: string;
}

export interface LLMProvider {
  readonly name: string;

  generate(
    params: LLMGenerateParams
  ): Promise<string>;
}