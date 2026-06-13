export default async function handler(req, res) {
  const path = req.url;

  let target;
  if (path.startsWith('/fapi/') || path.startsWith('/futures/')) {
    target = 'https://fapi.binance.com' + path;
  } else if (path.startsWith('/fng/')) {
    target = 'https://api.alternative.me' + path;
  } else if (path.startsWith('/coingecko/')) {
    target = 'https://api.coingecko.com' + path.replace('/coingecko', '');
  } else {
    target = 'https://api.binance.com' + path;
  }

  const headers = { 'Accept': 'application/json' };
  const apiKey = req.headers['x-mbx-apikey'];
  if (apiKey) headers['X-MBX-APIKEY'] = apiKey;

  const response = await fetch(target, { method: req.method, headers });
  const data = await response.json();

  res.status(response.status).json(data);
}
