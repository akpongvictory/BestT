import { GeminiProvider } from "./gemini.js";
import { GroqProvider } from "./groq.js";
import { HuggingFaceProvider } from "./huggingface.js";
import { OpenAICompatibleProvider } from "./openai-compatible.js";
import { ProviderRouter } from "./router.js";
import { LLMProvider } from "./types.js";
import type { LLMProviderName } from "./types.js";

export type {
  LLMProvider,
  LLMProviderName,
} from "./types.js";

export interface CreateLLMProviderConfig {
  provider: LLMProviderName;

  geminiApiKey?: string;
  geminiModel?: string;

  groqApiKey?: string;
  groqModel?: string;

  openaiApiKey?: string;
  openaiModel?: string;

  openrouterApiKey?: string;
  openrouterModel?: string;

  cerebrasApiKey?: string;
  cerebrasModel?: string;

  huggingfaceApiKey?: string;
  huggingfaceModel?: string;
}

export function createLLMProvider(
  config: CreateLLMProviderConfig
): LLMProvider {
  switch (config.provider) {
    case "gemini":
      if (!config.geminiApiKey) {
        throw new Error(
          "GEMINI_API_KEY is not configured."
        );
      }

      return new GeminiProvider({
        apiKey: config.geminiApiKey,
        modelName:
          config.geminiModel ??
          "gemini-flash-latest",
      });

    case "groq":
      if (!config.groqApiKey) {
        throw new Error(
          "GROQ_API_KEY is not configured."
        );
      }

      return new GroqProvider({
        apiKey: config.groqApiKey,
        modelName:
          config.groqModel ??
          "llama-3.3-70b-versatile",
      });

      case "huggingface":
  if (!config.huggingfaceApiKey) {
    throw new Error(
      "HUGGINGFACE_API_KEY is not configured."
    );
  }

  return new HuggingFaceProvider({
    apiKey: config.huggingfaceApiKey,
    modelName:
      config.huggingfaceModel ??
      "meta-llama/Llama-3.2-3B-Instruct",
  });

    case "openai":
      if (!config.openaiApiKey) {
        throw new Error(
          "OPENAI_API_KEY is not configured."
        );
      }

      return new OpenAICompatibleProvider({
        name: "openai",
        apiKey: config.openaiApiKey,
        modelName:
          config.openaiModel ??
          "gpt-4o-mini",
      });

    case "openrouter":
      if (!config.openrouterApiKey) {
        throw new Error(
          "OPENROUTER_API_KEY is not configured."
        );
      }

      return new OpenAICompatibleProvider({
        name: "openrouter",
        apiKey: config.openrouterApiKey,
        modelName:
          config.openrouterModel ??
          "openrouter/free",
        baseURL:
          "https://openrouter.ai/api/v1",
      });

    case "cerebras":
      if (!config.cerebrasApiKey) {
        throw new Error(
          "CEREBRAS_API_KEY is not configured."
        );
      }

      return new OpenAICompatibleProvider({
        name: "cerebras",
        apiKey: config.cerebrasApiKey,
        modelName:
          config.cerebrasModel ??
          "llama-3.3-70b",
        baseURL:
          "https://api.cerebras.ai/v1",
      });

    default:
      throw new Error(
        `Unsupported LLM provider: ${config.provider}`
      );
  }
}

export interface CreateLLMRouterConfig
  extends Omit<
    CreateLLMProviderConfig,
    "provider"
  > {
  providerOrder?: LLMProviderName[];
  cooldownMs?: number;
}

export function createLLMRouter(
  config: CreateLLMRouterConfig
): LLMProvider {
  const providers: LLMProvider[] = [];

      const order =
      config.providerOrder ?? [
        "groq",
        "huggingface",
      
      ];

  for (const provider of order) {
    // OpenAI is deliberately excluded from
    // automatic fallback.
    if (provider === "openai") {
      continue;
    }

   const apiKey =
  provider === "gemini"
    ? config.geminiApiKey
    : provider === "groq"
    ? config.groqApiKey
    : provider === "huggingface"
    ? config.huggingfaceApiKey
    : provider === "openrouter"
    ? config.openrouterApiKey
    : provider === "cerebras"
    ? config.cerebrasApiKey
    : undefined;

    if (!apiKey) {
      continue;
    }

    providers.push(
      createLLMProvider({
        provider,

        geminiApiKey:
          config.geminiApiKey,

        geminiModel:
          config.geminiModel,

        groqApiKey:
          config.groqApiKey,

        groqModel:
          config.groqModel,

        openaiApiKey:
          config.openaiApiKey,

            huggingfaceApiKey:
         config.huggingfaceApiKey,

         huggingfaceModel:
         config.huggingfaceModel,

        openaiModel:
          config.openaiModel,

        openrouterApiKey:
          config.openrouterApiKey,

        openrouterModel:
          config.openrouterModel,

        cerebrasApiKey:
          config.cerebrasApiKey,

        cerebrasModel:
          config.cerebrasModel,
      })
    );
  }

  return new ProviderRouter({
    providers,
    cooldownMs:
      config.cooldownMs ?? 30_000,
  });
}