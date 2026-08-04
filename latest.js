export default async function fetchLatest(page = 1) {
  try {
    const url = page > 1 
      ? `https://cinefreak.net/page/${page}/` 
      : `https://cinefreak.net/`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    const html = await response.text();

    // Match all movie cards
    const cardRegex = /<a\s+href="([^"]+)"\s+class="movie-card"[\s\S]*?<\/a>/gi;
    const matches = [...html.matchAll(cardRegex)];

    const results = matches.map(match => {
      const cardHtml = match[0];
      const pageUrl = match[1];

      const imgMatch = cardHtml.match(/<img[^>]+src="([^"]+)"/i);
      const titleMatch = cardHtml.match(/<h3 class="movie-card-title">([\s\S]*?)<\/h3>/i);
      const qualityMatch = cardHtml.match(/<span class="movie-card-format[^"]*">([\s\S]*?)<\/span>/i);
      const timeMatch = cardHtml.match(/<span class="time-ago">([\s\S]*?)<\/span>/i);

      return {
        title: titleMatch ? titleMatch[1].replace(/&#038;/g, "&").trim() : "",
        url: pageUrl,
        poster: imgMatch ? imgMatch[1] : "",
        quality: qualityMatch ? qualityMatch[1].trim() : "",
        timeAgo: timeMatch ? timeMatch[1].trim() : ""
      };
    });

    return results;
  } catch (error) {
    console.error("Error fetching latest:", error);
    return [];
  }
}