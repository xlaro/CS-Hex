/**
 * CineFreak QuickJS Plugin Scraper
 */

const BASE_URL = "https://cinefreak.net";

/**
 * Normalizes and extracts clean movie item details from raw card HTML elements.
 * @param {string} htmlContent - Raw HTML string of a card or page section.
 * @returns {Array<Object>} List of parsed items.
 */
function parseLatestReleases(htmlContent) {
  const items = [];
  
  // Regex to match individual card blocks: <a href="..." class="movie-card" ...> ... </a>
  const cardRegex = /<a\s+href="([^"]+)"\s+class="movie-card"[^>]*>([\s\S]*?)<\/a>/g;
  let match;

  while ((match = cardRegex.exec(htmlContent)) !== null) {
    const link = match[1];
    const cardBody = match[2];

    // Extract Title
    const titleMatch = cardBody.match(/<h3\s+class="movie-card-title">([\s\S]*?)<\/h3>/);
    let title = titleMatch ? titleMatch[1].trim() : "";
    // Clean up HTML entities in title
    title = cleanHtmlEntities(title);

    // Extract Poster Image URL
    const imgMatch = cardBody.match(/<img[^>]+src="([^"]+)"/);
    const poster = imgMatch ? imgMatch[1] : "";

    // Extract Quality Format Badge (e.g., WEB-DL, HDTC)
    const formatMatch = cardBody.match(/<span\s+class="movie-card-format[^"]*">\s*([^<]+)\s*<\/span>/);
    const quality = formatMatch ? formatMatch[1].trim() : "Unknown";

    // Extract Status / Episode Info (e.g., EP 07 ADDED)
    const statusMatch = cardBody.match(/<span\s+class="status-(?:ep|completed)">([^<]+)<\/span>/);
    const episodeStatus = statusMatch ? statusMatch[1].trim() : null;

    // Extract Time Ago / Release Meta
    const timeMatch = cardBody.match(/<span\s+class="time-ago">\s*([^<]+)\s*<\/span>/);
    const timeAgo = timeMatch ? timeMatch[1].trim() : "";

    // Extract Categories/Tags from card formats
    const tags = [];
    const tagRegex = /<span\s+class="movie-card-format">([^<]+)<\/span>/g;
    let tagMatch;
    while ((tagMatch = tagRegex.exec(cardBody)) !== null) {
      tags.push(tagMatch[1].trim());
    }

    items.push({
      id: generateId(link),
      title: title,
      url: link,
      posterUrl: poster,
      quality: quality,
      episodeStatus: episodeStatus,
      publishedAt: timeAgo,
      tags: tags
    });
  }

  return items;
}

/**
 * Fetch and parse latest releases directly from CineFreak
 * @param {number} page - Page number (default 1)
 */
async function getLatestReleases(page = 1) {
  const targetUrl = page > 1 ? `${BASE_URL}/page/${page}/` : BASE_URL;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    return parseLatestReleases(html);
  } catch (error) {
    console.error("Failed to fetch CineFreak updates:", error);
    return [];
  }
}

/**
 * Helper: Strip common HTML entities
 */
function cleanHtmlEntities(text) {
  return text
    .replace(/&#038;/g, "&")
    .replace(/&#8211;/g, "-")
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Helper: Generate unique string key from URL path
 */
function generateId(url) {
  const parts = url.replace(/\/$/, "").split("/");
  return parts[parts.length - 1] || encodeURIComponent(url);
}

// Module Export for QuickJS Host environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getLatestReleases,
    parseLatestReleases
  };
}
