export type SourceType = "WEBPAGE" | "YOUTUBE";

export interface ParsedSource {
  type: SourceType;
  url: string;
  youtubeVideoId?: string;
}

export function parseSourceUrl(
  rawUrl: string
): ParsedSource {
  const url = rawUrl.trim();

  if (!url) {
    throw new Error("URL is required.");
  }

  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid URL.");
  }

  const hostname = parsed.hostname
    .toLowerCase()
    .replace(/^www\./, "");

  // -----------------------------
  // YouTube
  // -----------------------------

  if (
    hostname === "youtube.com" ||
    hostname === "m.youtube.com" ||
    hostname === "youtu.be"
  ) {
    let videoId: string | null = null;

    if (hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    }

    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com"
    ) {
      if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v");
      } else if (
        parsed.pathname.startsWith("/shorts/")
      ) {
        videoId = parsed.pathname.split("/")[2];
      } else if (
        parsed.pathname.startsWith("/embed/")
      ) {
        videoId = parsed.pathname.split("/")[2];
      }
    }

    if (!videoId) {
      throw new Error(
        "Could not determine the YouTube video ID."
      );
    }

    return {
      type: "YOUTUBE",
      url,
      youtubeVideoId: videoId,
    };
  }

  // -----------------------------
  // Normal webpage
  // -----------------------------

  if (
    parsed.protocol !== "http:" &&
    parsed.protocol !== "https:"
  ) {
    throw new Error(
      "Only HTTP and HTTPS URLs are supported."
    );
  }

  return {
    type: "WEBPAGE",
    url,
  };
}