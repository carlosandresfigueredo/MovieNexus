# Guía Pedagógica: Día 15 - PWA (Instalación Móvil) y Pruebas Unitarias 📱🧪

¡Llegamos al final de nuestro viaje! Ya tienes tu aplicación funcionando y desplegada en Vercel. Hoy vamos a dar dos pasos gigantes para convertirla en una aplicación de nivel profesional:

1. **PWA (Progressive Web App):** Haremos que los usuarios puedan "instalar" tu web en sus celulares o computadoras como si fuera una app nativa, con su propio icono, sin barras del navegador y funcionando incluso si el internet es lento.
2. **Pruebas Unitarias (Testing):** Escribiremos nuestras primeras pruebas automáticas. Esto es como crear un "robot" que revisa tu código para asegurarse de que no rompiste nada accidentalmente.

---

## Parte 1: PWA (Convierte tu web en una App Instalable) 📱

Una PWA utiliza tecnologías web modernas para dar una experiencia de aplicación nativa. Los dos pilares de una PWA son:
*   **Web App Manifest:** Un archivo JSON que le dice al dispositivo cómo debe verse la app al instalarse (nombre, colores, icono).
*   **Service Worker:** Un archivo JavaScript que se ejecuta en segundo plano. Hace de "puente" entre tu app y la red, permitiendo guardar cosas en caché para que la app cargue súper rápido o funcione sin internet.

### Paso 1: Agregar el paquete PWA de Angular

Angular hace que esto sea increíblemente fácil. Abre una nueva terminal en tu proyecto y ejecuta este comando:

```bash
ng add @angular/pwa
```

**¿Qué hace este comando "mágico"?**
1. Añade el paquete `@angular/service-worker` a tu proyecto.
2. Crea el archivo `manifest.webmanifest` (donde configuraremos el nombre y los iconos).
3. Crea el archivo `ngsw-config.json` (donde le decimos a Angular qué archivos guardar en caché).
4. Modifica `index.html` para enlazar el manifest y establecer un color de tema.
5. Agrega iconos por defecto en `src/assets/icons/`.

### Paso 2: Personalizar el Manifiesto (`manifest.webmanifest`)

Abre el archivo `src/manifest.webmanifest`. Verás algo como esto. Modifícalo con los datos de tu aplicación:

```json
{
  "name": "MovieNexus",
  "short_name": "MovieNexus",
  "theme_color": "#1f2937",
  "background_color": "#111827",
  "display": "standalone",
  "scope": "./",
  "start_url": "./",
  "icons": [
    {
      "src": "assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    // ... más iconos ...
  ]
}
```
*   `theme_color`: El color de la barra superior del celular (pon uno de los colores oscuros de tu app).
*   `background_color`: El color que se muestra antes de que cargue la app (la pantalla de carga "Splash Screen").
*   `display: "standalone"`: Esto es clave. Le dice al celular que oculte la barra de URL del navegador para que parezca una app real.

*(Nota: Si quieres, más adelante puedes reemplazar las imágenes de la carpeta `src/assets/icons` por un logo propio, ¡solo asegúrate de mantener los mismos nombres y tamaños!)*

### Paso 3: Probar la PWA localmente

**⚠️ IMPORTANTE:** Los Service Workers por seguridad **solo funcionan en producción**. No funcionarán con el clásico `npm start` (ng serve).

Para probarlo localmente, tenemos que simular un entorno de producción:

1. Primero, construye la versión final de la aplicación:
   ```bash
   ng build
   ```
2. Instala un servidor web ligero globalmente (solo la primera vez):
   ```bash
   npm install -g http-server
   ```
3. Ejecuta el servidor en la carpeta donde Angular generó los archivos finales (normalmente `dist/movie-nexus/browser` o algo similar. Fíjate en la carpeta que se crea en `dist/`):
   ```bash
   http-server -p 8080 -c-1 dist/MovieNexus/browser
   ```
   *(Asegúrate de que la ruta sea correcta según el nombre de tu proyecto en angular.json)*

4. Abre tu navegador en `http://localhost:8080`.
5. Si usas Chrome, verás un **icono de una pantallita con una flecha** en la barra de direcciones (al lado de la estrellita de favoritos). ¡Haz clic ahí y podrás instalar tu app en tu computadora!

