import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * INTERCEPTOR DE API (EL ESCUDO AUTOMÁTICO)
 * 
 * ¿Cómo funciona?
 * Este interceptor "atrapa" cada petición HTTP antes de que salga al servidor.
 * Si la URL es de TMDB, le añade la API Key y el idioma de forma automática.
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  
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

    // 3. Enviamos la petición modificada
    return next(apiReq);
  }

  // Si no es para TMDB, la dejamos pasar sin cambios
  return next(req);
};
