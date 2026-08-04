/**
 * CineFreak Latest Movies Handler
 */

function parseLatestHTML(html) {
    if (!html) return { items: [], currentPage: 1, totalPages: 1, nextPageUrl: null };

    try {
        var results = [];
        var cardRegex = /<a\s+href="([^"]+)"\s+class="movie-card"[\s\S]*?<\/a>/gi;
        var match;

        // Parse movie cards
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

        // Parse Pagination Info
        var currentPage = 1;
        var totalPages = 1;

        // Extract active page
        var activeMatch = html.match(/<span class="pagination-item active">(\d+)<\/span>/i);
        if (activeMatch) {
            currentPage = parseInt(activeMatch[1], 10);
        }

        // Extract max page number from pagination links
        var pageNumRegex = /<a class="pagination-item"[^>]*href="[^"]*\/page\/(\d+)\/?"[^>]*>(\d+)<\/a>/gi;
        var pageMatch;
        while ((pageMatch = pageNumRegex.exec(html)) !== null) {
            var num = parseInt(pageMatch[1], 10);
            if (num > totalPages) {
                totalPages = num;
            }
        }

        // Determine next page URL
        var hasNext = currentPage < totalPages;
        var nextPageUrl = hasNext ? "https://cinefreak.net/page/" + (currentPage + 1) + "/" : null;

        return {
            items: results,
            currentPage: currentPage,
            totalPages: totalPages,
            hasNextPage: hasNext,
            nextPageUrl: nextPageUrl
        };
    } catch (error) {
        return { items: [], currentPage: 1, totalPages: 1, hasNextPage: false, nextPageUrl: null };
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
        return { items: [], currentPage: page || 1, totalPages: 1, hasNextPage: false, nextPageUrl: null };
    }
}
