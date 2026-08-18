import {
  LLMGenerateParams,
  LLMProvider,
} from "./types.js";

export interface GeminiProviderConfig {
  apiKey: string;
  modelName: string;
}

export class GeminiProvider implements LLMProvider {
  readonly name = "gemini";

  private readonly apiKey: string;
  private readonly modelName: string;

  constructor(config: GeminiProviderConfig) {
    if (!config.apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not configured."
      );
    }

    this.apiKey = config.apiKey;
    this.modelName = config.modelName;
  }

  async generate({
    systemPrompt,
    userPrompt,
  }: LLMGenerateParams): Promise<string> {
    const { GoogleGenAI } = await import("@google/genai");

    const client = new GoogleGenAI({
      apiKey: this.apiKey,
    });

    const response =
      await client.models.generateContent({
        model: this.modelName,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
        },
      });

    return (
      response.text ??
      "I was unable to generate a response."
    );
  }
}
