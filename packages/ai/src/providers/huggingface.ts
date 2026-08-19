import OpenAI from "openai";
import {
  LLMGenerateParams,
  LLMProvider,
} from "./types.js";

export interface HuggingFaceProviderConfig {
  apiKey: string;
  modelName: string;
}

export class HuggingFaceProvider
  implements LLMProvider
{
  readonly name = "huggingface";

  private readonly client: OpenAI;
  private readonly modelName: string;

  constructor(config: HuggingFaceProviderConfig) {
    if (!config.apiKey) {
      throw new Error(
        "HUGGINGFACE_API_KEY is not configured."
      );
    }

    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: "https://router.huggingface.co/v1",
    });

    this.modelName = config.modelName;
  }

  async generate({
    systemPrompt,
    userPrompt,
  }: LLMGenerateParams): Promise<string> {
    console.log(
      `[Hugging Face] Generating with ${this.modelName}`
    );

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

    const content =
      response.choices[0]?.message?.content;

    if (!content) {
      throw new Error(
        "Hugging Face returned an empty response."
      );
    }

    return content;
  }
}