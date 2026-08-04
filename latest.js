/**
 * CineFreak Latest Movies Handler
 */

function parseLatestHTML(html) {
    if (!html) return [];

    try {
        var results = [];
        var cardRegex = /<a\s+href="([^"]+)"\s+class="movie-card"[\s\S]*?<\/a>/gi;
        var match;

        while ((match = cardRegex.exec(html)) !== null) {
            var cardHtml = match[0];
            var pageUrl = match[1];

            var imgMatch = cardHtml.match(/<img[^>]+src="([^"]+)"/i);
            var titleMatch = cardHtml.match(/<h3 class="movie-card-title">([\s\S]*?)<\/h3>/i);
            var qualityMatch = cardHtml.match(/<span class="movie-card-format[^"]*">([\s\S]*?)<\/span>/i);
            var timeMatch = cardHtml.match(/<span class="time-ago">([\s\S]*?)<\/span>/i);

            results.push({
                title: titleMatch ? titleMatch[1].replace(/&#038;/g, "&").trim() : "",
                url: pageUrl,
                poster: imgMatch ? imgMatch[1] : "",
                quality: qualityMatch ? qualityMatch[1].trim() : "",
                timeAgo: timeMatch ? timeMatch[1].trim() : ""
            });
        }

        return results;
    } catch (error) {
        return [];
    }
}

function fetchLatest(page) {
    try {
        page = page || 1;
        var url = page > 1 
            ? "https://cinefreak.net/page/" + page + "/" 
            : "https://cinefreak.net/";

        // Native sync fetch wrapper provided by Java
        var html = fetchText(url);
        return parseLatestHTML(html);
    } catch (error) {
        return [];
    }
}
