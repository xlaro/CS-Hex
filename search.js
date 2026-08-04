export default async function search(query, page = 1) {
  try {
    if (!query) return [];

    const encodedQuery = encodeURIComponent(query);
    const apiUrl = `https://cinefreak.net/search-api.php?q=${encodedQuery}&pg=${page}&_t=${Date.now()}`;

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    const data = await response.json();

    if (!data || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map(item => {
      // Build full URL if slug is provided
      const slug = item.l || "";
      const url = slug.startsWith("http") 
        ? slug 
        : `https://cinefreak.net/${slug.replace(/^\/+/, "")}${slug.endsWith("/") ? "" : "/"}`;

      return {
        title: item.t ? item.t.replace(/&#038;/g, "&").trim() : "",
        url: url,
        poster: item.i || "",
        quality: item.q || "",
        categories: item.c ? item.c.split(",") : []
      };
    });
  } catch (error) {
    console.error("Error searching media:", error);
    return [];
  }
}
