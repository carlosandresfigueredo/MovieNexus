const https = require('https');

module.exports = (req, res) => {
  // Extraemos el splat (ej: movie/popular) y removemos de los query params
  const { splat, ...restQuery } = req.query;
  
  if (!splat) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  // Reconstruimos la query string
  const queryParams = new URLSearchParams(restQuery).toString();
  const tmdbUrl = `https://api.themoviedb.org/3/${splat}?${queryParams}`;

  // Hacemos la llamada directa a TMDB sin enviar 'Accept-Encoding: gzip', 
  // asegurando recibir JSON plano sin problemas de compresión.
  https.get(tmdbUrl, (tmdbRes) => {
    let responseData = '';

    tmdbRes.on('data', (chunk) => {
      responseData += chunk.toString('utf8');
    });

    tmdbRes.on('end', () => {
      try {
        const parsedBody = JSON.parse(responseData);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.status(tmdbRes.statusCode || 200).json(parsedBody);
      } catch (parseErr) {
        console.error('❌ Vercel Proxy JSON parse error:', parseErr.message);
        res.status(500).json({ 
          error: 'Failed to parse TMDB response as JSON', 
          rawSnippet: responseData.slice(0, 200) 
        });
      }
    });
  }).on('error', (err) => {
    console.error('❌ Vercel Proxy HTTP error:', err.message);
    res.status(500).json({ error: err.message });
  });
};
