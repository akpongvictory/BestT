import { GoogleGenAI } from "@google/genai";

export interface AiServiceConfig {
  apiKey?: string;
  modelName?: string;
}

export interface TutorContext {
  question: string;
  context: string;
}

export class BestTTutorAgent {
  private client: GoogleGenAI;
  private modelName: string;

  constructor(config: AiServiceConfig = {}) {
    const apiKey = config.apiKey ?? process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    this.client = new GoogleGenAI({
      apiKey,
    });

    this.modelName =
      config.modelName ??
      process.env.GEMINI_MODEL ??
      "gemini-flash-latest";
  }

  public getStatus(): {
    ready: boolean;
    agent: string;
  } {
    return {
      ready: Boolean(process.env.GEMINI_API_KEY),
      agent: "BestT Tutor",
    };
  }

  public async answer({
    question,
    context,
  }: TutorContext): Promise<string> {
    const response = await this.client.models.generateContent({
      model: this.modelName,
      contents: question,
      config: {
        systemInstruction: `
You are BestT Tutor, an intelligent and empathetic learning companion.

Your job is to help students understand and revise their course materials.

Rules:

1. Use the provided course material as your primary source.
2. Do not invent facts that are not supported by the material.
3. If the answer cannot be found in the provided material, clearly say so.
4. Explain concepts clearly and at an appropriate student-friendly level.
5. Use examples when they help understanding.
6. Never claim that information came from the course material if it did not.

Course material:
${context}
`,
      },
    });

    return response.text ?? "I was unable to generate a response.";
  }
}