import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import https from 'node:https';
import zlib from 'node:zlib';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Proxy para peticiones de TMDB (evita problemas de descompresión y CORS en el navegador)
app.get('/api/tmdb/*splat', (req, res) => {
  const splatParam = req.params['splat'];
  const targetPath = Array.isArray(splatParam) ? splatParam.join('/') : splatParam;
  const queryParams = new URLSearchParams(req.query as any).toString();
  const tmdbUrl = `https://api.themoviedb.org/3/${targetPath}?${queryParams}`;

  https.get(tmdbUrl, {
    headers: {
      'Accept-Encoding': 'gzip'
    }
  }, (tmdbRes: any) => {
    let stream: any = tmdbRes;
    if (tmdbRes.headers['content-encoding'] === 'gzip') {
      const gunzip = zlib.createGunzip();
      tmdbRes.pipe(gunzip);
      stream = gunzip;
    }

    let responseData = '';
    stream.on('data', (chunk: any) => {
      responseData += chunk.toString('utf8');
    });

    const sendResponse = () => {
      try {
        const parsedBody = JSON.parse(responseData);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.status(tmdbRes.statusCode || 200).json(parsedBody);
      } catch (parseErr: any) {
        console.error('❌ Proxy JSON parse error:', parseErr.message);
        res.status(500).json({ error: 'Failed to parse TMDB response as JSON' });
      }
    };

    stream.on('end', () => {
      sendResponse();
    });

    stream.on('error', (err: any) => {
      if (err.code === 'Z_BUF_ERROR' || err.message.includes('unexpected end of file')) {
        sendResponse();
        return;
      }
      console.error('❌ Proxy stream error:', err);
      res.status(500).json({ error: err.message });
    });
  }).on('error', (err) => {
    console.error('❌ Proxy HTTP error:', err);
    res.status(500).json({ error: err.message });
  });
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

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
