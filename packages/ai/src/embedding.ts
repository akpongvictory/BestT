import { GoogleGenAI } from "@google/genai";

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSION = 768;

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function createEmbedding(
  text: string
): Promise<number[]> {
  if (!text.trim()) {
    throw new Error("Cannot create an embedding from empty text.");
  }

  const response = await client.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
    config: {
      outputDimensionality: EMBEDDING_DIMENSION,
      taskType: "RETRIEVAL_DOCUMENT",
    },
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!embedding || embedding.length !== EMBEDDING_DIMENSION) {
    throw new Error("Invalid embedding returned by Gemini.");
  }

  return embedding;
}