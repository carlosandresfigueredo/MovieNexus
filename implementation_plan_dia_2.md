# Plan de Implementación: Día 2 - Conexión con el Mundo Exterior (API) 🌐

En este segundo día, convertiremos nuestra aplicación estática en una plataforma dinámica que consume datos reales de **The Movie Database (TMDB)**.

## User Review Required

> [!IMPORTANT]
> **Seguridad y Mejores Prácticas:** Implementaremos un Interceptor funcional. Esto significa que no pasaremos la API Key manualmente en cada petición, sino que Angular la inyectará automáticamente en todas las llamadas salientes hacia TMDB.

## Proposed Changes

### Core (Infraestructura de Datos)

Configuraremos los cimientos para las comunicaciones HTTP.

#### [MODIFY] [app.config.ts](file:///c:/Angular/MovieNexus/src/app/app.config.ts)
*   Registrar `provideHttpClient(withFetch(), withInterceptors([...]))` para habilitar las peticiones HTTP y el uso de interceptores.

#### [NEW] [movie.model.ts](file:///c:/Angular/MovieNexus/src/app/core/models/movie.model.ts)
*   Definir interfaces `Movie` y `MovieResponse` para tipar los datos de la API de forma profesional.

#### [NEW] [api.interceptor.ts](file:///c:/Angular/MovieNexus/src/app/core/interceptors/api.interceptor.ts)
*   Crear un interceptor funcional que intercepte todas las peticiones a `api.themoviedb.org` y añada el parámetro `api_key` de forma automática.

#### [NEW] [movie.service.ts](file:///c:/Angular/MovieNexus/src/app/core/services/movie.service.ts)
*   Implementar el servicio que obtendrá las películas (Tendencias, Populares, etc.).

---

### UI (Prueba de Concepto)

#### [MODIFY] [home.ts](file:///c:/Angular/MovieNexus/src/app/features/home/home.ts)
*   Inyectar `MovieService` y realizar una petición de prueba para mostrar en consola los datos reales.

---

## Verification Plan

### Automated Tests
*   Ejecutar `npm start` y verificar en la pestaña "Network" del navegador que las peticiones llevan la `api_key` correctamente.
*   Verificar que no hay errores de CORS o de tipado en la consola.

### Manual Verification
*   Crear la **Guía Paso a Paso del Día 2** para que el usuario pueda seguir el proceso pedagógico.
