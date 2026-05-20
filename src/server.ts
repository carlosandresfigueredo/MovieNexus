import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Proxy para peticiones de TMDB (evita problemas de CORS y compresión en el navegador)
app.get('/api/tmdb/*splat', async (req, res) => {
  const splatParam = req.params['splat'];
  const targetPath = Array.isArray(splatParam) ? splatParam.join('/') : splatParam;
  const queryParams = new URLSearchParams(req.query as any).toString();
  const tmdbUrl = `https://api.themoviedb.org/3/${targetPath}?${queryParams}`;

  try {
    // Usamos fetch nativo de Node (no pide gzip, evita problemas de descompresión)
    const tmdbRes = await fetch(tmdbUrl);
    const data = await tmdbRes.json();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(tmdbRes.status).json(data);
  } catch (err: any) {
    console.error('❌ Proxy error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