---

## Parte 2: Pruebas Unitarias (Testing) a Profundidad 🧪

Las pruebas automatizadas son como crear un "robot" que revisa tu código constantemente para asegurarse de que no rompiste nada al agregar nuevas funciones. En empresas y proyectos profesionales, **no se sube código a producción si no pasa las pruebas**.

### ¿Por qué hacemos pruebas?
1. **Prevención de Regresiones:** Evita que al arreglar un bug hoy, rompas algo que funcionaba ayer.
2. **Documentación Viva:** Leer las pruebas de un componente te dice exactamente qué se supone que hace y cómo usarlo.
3. **Confianza al Refactorizar:** Si quieres cambiar cómo está escrito el código para hacerlo más limpio, las pruebas te dirán inmediatamente si cambiaste su comportamiento por error.

### Tipos de Pruebas
*   **Unitarias (Unit Tests):** Prueban la pieza más pequeña de código de forma aislada (ej. una sola función, un solo componente o servicio). Usan datos falsos ("Mocks") para no depender de otros archivos o de internet. *Estas son las que haremos hoy*.
*   **Integración:** Prueban cómo interactúan dos o más unidades juntas.
*   **End-to-End (E2E):** Prueban la aplicación completa, simulando clics de un usuario real en el navegador (ej. Cypress o Playwright).

### Herramientas en Angular
Angular viene por defecto con:
*   **Jasmine:** El *framework* para escribir las pruebas. Nos da funciones como `describe()` (agrupar pruebas), `it()` (una prueba individual) y `expect()` (lo que esperamos que suceda).
*   **Karma:** El *Test Runner*. Es el motor que abre un navegador real (como Chrome), ejecuta el código de Jasmine, y te muestra el reporte visual (los famosos "puntos verdes" o "cruces rojas").

### La regla de oro: El Patrón AAA
Toda buena prueba unitaria se divide mentalmente en 3 pasos:
1. **Arrange (Preparar):** Configurar el estado inicial (variables, dependencias, datos falsos).
2. **Act (Actuar):** Ejecutar la función o método que queremos probar.
3. **Assert (Afirmar/Comprobar):** Verificar que el resultado de la acción sea el esperado.

---

### Paso 4: Escribir una prueba para el `MovieService`

Vamos a poner en práctica todo esto probando un Servicio. Los servicios son el mejor lugar para empezar porque manejan la lógica pura y las peticiones a la API.

Abre el archivo `src/app/core/services/movie.service.spec.ts`. (El sufijo `.spec.ts` indica que es un archivo de pruebas o "specifications").

Borra lo que hay y pega este código. ¡Lee los comentarios, ahí está la magia!:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';

