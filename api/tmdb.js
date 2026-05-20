module.exports = async (req, res) => {
  // Extraemos el splat (ej: movie/popular) y removemos de los query params
  const { splat, ...restQuery } = req.query;
  
  if (!splat) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  // Reconstruimos la query string
  const queryParams = new URLSearchParams(restQuery).toString();
  const tmdbUrl = `https://api.themoviedb.org/3/${splat}?${queryParams}`;

  try {
    // Usamos fetch nativo (maneja compresión automáticamente)
    const tmdbRes = await fetch(tmdbUrl);
    const data = await tmdbRes.json();
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(tmdbRes.status).json(data);
  } catch (err) {
    console.error('❌ Vercel Proxy error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
