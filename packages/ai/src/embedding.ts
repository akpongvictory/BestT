import OpenAI from "openai";

const GEMINI_EMBEDDING_MODEL =
  process.env.GEMINI_EMBEDDING_MODEL ||
  "gemini-embedding-001";

const OPENAI_EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL ||
  "text-embedding-3-small";

const EMBEDDING_DIMENSION = 768;

type EmbeddingProvider = "gemini" | "openai";

function isQuotaOrRateLimitError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  const candidate = error as {
    status?: number;
    message?: string;
    error?: {
      code?: number | string;
      status?: string;
    };
  };

  const status =
    candidate.status ??
    candidate.error?.code;

  if (
    status === 429 ||
    status === "429"
  ) {
    return true;
  }

  const message =
    candidate.message?.toLowerCase() ?? "";

  return (
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("resource_exhausted") ||
    message.includes("too many requests")
  );
}

function getEmbeddingProviderOrder(): EmbeddingProvider[] {
  const configured =
    (
      process.env.AI_PROVIDER ??
      "auto"
    ).toLowerCase();

  if (configured === "openai") {
    return ["openai"];
  }

  if (configured === "gemini") {
    return ["gemini"];
  }

  // AUTO:
  //
  // Gemini is preferred when available.
  // OpenAI is the fallback for embeddings because
  // it provides a compatible 768-dimensional output.
  return ["gemini", "openai"];
}

async function getGeminiClient() {
  const apiKey =
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured."
    );
  }

  const { GoogleGenAI } =
    await import("@google/genai");

  return new GoogleGenAI({
    apiKey,
  });
}

function getOpenAIClient() {
  const apiKey =
    process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured."
    );
  }

  return new OpenAI({
    apiKey,
  });
}

async function createGeminiEmbeddings(
  texts: string[]
): Promise<number[][]> {
  const ai = await getGeminiClient();

  const response =
    await ai.models.embedContent({
      model: GEMINI_EMBEDDING_MODEL,
      contents: texts,
      config: {
        outputDimensionality:
          EMBEDDING_DIMENSION,

        taskType:
          "RETRIEVAL_DOCUMENT",
      },
    });

  const embeddings =
    response.embeddings?.map(
      (embedding) =>
        embedding.values ?? []
    ) ?? [];

  if (
    embeddings.length !== texts.length ||
    embeddings.some(
      (embedding) =>
        embedding.length !==
        EMBEDDING_DIMENSION
    )
  ) {
    throw new Error(
      "Gemini returned an invalid number or dimension of embeddings."
    );
  }

  return embeddings;
}

async function createOpenAIEmbeddings(
  texts: string[]
): Promise<number[][]> {
  const client =
    getOpenAIClient();

  const response =
    await client.embeddings.create({
      model: OPENAI_EMBEDDING_MODEL,
      input: texts,
      dimensions: EMBEDDING_DIMENSION,
    });

  const embeddings =
    response.data
      .sort((a, b) => a.index - b.index)
      .map((item) => item.embedding);

  if (
    embeddings.length !== texts.length ||
    embeddings.some(
      (embedding) =>
        embedding.length !==
        EMBEDDING_DIMENSION
    )
  ) {
    throw new Error(
      "OpenAI returned an invalid number or dimension of embeddings."
    );
  }

  return embeddings;
}

async function createEmbeddingsWithProvider(
  provider: EmbeddingProvider,
  texts: string[]
): Promise<number[][]> {
  if (provider === "gemini") {
    return createGeminiEmbeddings(texts);
  }

  return createOpenAIEmbeddings(texts);
}

/**
 * Generate embeddings for multiple texts.
 *
 * IMPORTANT:
 * The entire batch uses one provider.
 * We never mix Gemini and OpenAI embeddings
 * inside the same indexing operation.
 */
export async function createEmbeddings(
  texts: string[]
): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }

  const providers =
    getEmbeddingProviderOrder();

  let lastError: unknown;

  for (const provider of providers) {
    try {
      console.log(
        `Embedding provider: ${provider}`
      );

      return await createEmbeddingsWithProvider(
        provider,
        texts
      );
    } catch (error) {
      lastError = error;

      console.error(
        `Embedding provider "${provider}" failed:`,
        error
      );

      const shouldFailover =
        provider === "gemini" &&
        isQuotaOrRateLimitError(error);

      if (!shouldFailover) {
        throw error;
      }

      console.warn(
        "Gemini embedding quota/rate limit reached. Falling back to OpenAI embeddings."
      );
    }
  }

  throw (
    lastError ??
    new Error(
      "All embedding providers failed."
    )
  );
}

/**
 * Generate an embedding for a single query.
 *
 * Query embeddings use the same provider-selection
 * mechanism as document embeddings.
 */
export async function createEmbedding(
  text: string
): Promise<number[]> {
  const embeddings =
    await createEmbeddings([text]);

  const embedding =
    embeddings[0];

  if (
    !embedding ||
    embedding.length === 0
  ) {
    throw new Error(
      "Embedding provider returned an empty embedding."
    );
  }

  return embedding;
}