/**
 * CineFreak Home Page Handler
 */

function parseMovieCard(cardHtml, pageUrl) {
    var imgMatch = cardHtml.match(/<img[^>]+src="([^"]+)"/i);
    var titleMatch = cardHtml.match(/<h3 class="movie-card-title">([\s\S]*?)<\/h3>/i);
    var qualityMatch = cardHtml.match(/<span class="movie-card-format[^"]*">([\s\S]*?)<\/span>/i);
    var timeMatch = cardHtml.match(/<span class="time-ago">([\s\S]*?)<\/span>/i);

    return {
        title: titleMatch ? titleMatch[1].replace(/&#038;/g, "&").trim() : "",
        url: pageUrl || "",
        poster: imgMatch ? imgMatch[1] : "",
        quality: qualityMatch ? qualityMatch[1].trim() : "",
        timeAgo: timeMatch ? timeMatch[1].trim() : ""
    };
}

function parseHomeHTML(html) {
    if (!html) {
        return { featured: null, sections: [] };
    }

    try {
        var cardRegex = /<a\s+href="([^"]+)"\s+class="movie-card"[\s\S]*?<\/a>/gi;
        var allMovies = [];
        var match;

        // Parse all movie cards from the homepage
        while ((match = cardRegex.exec(html)) !== null) {
            allMovies.push(parseMovieCard(match[0], match[1]));
        }

        if (allMovies.length === 0) {
            return { featured: null, sections: [] };
        }

        // First movie becomes the Banner/Featured item
        var featuredMovie = allMovies[0];

        // Remaining movies grouped into a section
        var remainingMovies = allMovies.slice(1);

        var sections = [];
        if (remainingMovies.length > 0) {
            sections.push({
                title: "Latest Releases",
                movies: remainingMovies
            });
        }

        // Returns an Object structured for Java mapping
        return {
            featured: featuredMovie,
            sections: sections
        };

    } catch (error) {
        return { featured: null, sections: [] };
    }
}

function fetchHome() {
    try {
        var html = fetchText("https://cinefreak.net/");
        return parseHomeHTML(html);
    } catch (error) {
        return { featured: null, sections: [] };
    }
}
