const JINA_EMBEDDING_MODEL =
  process.env.JINA_EMBEDDING_MODEL ||
  "jina-embeddings-v5-text-nano";

const EMBEDDING_DIMENSION = 768;
const JINA_API_URL = "https://api.jina.ai/v1/embeddings";

// Keep requests comfortably below Jina's free-tier limits.
const JINA_BATCH_SIZE = 64;

type EmbeddingTask = "retrieval.passage" | "retrieval.query";

function getJinaApiKey(): string {
  const apiKey = process.env.JINA_API_KEY;

  if (!apiKey) {
    throw new Error(
      "JINA_API_KEY is not configured."
    );
  }

  return apiKey;
}

function getJinaErrorMessage(
  body: unknown
): string {
  if (
    typeof body === "object" &&
    body !== null
  ) {
    const candidate = body as {
      detail?: string;
      message?: string;
      error?: {
        message?: string;
      };
    };

    return (
      candidate.error?.message ??
      candidate.detail ??
      candidate.message ??
      JSON.stringify(body)
    );
  }

  return String(body);
}

async function createJinaEmbeddings(
  texts: string[],
  task: EmbeddingTask
): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }

  const apiKey = getJinaApiKey();

  const allEmbeddings: number[][] = [];

  for (
    let start = 0;
    start < texts.length;
    start += JINA_BATCH_SIZE
  ) {
    const batch = texts.slice(
      start,
      start + JINA_BATCH_SIZE
    );

    const batchNumber =
      Math.floor(
        start / JINA_BATCH_SIZE
      ) + 1;

    console.log(
      `[Jina Embeddings] Processing batch ${batchNumber}: ${batch.length} chunks`
    );

    const response = await fetch(
      JINA_API_URL,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model: JINA_EMBEDDING_MODEL,
          input: batch,
          task,
          dimensions: EMBEDDING_DIMENSION,
          normalized: true,
          embedding_type: "float",
        }),
      }
    );

    const responseText =
      await response.text();

    let responseBody: unknown;

    try {
      responseBody =
        JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }

    if (!response.ok) {
      throw new Error(
        `Jina embedding API failed with HTTP ${response.status}: ${getJinaErrorMessage(
          responseBody
        )}`
      );
    }

    const data =
      responseBody as {
        data?: Array<{
          index: number;
          embedding: number[];
        }>;
      };

    const batchEmbeddings =
      data.data
        ?.sort(
          (a, b) =>
            a.index - b.index
        )
        .map(
          (item) =>
            item.embedding
        ) ?? [];

    if (
      batchEmbeddings.length !==
        batch.length ||
      batchEmbeddings.some(
        (embedding) =>
          embedding.length !==
          EMBEDDING_DIMENSION
      )
    ) {
      throw new Error(
        `Jina returned an invalid number or dimension of embeddings for batch ${batchNumber}. Expected ${batch.length} embeddings of ${EMBEDDING_DIMENSION} dimensions.`
      );
    }

    allEmbeddings.push(
      ...batchEmbeddings
    );
  }

  if (
    allEmbeddings.length !==
    texts.length
  ) {
    throw new Error(
      `Jina returned ${allEmbeddings.length} embeddings for ${texts.length} texts.`
    );
  }

  return allEmbeddings;
}

/**
 * Generate embeddings for multiple document chunks.
 *
 * Documents use the retrieval.passage task.
 *
 * IMPORTANT:
 * The entire indexing operation uses Jina.
 * We never mix embedding providers inside
 * the same indexing operation.
 */
export async function createEmbeddings(
  texts: string[]
): Promise<number[][]> {
  return createJinaEmbeddings(
    texts,
    "retrieval.passage"
  );
}

/**
 * Generate an embedding for a search query.
 *
 * Queries use retrieval.query so that the
 * embedding model optimizes the vector for
 * document retrieval.
 */
export async function createEmbedding(
  text: string
): Promise<number[]> {
  const embeddings =
    await createJinaEmbeddings(
      [text],
      "retrieval.query"
    );

  const embedding =
    embeddings[0];

  if (
    !embedding ||
    embedding.length !==
      EMBEDDING_DIMENSION
  ) {
    throw new Error(
      `Jina returned an invalid query embedding. Expected ${EMBEDDING_DIMENSION} dimensions.`
    );
  }

  return embedding;
}