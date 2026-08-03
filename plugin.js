// plugin.js
// Contract: must define a global "Plugin" object with a parseList(html) function
// that returns a JSON string of [{title, posterUrl, detailUrl}, ...]

var Plugin = {
    name: "SimpleTestPlugin",

    parseList: function (html) {
        var results = [];

        // Matches: <div class="movie" data-title="..." data-poster="..." data-url="...">
        var regex = /<div class="movie" data-title="([^"]*)" data-poster="([^"]*)" data-url="([^"]*)"/g;
        var match;

        while ((match = regex.exec(html)) !== null) {
            results.push({
                title: match[1],
                posterUrl: match[2],
                detailUrl: match[3]
            });
        }

        return JSON.stringify(results);
    }
};