// 1. DESCRIBE: Agrupa todas las pruebas relacionadas con MovieService
describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  // 2. BEFORE EACH: Se ejecuta ANTES de cada 'it'. Es nuestro "Arrange" global.
  beforeEach(() => {
    // TestBed es el entorno de pruebas de Angular. Nos permite configurar qué módulos inyectar.
    TestBed.configureTestingModule({
      providers: [
        MovieService,
        provideHttpClient(),
        // Usamos este módulo especial para interceptar peticiones HTTP y que no salgan a internet
        provideHttpClientTesting() 
      ]
    });
    
    // Inyectamos las instancias para poder usarlas en las pruebas
    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // 3. AFTER EACH: Se ejecuta DESPUÉS de cada 'it'. Limpiamos la casa.
  afterEach(() => {
    // Verificamos que no hayan quedado peticiones HTTP pendientes en el limbo
    httpMock.verify();
  });

  // --- PRIMERA PRUEBA ---
  // 'it' define una prueba individual. La descripción debe leerse como "debería hacer X"
  it('debería ser creado correctamente', () => {
    // Assert: Comprobamos que la variable 'service' tiene un valor válido (true).
    expect(service).toBeTruthy(); 
  });

  // --- SEGUNDA PRUEBA ---
  it('debería buscar películas y devolver datos de la API simulada', () => {
    // 1. ARRANGE (Preparar)
    // Creamos datos falsos ("Mocks") exactamente con la estructura que devolvería la API real
    const mockResponse = { results: [{ id: 1, title: 'Inception' }] };
    const searchTerm = 'Inception';

    // 2. ACT (Actuar)
    // Llamamos al método de nuestro servicio (cambia 'searchMovies' por el nombre real en tu servicio)
    service.searchMovies(searchTerm).subscribe(response => {
      
      // 3. ASSERT (Comprobar)
      // Comprobamos que lo que devolvió el servicio sea igual a nuestro mock
      expect(response.results.length).toBe(1);
      expect(response.results[0].title).toEqual('Inception');
    });

    // --- MAGIA DEL HTTP MOCK ---
    // Le decimos a Angular qué URL exacta esperamos que el servicio haya intentado llamar
    // (Adapta esta URL a la de TMDB si es distinta en tu proyecto)
    const req = httpMock.expectOne(`https://api.themoviedb.org/3/search/movie?query=${searchTerm}&language=es-ES`);
    
    // Comprobamos que la petición haya sido por el método GET
    expect(req.request.method).toBe('GET');
    
    // Simulamos que el servidor de TMDB respondió exitosamente devolviendo nuestro mockResponse.
    // Esto es lo que detona que el 'subscribe' de arriba se ejecute.
    req.flush(mockResponse); 
  });
});
```

### ¿Qué se tiene en cuenta al probar este servicio?
*   **Aislamiento (Isolation):** Fíjate que **no** hicimos una petición real a TMDB. Si no tuviéramos internet o TMDB estuviera caído, la prueba seguiría pasando (en verde). Eso es vital: la prueba evalúa TU lógica, no el estado del servidor externo.
*   **Mocks/Stubs:** `mockResponse` es un "Mock". Es un objeto falso que se hace pasar por la respuesta de la base de datos o API.
*   **Asincronía controlada:** Al usar `HttpTestingController` (`httpMock`), controlamos exactamente en qué milisegundo el servidor "responde" usando el comando `req.flush()`.

### Paso 5: Ejecutar las pruebas

Abre tu terminal y ejecuta el comando de Angular para pruebas:

```bash
ng test
```

**¿Qué pasa cuando ejecutas esto?**
1. Angular compila todo tu código en "modo prueba".
2. Lanza Karma, que a su vez abre una instancia de Google Chrome automáticamente.
3. Jasmine ejecuta todos los bloques `describe` e `it`.
4. Si un solo `expect` falla (por ejemplo, esperabas 1 película y llegaron 0), toda la prueba se marca en rojo.
5. Verás en el navegador o en la consola un mensaje indicando `X SUCCESS, Y FAILED`.

¡Intenta cambiar `expect(response.results.length).toBe(1);` a `toBe(2)` y mira cómo la prueba falla a propósito! Esto te ayudará a entender cómo el "robot" te avisa cuando algo está mal.

---

## 🚀 Paso Final: Ver tu PWA en el celular real

Ahora que has convertido tu app en una PWA, sube tus cambios a GitHub:

```bash
git add .
git commit -m "feat: setup PWA y pruebas unitarias base"
git push origin main
```

Vercel detectará el cambio y reconstruirá tu aplicación automáticamente.

**Cómo instalarla en tu celular:**
1. Abre tu celular (iPhone o Android).
2. Entra a tu navegador web (Safari en iOS, Chrome en Android).
3. Entra a la URL de tu proyecto en Vercel (ej. `tu-proyecto.vercel.app`).
4. **En Android (Chrome):** Suele aparecer un banner inferior que dice "Añadir a la pantalla de inicio". Si no, abre el menú de tres puntitos y busca "Instalar aplicación".
5. **En iOS (Safari):** Toca el botón de Compartir (el cuadrado con la flechita hacia arriba) y baja hasta encontrar la opción "Añadir a la pantalla de inicio".

¡Y LISTO! Ahora tendrás un icono en tu celular. Al tocarlo, se abrirá sin las barras del navegador, como una app 100% nativa.

---

## 🎉 ¡Felicidades! 🎉

Has completado no solo una aplicación funcional, sino que tiene estilos avanzados, consume APIs, maneja estados vacíos y errores, tiene pruebas unitarias y se puede instalar como aplicación móvil. ¡Eres oficialmente un desarrollador Angular listísimo para afrontar retos en el mundo laboral!
