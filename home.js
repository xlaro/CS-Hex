/**
 * CineFreak Home Page Handler
 */

function parseHomeHTML(html) {
    if (!html) return [];

    try {
        // 1. Extract the first <a class="movie-card" ...> block
        var cardMatch = html.match(/<a\s+href="([^"]+)"\s+class="movie-card"[\s\S]*?<\/a>/i);
        if (!cardMatch) return [];

        var cardHtml = cardMatch[0];
        var url = cardMatch[1];

        // 2. Extract poster image URL
        var imgMatch = cardHtml.match(/<img[^>]+src="([^"]+)"/i);
        var poster = imgMatch ? imgMatch[1] : "";

        // 3. Extract title
        var titleMatch = cardHtml.match(/<h3 class="movie-card-title">([\s\S]*?)<\/h3>/i);
        var title = titleMatch ? titleMatch[1].replace(/&#038;/g, "&").trim() : "";

        // 4. Extract quality badge
        var qualityMatch = cardHtml.match(/<span class="movie-card-format[^"]*">([\s\S]*?)<\/span>/i);
        var quality = qualityMatch ? qualityMatch[1].trim() : "";

        // 5. Extract time ago
        var timeMatch = cardHtml.match(/<span class="time-ago">([\s\S]*?)<\/span>/i);
        var timeAgo = timeMatch ? timeMatch[1].trim() : "";

        return [
            {
                title: title,
                url: url,
                poster: poster,
                quality: quality,
                timeAgo: timeAgo
            }
        ];
    } catch (error) {
        return [];
    }
}

function fetchHome() {
    try {
        var html = fetchText("https://cinefreak.net/");
        return parseHomeHTML(html);
    } catch (error) {
        return [];
    }
}
