import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

/**
 * INTERCEPTOR DE API (EL ESCUDO AUTOMÁTICO Y COMPATIBILIDAD SSR)
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  
  // 1. Verificamos si la petición es para la API de TMDB
  if (req.url.includes('api.themoviedb.org')) {
    
    // 2. Clonamos la petición (porque las originales son inmutables)
    // y le inyectamos los parámetros necesarios.
    const apiReq = req.clone({
      setParams: {
        api_key: environment.apiKey,
        language: 'es-ES' // Pedimos los datos en español
      }
    });

    // 3. Si estamos en el navegador, redirigimos a través del proxy local/producción (/api/tmdb)
    if (isPlatformBrowser(platformId)) {
      const proxyReq = apiReq.clone({
        url: apiReq.url.replace('https://api.themoviedb.org/3', '/api/tmdb')
      });
      return next(proxyReq);
    }

    // 4. Si estamos en el servidor (SSR), hacemos la llamada directa a la API de TMDB (Node lo maneja sin CORS)
    return next(apiReq);
  }

  // Si no es para TMDB, la dejamos pasar sin cambios
  return next(req);
};
