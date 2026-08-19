import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../../../.env"),
});

export const env = {
  aiProvider:
    process.env.AI_PROVIDER ?? "auto",

  // Gemini
  geminiApiKey:
    process.env.GEMINI_API_KEY,

  geminiModel:
    process.env.GEMINI_MODEL ??
    "gemini-flash-latest",

  // Groq
  groqApiKey:
    process.env.GROQ_API_KEY,

  groqModel:
    process.env.GROQ_MODEL ??
    "llama-3.3-70b-versatile",

    huggingfaceApiKey:
  process.env.HUGGINGFACE_API_KEY,

huggingfaceModel:
  process.env.HUGGINGFACE_MODEL ??
  "meta-llama/Llama-3.2-3B-Instruct",

  // OpenAI
  openaiApiKey:
    process.env.OPENAI_API_KEY,

  openaiModel:
    process.env.OPENAI_MODEL ??
    "gpt-4o-mini",

  // OpenRouter
  openrouterApiKey:
    process.env.OPENROUTER_API_KEY,

  openrouterModel:
    process.env.OPENROUTER_MODEL ??
    "openai/gpt-4o-mini",

  // Cerebras
  cerebrasApiKey:
    process.env.CEREBRAS_API_KEY,

  cerebrasModel:
    process.env.CEREBRAS_MODEL ??
    "llama-3.3-70b",

  // Jina Embeddings
  jinaApiKey:
    process.env.JINA_API_KEY,

  jinaEmbeddingModel:
    process.env.JINA_EMBEDDING_MODEL ??
    "jina-embeddings-v5-text-nano",

  // Server
  port:
    Number(process.env.PORT) || 5000,
};

console.log("=== BestT AI CONFIG ===");

console.log(
  "AI provider:",
  env.aiProvider
);

console.log(
  "Gemini API key:",
  Boolean(env.geminiApiKey)
);

console.log(
  "Groq API key:",
  Boolean(env.groqApiKey)
);

console.log(
  "OpenAI API key:",
  Boolean(env.openaiApiKey)
);

console.log(
  "OpenRouter API key:",
  Boolean(env.openrouterApiKey)
);

console.log(
  "Cerebras API key:",
  Boolean(env.cerebrasApiKey)
);

console.log(
  "Jina API key:",
  Boolean(env.jinaApiKey)
);

console.log(
  "Jina embedding model:",
  env.jinaEmbeddingModel
);

console.log(
  "Server port:",
  env.port
);

console.log(
  "Hugging Face API key:",
  Boolean(env.huggingfaceApiKey)
);

console.log(
  "Hugging Face model:",
  env.huggingfaceModel
);

console.log("=======================");