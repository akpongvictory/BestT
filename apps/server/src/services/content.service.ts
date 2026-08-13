export interface ExtractedContent {
  source: "url";
  url: string;
  title?: string;
  content: string;
}

export async function extractUrlContent(
  url: string
): Promise<ExtractedContent> {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("Invalid URL.");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  const response = await fetch(parsedUrl.toString());

  if (!response.ok) {
    throw new Error(
      `Failed to fetch URL. HTTP status: ${response.status}`
    );
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("text/html")) {
    throw new Error(
      "The provided URL does not appear to contain an HTML webpage."
    );
  }

  const html = await response.text();

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

  const title = titleMatch?.[1]
    ?.replace(/\s+/g, " ")
    .trim();

  const content = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (!content) {
    throw new Error("No readable content could be extracted from the URL.");
  }

  return {
    source: "url",
    url: parsedUrl.toString(),
    title,
    content,
  };
}