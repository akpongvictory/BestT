import OpenAI from "openai";
import {
  LLMGenerateParams,
  LLMProvider,
} from "./types.js";

export interface OpenAICompatibleProviderConfig {
  name: string;
  apiKey: string;
  modelName: string;
  baseURL?: string;
}

export class OpenAICompatibleProvider
  implements LLMProvider
{
  readonly name: string;

  private readonly client: OpenAI;
  private readonly modelName: string;

  constructor(
    config: OpenAICompatibleProviderConfig
  ) {
    if (!config.apiKey) {
      throw new Error(
        `${config.name.toUpperCase()}_API_KEY is not configured.`
      );
    }

    this.name = config.name;
    this.modelName = config.modelName;

    this.client = new OpenAI({
      apiKey: config.apiKey,
      ...(config.baseURL
        ? { baseURL: config.baseURL }
        : {}),
    });
  }

  async generate({
    systemPrompt,
    userPrompt,
  }: LLMGenerateParams): Promise<string> {
    const response =
      await this.client.chat.completions.create({
        model: this.modelName,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

    return (
      response.choices[0]?.message?.content ??
      "I was unable to generate a response."
    );
  }
}
