export default async function fetchHome() {
  try {
    const response = await fetch("https://cinefreak.net/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    const html = await response.text();

    // 1. Extract the first <a class="movie-card" ...> block
    const cardMatch = html.match(/<a\s+href="([^"]+)"\s+class="movie-card"[\s\S]*?<\/a>/i);
    if (!cardMatch) return [];

    const cardHtml = cardMatch[0];
    const url = cardMatch[1];

    // 2. Extract poster image URL
    const imgMatch = cardHtml.match(/<img[^>]+src="([^"]+)"/i);
    const poster = imgMatch ? imgMatch[1] : "";

    // 3. Extract title from <h3 class="movie-card-title">...</h3>
    const titleMatch = cardHtml.match(/<h3 class="movie-card-title">([\s\S]*?)<\/h3>/i);
    const title = titleMatch ? titleMatch[1].replace(/&#038;/g, "&").trim() : "";

    // 4. Extract quality badge
    const qualityMatch = cardHtml.match(/<span class="movie-card-format[^"]*">([\s\S]*?)<\/span>/i);
    const quality = qualityMatch ? qualityMatch[1].trim() : "";

    // 5. Extract time ago
    const timeMatch = cardHtml.match(/<span class="time-ago">([\s\S]*?)<\/span>/i);
    const timeAgo = timeMatch ? timeMatch[1].trim() : "";

    return [
      {
        title,
        url,
        poster,
        quality,
        timeAgo
      }
    ];
  } catch (error) {
    console.error("Error fetching home data:", error);
    return [];
  }
}