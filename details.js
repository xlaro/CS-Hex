export default async function getDetails(url) {
  try {
    if (!url) return null;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    const html = await response.text();

    // 1. Extract Title
    const titleMatch = html.match(/<h1 class="page-title">([\s\S]*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1].replace(/&#038;/g, "&").trim() : "";

    // 2. Extract Poster
    const posterMatch = html.match(/<div class="poster-image">[\s\S]*?<img[^>]+src="([^"]+)"/i);
    const poster = posterMatch ? posterMatch[1] : "";

    // 3. Extract IMDb Rating
    const imdbMatch = html.match(/<b>⭐ IMDb Rating:<\/b>\s*([^<]+)/i);
    const imdb = imdbMatch ? imdbMatch[1].trim() : "";

    // 4. Extract Language
    const langMatch = html.match(/<b>Language:\s*<\/b>\s*([^<]+)/i);
    const language = langMatch ? langMatch[1].trim() : "";

    // 5. Extract Genres
    const genreMatch = html.match(/<b>Genres:<\/b>\s*([^<]+)/i);
    const genres = genreMatch ? genreMatch[1].split(',').map(g => g.trim()) : [];

    // 6. Extract Download and Watch Streams
    const downloadSection = html.match(/<div class="download-links-div">([\s\S]*?)<\/div>/i);
    const streams = [];

    if (downloadSection) {
      const sectionHtml = downloadSection[1];
      // Split into blocks by <h4 class="movie-title">
      const blocks = sectionHtml.split(/<h4 class="movie-title">/i).slice(1);

      for (const block of blocks) {
        // Extract Quality & File Size Label
        const labelMatch = block.match(/^([\s\S]*?)<\/h4>/i);
        const qualityLabel = labelMatch 
          ? labelMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() 
          : "";

        // Extract Download Link URL
        const downloadMatch = block.match(/<a\s+href="([^"]+)"[^>]*class="[^"]*dlbtn-download[^"]*"/i);
        const downloadUrl = downloadMatch ? downloadMatch[1] : "";

        // Extract Watch Online Link URL
        const watchMatch = block.match(/<a\s+href="([^"]+)"[^>]*class="[^"]*dlbtn-watch[^"]*"/i);
        const watchUrl = watchMatch ? watchMatch[1] : "";

        if (downloadUrl || watchUrl) {
          streams.push({
            quality: qualityLabel,
            downloadUrl: downloadUrl,
            watchUrl: watchUrl
          });
        }
      }
    }

    return {
      title,
      poster,
      imdb,
      language,
      genres,
      streams
    };

  } catch (error) {
    console.error("Error fetching details:", error);
    return null;
  }
}