/**
 * CineFreak Search Handler
 * Compatible with QuickJS Android runtime and standard JavaScript environments.
 */

// Core search parser function (Transforms raw API response into standardized movie objects)
function parseSearchResults(jsonInput) {
    try {
        var data = (typeof jsonInput === "string") ? JSON.parse(jsonInput) : jsonInput;

        if (!data || !Array.isArray(data.results)) {
            return [];
        }

        return data.results.map(function(item) {
            // Build full URL if relative slug is provided
            var slug = item.l || "";
            var url = slug.startsWith("http")
                ? slug
                : "https://cinefreak.net/" + slug.replace(/^\/+/, "") + (slug.endsWith("/") ? "" : "/");

            return {
                title: item.t ? item.t.replace(/&#038;/g, "&").trim() : "",
                url: url,
                poster: item.i || "",
                quality: item.q || "",
                categories: item.c ? item.c.split(",") : []
            };
        });
    } catch (error) {
        return [];
    }
}

// Full search function (used if fetch environment is available or polyfilled)
async function search(query, page) {
    try {
        if (!query) return [];
        page = page || 1;

        var encodedQuery = encodeURIComponent(query);
        var apiUrl = "https://cinefreak.net/search-api.php?q=" + encodedQuery + "&pg=" + page + "&_t=" + Date.now();

        var response = await fetch(apiUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        });

        var data = await response.json();
        return parseSearchResults(data);
    } catch (error) {
        return [];
    }
}
