import Groq from "groq-sdk";
import {
  LLMGenerateParams,
  LLMProvider,
} from "./types.js";

export interface GroqProviderConfig {
  apiKey: string;
  modelName: string;
}

export class GroqProvider implements LLMProvider {
  readonly name = "groq";

  private readonly client: Groq;
  private readonly modelName: string;

  constructor(config: GroqProviderConfig) {
    if (!config.apiKey) {
      throw new Error("GROQ_API_KEY is not configured.");
    }

    if (!config.modelName) {
      throw new Error("GROQ_MODEL is not configured.");
    }

    this.client = new Groq({
      apiKey: config.apiKey,
    });

    this.modelName = config.modelName;

    console.log(
      `[Groq] Provider initialized with model: ${this.modelName}`
    );
  }

  async generate({
    systemPrompt,
    userPrompt,
  }: LLMGenerateParams): Promise<string> {
    console.log("[Groq] Sending request...");
    console.log("[Groq] Model:", this.modelName);
    console.log("[Groq] Question length:", userPrompt.length);
    console.log(
      "[Groq] System prompt length:",
      systemPrompt.length
    );

    try {
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

      console.log("[Groq] Response received.");

      const answer =
        response.choices[0]?.message?.content;

      if (!answer) {
        console.error(
          "[Groq] Empty response:",
          JSON.stringify(response, null, 2)
        );

        return "I was unable to generate a response.";
      }

      console.log(
        "[Groq] Response length:",
        answer.length
      );

      return answer;
    } catch (error) {
      console.error("[Groq] API request failed:");

      if (error instanceof Error) {
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
      } else {
        console.error(error);
      }

      throw error;
    }
  }
}