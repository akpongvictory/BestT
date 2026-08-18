export interface ExtractedContent {
  source: "url";
  url: string;
  title?: string;
  content: string;
}

const MAX_HTML_SIZE = 5 * 1024 * 1024;
const MAX_CONTENT_SIZE = 30000;
const FETCH_TIMEOUT = 15000;

export async function extractUrlContent(
  url: string
): Promise<ExtractedContent> {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("Invalid URL.");
  }

  if (
    !["http:", "https:"].includes(
      parsedUrl.protocol
    )
  ) {
    throw new Error(
      "Only HTTP and HTTPS URLs are supported."
    );
  }

  const controller =
    new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    FETCH_TIMEOUT
  );

  try {
    const response = await fetch(
      parsedUrl.toString(),
      {
        signal: controller.signal,
        headers: {
          Accept:
            "text/html,application/xhtml+xml",
          "User-Agent":
            "BestT-Learning-Agent/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch URL. HTTP status: ${response.status}`
      );
    }

    const contentType =
      response.headers.get(
        "content-type"
      ) ?? "";

    if (
      !contentType.includes("text/html") &&
      !contentType.includes(
        "application/xhtml+xml"
      )
    ) {
      throw new Error(
        "The provided URL does not appear to contain an HTML webpage."
      );
    }

    const contentLength =
      response.headers.get(
        "content-length"
      );

    if (
      contentLength &&
      Number(contentLength) > MAX_HTML_SIZE
    ) {
      throw new Error(
        "The webpage is too large to process."
      );
    }

    const html = await response.text();

    if (
      Buffer.byteLength(html, "utf8") >
      MAX_HTML_SIZE
    ) {
      throw new Error(
        "The webpage is too large to process."
      );
    }

    const titleMatch = html.match(
      /<title[^>]*>([\s\S]*?)<\/title>/i
    );

    const title =
      titleMatch?.[1]
        ?.replace(/\s+/g, " ")
        .trim();

    const content = html
      .replace(
        /<script[\s\S]*?<\/script>/gi,
        " "
      )
      .replace(
        /<style[\s\S]*?<\/style>/gi,
        " "
      )
      .replace(
        /<noscript[\s\S]*?<\/noscript>/gi,
        " "
      )
      .replace(
        /<svg[\s\S]*?<\/svg>/gi,
        " "
      )
      .replace(
        /<[^>]+>/g,
        " "
      )
      .replace(
        /&nbsp;/gi,
        " "
      )
      .replace(
        /&amp;/gi,
        "&"
      )
      .replace(
        /&lt;/gi,
        "<"
      )
      .replace(
        /&gt;/gi,
        ">"
      )
      .replace(
        /&quot;/gi,
        '"'
      )
      .replace(
        /&#39;/gi,
        "'"
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();

    if (!content) {
      throw new Error(
        "No readable content could be extracted from the URL."
      );
    }

    return {
      source: "url",
      url: parsedUrl.toString(),
      title,
      content: content.slice(
        0,
        MAX_CONTENT_SIZE
      ),
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new Error(
        "The webpage took too long to respond."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}