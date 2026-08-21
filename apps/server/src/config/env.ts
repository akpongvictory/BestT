import dotenv from "dotenv";

dotenv.config();

export const env = {
  aiProvider: process.env.AI_PROVIDER ?? "auto",

  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel:
    process.env.GEMINI_MODEL ?? "gemini-flash-latest",

  groqApiKey: process.env.GROQ_API_KEY,
  groqModel:
    process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",

  huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY,
  huggingfaceModel:
    process.env.HUGGINGFACE_MODEL ??
    "meta-llama/Llama-3.2-3B-Instruct",

  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel:
    process.env.OPENAI_MODEL ?? "gpt-4o-mini",

  youtubeApiKey: process.env.YOUTUBE_API_KEY,

  openrouterApiKey: process.env.OPENROUTER_API_KEY,
  openrouterModel:
    process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini",

  cerebrasApiKey: process.env.CEREBRAS_API_KEY,
  cerebrasModel:
    process.env.CEREBRAS_MODEL ?? "llama-3.3-70b",

  jinaApiKey: process.env.JINA_API_KEY,
  jinaEmbeddingModel:
    process.env.JINA_EMBEDDING_MODEL ??
    "jina-embeddings-v5-text-nano",

  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey:
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseStorageBucket:
    process.env.SUPABASE_STORAGE_BUCKET ?? "bestt-documents",

  port: Number(process.env.PORT) || 5000,
};