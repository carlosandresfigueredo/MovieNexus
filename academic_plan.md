# Plan Académico MovieNexus - 15 Días

Este plan está diseñado para aprendices del SENA con conocimientos previos en Angular. El objetivo es construir una aplicación de cine moderna (estilo Netflix/HBO) consumiendo la API de TMDB.

## 📅 Semana 1: Cimientos y Estructura Core

### Día 1: Inicialización y Arquitectura
*   **Tema:** Setup profesional con Angular CLI.
*   **Actividades:** Instalación, estructura de carpetas (`core`, `shared`, `features`), configuración de `environments`.
*   **Concepto Clave:** Arquitectura modular y Standalone Components.

### Día 2: Conexión con el Mundo Exterior (API)
*   **Tema:** HTTPClient e Interceptors.
*   **Actividades:** Registro en TMDB, creación de `MovieService`, implementación de un `HttpInterceptor` para adjuntar la API Key automáticamente.
*   **Concepto Clave:** Inyección de dependencias y seguridad de tokens.

### Día 3: Diseño de Interfaz Premium (CSS)
*   **Tema:** Sistema de Diseño y Flexbox/Grid.
*   **Actividades:** Definición de paleta de colores (Dark Mode), tipografías (Google Fonts), y layouts globales (Sidebar/Navbar).
*   **Concepto Clave:** Variables CSS y diseño responsivo sin frameworks pesados.

### Día 4: Home - El Héroe de la Pantalla
*   **Tema:** Input/Output y Directivas.
*   **Actividades:** Componente `Hero` para mostrar la película destacada del día con un fondo dinámico.
*   **Concepto Clave:** Manejo de imágenes de gran tamaño y gradientes CSS.

### Día 5: Listados Dinámicos (Sliders)
*   **Tema:** Control Flow (`@for`, `@if`).
*   **Actividades:** Creación de componentes `MovieCard` y `MovieSlider` para categorías (Tendencias, Populares).
*   **Concepto Clave:** El nuevo flujo de control de Angular 17+.

## 📅 Semana 2: Interactividad y Estado

### Día 6: Navegación y Rutas con Parámetros
*   **Tema:** Angular Router.
*   **Actividades:** Configuración de rutas para detalles de película (`/movie/:id`).
*   **Concepto Clave:** `ActivatedRoute` y navegación imperativa.

### Día 7: Detalle de Película - Vista Profunda
*   **Tema:** Async Pipe y Composición de Componentes.
*   **Actividades:** Mostrar sinopsis, puntuación, géneros y el elenco (Cast).
*   **Concepto Clave:** Peticiones HTTP paralelas (`forkJoin`).

### Día 8: Buscador Inteligente con Signals
*   **Tema:** Angular Signals.
*   **Actividades:** Barra de búsqueda en tiempo real que filtra películas mientras el usuario escribe.
*   **Concepto Clave:** `signal`, `computed` y `effect`.

### Día 9: Sistema de Favoritos (Local State)
*   **Tema:** LocalStorage y Manejo de Estado.
*   **Actividades:** Permitir al usuario marcar películas como favoritas y persistirlas en el navegador.
*   **Concepto Clave:** Persistencia de datos en el cliente.

### Día 10: Infinite Scroll e Intersection Observer
*   **Tema:** Optimización de carga.
*   **Actividades:** Carga automática de más películas al llegar al final de la página.
*   **Concepto Clave:** Manipulación segura del DOM y APIs del navegador.

## 📅 Semana 3: UX, Performance y Cierre

### Día 11: Deferrable Views (Carga Diferida)
*   **Tema:** `@defer`.
*   **Actividades:** Optimizar la carga de la página de detalles para que los comentarios o trailers solo se carguen cuando sean visibles.
*   **Concepto Clave:** Performance y Web Vitals.

### Día 12: Skeleton Loaders (UX)
*   **Tema:** User Experience (UX).
*   **Actividades:** Crear estados de carga elegantes (esqueletos) mientras los datos de la API llegan.
*   **Concepto Clave:** Reducción del "Layout Shift".

### Día 13: Animaciones de Transición
*   **Tema:** View Transitions API.
*   **Actividades:** Implementar transiciones suaves entre páginas al navegar.
*   **Concepto Clave:** Animaciones modernas integradas en el Router.

### Día 14: Manejo de Errores y Empty States
*   **Tema:** Robustez del código.
*   **Actividades:** Pantallas de error personalizadas (404) y mensajes cuando no hay resultados de búsqueda.
*   **Concepto Clave:** `catchError` en RxJS.

### Día 15: Pulido Final y Deploy
*   **Tema:** Producción.
*   **Actividades:** Build de producción, optimización de assets y despliegue (Vercel, Netlify o Firebase Hosting).
*   **Concepto Clave:** Entornos de producción y CI/CD básico.
