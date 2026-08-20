import * as cheerio from "cheerio";

export interface WebPageContent {
  title: string;
  content: string;
}

export async function extractWebPage(
  url: string
): Promise<WebPageContent> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; BestT/1.0)",
      Accept:
        "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch webpage: ${response.status}`
    );
  }

  const html = await response.text();

  const $ = cheerio.load(html);

  const title =
    $("title").first().text().trim() ||
    "Web page";

  // Remove elements that are normally not learning content.
  $(
    "script, style, noscript, nav, footer, header, aside, form"
  ).remove();

  const content = $("body")
  .text()
  .replace(/\s+/g, " ")
  .trim();

  if (!content) {
    throw new Error(
      "No readable content was found on this webpage."
    );
  }

  return {
    title,
    content,
  };
}