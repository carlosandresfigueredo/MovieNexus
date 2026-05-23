import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * INTERCEPTOR DE ERRORES GLOBALES
 * 
 * Atrapa cualquier error de red (HTTP) en toda la aplicación
 * antes de que llegue a los componentes individuales.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado.';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente o de red
        errorMessage = `Error de red: ${error.error.message}`;
      } else {
        // Error devuelto por el backend (API)
        switch (error.status) {
          case 401:
            errorMessage = 'No autorizado. Por favor, revisa tu API Key de TMDB.';
            break;
          case 404:
            errorMessage = 'El recurso solicitado no fue encontrado.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor. Intenta más tarde.';
            break;
          default:
            errorMessage = `Código de error ${error.status}: ${error.message}`;
        }
      }

      // Podríamos usar un servicio de notificaciones (Toast/Snackbar) aquí
      console.error('MovieNexus Error Global:', errorMessage);
      
      // Propagamos el error para que los componentes puedan manejarlo si lo desean
      return throwError(() => new Error(errorMessage));
    })
  );
};
