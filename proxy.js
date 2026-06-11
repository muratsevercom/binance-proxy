export default async function handler(req, res) {
    const pathParts  = req.query.path || [];
    const queryStr   = req.url.includes("?") ? "?" + req.url.split("?")[1] : "";
    const path       = "/" + pathParts.join("/") + queryStr;

    let target;
    if (path.startsWith("/fapi/") || path.startsWith("/futures/")) {
        target = "https://fapi.binance.com" + path;
    } else if (path.startsWith("/fng/")) {
        target = "https://api.alternative.me" + path;
    } else if (path.startsWith("/coingecko/")) {
        target = "https://api.coingecko.com" + path.replace("/coingecko", "");
    } else {
        target = "https://api1.binance.com" + path;
    }

    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
    };
    const apiKey = req.headers["x-mbx-apikey"];
    if (apiKey) headers["X-MBX-APIKEY"] = apiKey;

    try {
        const response = await fetch(target, { method: req.method, headers });
        const body = await response.text();
        res.status(response.status)
           .setHeader("Content-Type", response.headers.get("content-type") || "application/json")
           .send(body);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
