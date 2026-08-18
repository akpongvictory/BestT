import Groq from "groq-sdk";
import {
  LLMGenerateParams,
  LLMProvider,
} from "./types";

export interface GroqProviderConfig {
  apiKey: string;
  modelName: string;
}

export class GroqProvider
  implements LLMProvider
{
  readonly name = "groq";

  private readonly client: Groq;
  private readonly modelName: string;

  constructor(config: GroqProviderConfig) {
    if (!config.apiKey) {
      throw new Error(
        "GROQ_API_KEY is not configured."
      );
    }

    this.client = new Groq({
      apiKey: config.apiKey,
    });

    this.modelName = config.modelName;
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
