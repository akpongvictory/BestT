import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../../../.env"),
});

export const env = {
  aiProvider:
    process.env.AI_PROVIDER ?? "auto",

  geminiApiKey:
    process.env.GEMINI_API_KEY,

  geminiModel:
    process.env.GEMINI_MODEL ??
    "gemini-flash-latest",

  groqApiKey:
    process.env.GROQ_API_KEY,

  groqModel:
    process.env.GROQ_MODEL ??
    "llama-3.3-70b-versatile",

  openaiApiKey:
    process.env.OPENAI_API_KEY,

  openaiModel:
    process.env.OPENAI_MODEL ??
    "gpt-4o-mini",

  openrouterApiKey:
    process.env.OPENROUTER_API_KEY,

  openrouterModel:
    process.env.OPENROUTER_MODEL ??
    "openai/gpt-4o-mini",

  cerebrasApiKey:
    process.env.CEREBRAS_API_KEY,

  cerebrasModel:
    process.env.CEREBRAS_MODEL ??
    "llama-3.3-70b",

  port:
    Number(process.env.PORT) || 5000,
};

console.log("=== BestT AI CONFIG ===");
console.log("AI provider:", env.aiProvider);
console.log("Gemini API key:", Boolean(env.geminiApiKey));
console.log("Groq API key:", Boolean(env.groqApiKey));
console.log("OpenAI API key:", Boolean(env.openaiApiKey));
console.log("OpenRouter API key:", Boolean(env.openrouterApiKey));
console.log("Cerebras API key:", Boolean(env.cerebrasApiKey));
console.log("Server port:", env.port);
console.log("=======================");
