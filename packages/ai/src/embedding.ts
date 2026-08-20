const JINA_EMBEDDING_MODEL =
  process.env.JINA_EMBEDDING_MODEL ||
  "jina-embeddings-v5-text-nano";

const EMBEDDING_DIMENSION = 768;
const JINA_API_URL =
  "https://api.jina.ai/v1/embeddings";

const JINA_BATCH_SIZE = 16;

type EmbeddingTask =
  | "retrieval.passage"
  | "retrieval.query";

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
      detail?: unknown;
      message?: unknown;
      error?: unknown;
    };

    const detail = candidate.detail;
    const message = candidate.message;
    const error = candidate.error;

    if (typeof detail === "string") {
      return detail;
    }

    if (typeof message === "string") {
      return message;
    }

    if (typeof error === "string") {
      return error;
    }

    return JSON.stringify(body);
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
        `Jina embedding API failed with HTTP ${response.status}: ${JSON.stringify(responseBody, null, 2)}`
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

export async function createEmbeddings(
  texts: string[]
): Promise<number[][]> {
  return createJinaEmbeddings(
    texts,
    "retrieval.passage"
  );
}

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

