# Guía Pedagógica: Día 15 - PWA (Instalación Móvil) y Pruebas Unitarias 📱🧪

¡Llegamos al final de nuestro viaje! Ya tienes tu aplicación funcionando y desplegada en Vercel. Hoy vamos a dar dos pasos gigantes para convertirla en una aplicación de nivel profesional:

1. **PWA (Progressive Web App):** Haremos que los usuarios puedan "instalar" tu web en sus celulares o computadoras como si fuera una app nativa, con su propio icono, sin barras del navegador y funcionando incluso si el internet es lento.
2. **Pruebas Unitarias (Testing):** Escribiremos nuestras primeras pruebas automáticas. Esto es como crear un "robot" que revisa tu código para asegurarse de que no rompiste nada accidentalmente.

---

## Parte 1: PWA (Convierte tu web en una App Instalable) 📱

### ¿Qué es una PWA?

Una **Progressive Web App** es una página web que se comporta como una aplicación nativa del celular. Imagina que tu web de MovieNexus se puede abrir desde un icono en la pantalla del celular, sin barras del navegador, y que carga ultra rápido incluso con internet lento. ¡Eso es una PWA!

Los **dos pilares** de toda PWA son:

*   **Web App Manifest (`manifest.webmanifest`):** Un archivo JSON que le dice al dispositivo cómo debe verse la app al instalarse — su nombre, colores, icono y cómo se abre.
*   **Service Worker:** Un archivo JavaScript invisible que se ejecuta en segundo plano. Actúa como un "intermediario inteligente" entre tu app y la red: guarda archivos en caché para que la app cargue súper rápido, e incluso puede funcionar sin internet.

### ¿Qué necesita Chrome para mostrar el botón "Instalar"?

Chrome es muy estricto. Para que aparezca el famoso botón de instalar (📱 el iconito en la barra de direcciones), tu app **DEBE cumplir TODOS estos requisitos**:

1. ✅ Servirse por **HTTPS** (Vercel ya nos lo da gratis).
2. ✅ Tener un **`manifest.webmanifest`** válido con `name`, `start_url` y `display: "standalone"`.
3. ✅ Tener **al menos un icono de 192x192 píxeles** y otro de **512x512 píxeles** (archivos reales, no solo la referencia en el JSON).
4. ✅ Tener un **Service Worker registrado** y activo.

Si falta **cualquiera** de estos 4 puntos, Chrome simplemente no muestra nada. No te da error, no te avisa — simplemente no aparece el botón. Por eso es tan importante verificar cada paso.

---

### Paso 1: Instalar el paquete del Service Worker

Lo primero es instalar el paquete `@angular/service-worker`. Este paquete le da a Angular la capacidad de registrar y manejar un Service Worker automáticamente.

> **⚠️ NOTA IMPORTANTE sobre Angular 21:** Al momento de escribir esta guía, Angular 21 es una versión muy reciente y el comando automático `ng add @angular/pwa` puede fallar por incompatibilidades de versión. Por eso, aquí te enseñamos a configurar la PWA **paso a paso manualmente**. Esto es mucho más valioso porque entenderás exactamente qué hace cada pieza — en una entrevista laboral, saber explicar esto vale oro.

Abre tu terminal y ejecuta:

```bash
npm install @angular/service-worker --legacy-peer-deps
```

**¿Por qué usamos `--legacy-peer-deps`?**

Cuando un paquete de npm se instala, revisa si las versiones de los otros paquetes de tu proyecto son "compatibles". Como Angular 21 es muy nuevo, algunos paquetes todavía no han actualizado su lista de versiones compatibles. La flag `--legacy-peer-deps` le dice a npm: *"instálalo de todas formas, yo sé lo que hago"*. Funciona perfectamente — es solo un tema de que la lista oficial aún no se actualizó.

---

### Paso 2: Crear el archivo `.npmrc` (CRÍTICO para Vercel)

Este paso es **crucial** y es donde muchos se quedan atascados sin saber por qué.

Cuando tú ejecutas `npm install --legacy-peer-deps` en tu computadora, eso solo aplica en TU máquina. Pero cuando Vercel reconstruye tu proyecto (después de cada `git push`), Vercel ejecuta un `npm install` **limpio sin esa flag**, y el build falla porque encuentra conflictos de dependencias.

La solución es crear un archivo `.npmrc` en la raíz de tu proyecto que le diga a npm **en cualquier máquina** que use esa configuración:

Crea el archivo `.npmrc` en la raíz del proyecto (al mismo nivel que `package.json`) con este contenido:

```
legacy-peer-deps=true
```

Eso es todo. Una sola línea. Pero sin ella, **Vercel no podrá hacer el build** y verás errores rojos en tu panel de deployments.

> **💡 Lección del mundo real:** En proyectos profesionales, el archivo `.npmrc` se usa constantemente para configurar registros privados, tokens de acceso, y flags de compatibilidad. ¡Ya estás aprendiendo prácticas de trabajo reales!

---

### Paso 3: Crear el Web App Manifest

El manifest es la "tarjeta de presentación" de tu PWA. Le dice al dispositivo: *"Hola, soy MovieNexus, estos son mis colores, este es mi icono, y quiero que me abras sin barras del navegador"*.

Crea el archivo `public/manifest.webmanifest` con este contenido:

```json
{
  "name": "MovieNexus",
  "short_name": "MovieNexus",
  "description": "Descubre, busca y guarda tus películas favoritas",
  "theme_color": "#111827",
  "background_color": "#0f172a",
  "display": "standalone",
  "orientation": "portrait-primary",
  "scope": "/",
  "start_url": "/",
  "id": "/",
  "icons": [
    {
      "src": "assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "assets/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "assets/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "assets/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "assets/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "assets/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ]
}
```

**Explicación de cada campo:**

| Campo | ¿Para qué sirve? | Ejemplo |
|---|---|---|
| `name` | Nombre completo que se muestra al instalar | "MovieNexus" |
| `short_name` | Nombre corto que va debajo del icono | "MovieNexus" |
| `description` | Descripción para tiendas y el sistema | "Descubre, busca y guarda..." |
| `theme_color` | Color de la barra superior del celular | "#111827" (gris oscuro) |
| `background_color` | Color de la "Splash Screen" (pantalla de carga) | "#0f172a" (azul muy oscuro) |
| `display` | Cómo se muestra la app | "standalone" = sin barras del navegador |
| `orientation` | Orientación preferida | "portrait-primary" = vertical |
| `scope` | Páginas que controla la PWA | "/" = toda la app |
| `start_url` | URL que se abre al tocar el icono | "/" = la página principal |
| `id` | Identificador único de la PWA | "/" |
| `icons` | Lista de iconos en distintos tamaños | Mínimo 192x192 y 512x512 |

> **⚠️ CUIDADO con `purpose`:** Antes se usaba `"purpose": "maskable any"` (las dos juntas), pero Chrome moderno ahora exige que sean **separadas**. Si necesitas ambas, debes declarar el icono dos veces: una con `"any"` y otra con `"maskable"`. Para simplicidad, usamos solo `"any"` que funciona perfecto.

---

### Paso 4: Crear los iconos de la PWA

Aquí está el detalle que a muchos se les olvida: **no basta con poner las rutas de los iconos en el manifest — los archivos PNG deben existir realmente**. Si los archivos no existen, Chrome no puede verificar que tu PWA es válida y simplemente no muestra el botón de instalar. No da error, simplemente no aparece nada.

1. Crea la carpeta para los iconos:
   ```bash
   mkdir -p public/assets/icons
   ```

2. Necesitas crear imágenes PNG en estos tamaños: `72x72`, `96x96`, `128x128`, `144x144`, `152x152`, `192x192`, `384x384`, `512x512`.

3. **Opción rápida:** Usa cualquier herramienta online como [favicon.io](https://favicon.io) o [realfavicongenerator.net](https://realfavicongenerator.net) para generar todos los tamaños a partir de una imagen. Sube una imagen cuadrada con el logo de tu app y descarga el paquete de iconos.

4. **Opción con script:** En la raíz del proyecto hay un archivo `generate-icons.js` que puedes ejecutar con:
   ```bash
   node generate-icons.js
   ```
   Esto genera iconos sólidos de color azul en todos los tamaños necesarios. Son funcionales para que Chrome acepte la PWA.

5. Coloca los archivos en `public/assets/icons/` con los nombres exactos que pusiste en el manifest:
   ```
   public/
   └── assets/
       └── icons/
           ├── icon-72x72.png
           ├── icon-96x96.png
           ├── icon-128x128.png
           ├── icon-144x144.png
           ├── icon-152x152.png
           ├── icon-192x192.png
           ├── icon-384x384.png
           └── icon-512x512.png
   ```

> **💡 Tip:** Los archivos están en la carpeta `public/` (no en `src/`). Angular copia automáticamente todo el contenido de `public/` a la carpeta de distribución final cuando haces `ng build`. Esto está configurado en tu `angular.json` dentro de la sección `assets`.

---

### Paso 5: Crear la configuración del Service Worker (`ngsw-config.json`)

El Service Worker necesita saber **qué archivos guardar en caché**. Creamos un archivo de configuración en la raíz del proyecto llamado `ngsw-config.json`:

```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/assets/**",
          "/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)"
        ]
      }
    }
  ]
}
```

**¿Qué significan los grupos?**

*   **`app` (installMode: "prefetch"):** Estos archivos se descargan y guardan en caché **inmediatamente** cuando el usuario visita la app por primera vez. Incluye el HTML, CSS y JavaScript principales — lo esencial para que la app abra.
*   **`assets` (installMode: "lazy"):** Estos archivos se guardan en caché **solo cuando se necesitan** (lazy = perezoso). Incluye imágenes, fuentes y otros recursos. No los descargamos todos al inicio para no desperdiciar datos del usuario.
*   **`updateMode: "prefetch"`:** Cuando hay una nueva versión de la app, los assets se actualizan proactivamente en segundo plano.

---

### Paso 6: Registrar el Service Worker en Angular (`app.config.ts`)

Ahora le decimos a Angular que use el Service Worker. Abre `src/app/app.config.ts` y haz estos dos cambios:

1. **Agrega los imports** en la parte superior:
```typescript
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
// ... el resto de tus imports existentes ...
```

2. **Agrega el provider** en el array de `providers`:
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiInterceptor, errorInterceptor])
    ),
    provideClientHydration(withEventReplay()),
    // 👇 NUEVO: Registrar el Service Worker
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
};
```

**¿Qué hace cada opción?**
*   `'ngsw-worker.js'`: Es el nombre del archivo del Service Worker que Angular genera automáticamente cuando haces `ng build`.
*   `enabled: !isDevMode()`: El Service Worker **solo se activa en producción**. En modo desarrollo (`ng serve`) está desactivado porque el caché interferiría con tus cambios en tiempo real (harías un cambio y no lo verías porque el Service Worker te serviría la versión vieja).
*   `registrationStrategy: 'registerWhenStable:30000'`: Espera hasta que la app esté "estable" (cargada por completo) o máximo 30 segundos antes de registrar el Service Worker. Esto evita que el Service Worker compita con la app por recursos durante la carga inicial.

---

### Paso 7: Configurar `angular.json` para el Service Worker

Abre `angular.json` y dentro de `projects > MovieNexus > architect > build > options`, agrega esta línea:

```json
"serviceWorker": "ngsw-config.json"
```

Esto le dice al build de Angular: *"Cuando compiles para producción, lee el archivo `ngsw-config.json` y genera el Service Worker automáticamente"*.

Tu sección de `options` debería quedar así (la línea nueva está marcada con el comentario):

```json
"options": {
  "browser": "src/main.ts",
  "tsConfig": "tsconfig.app.json",
  "assets": [
    {
      "glob": "**/*",
      "input": "public"
    }
  ],
  "styles": ["src/styles.css"],
  "server": "src/main.server.ts",
  "outputMode": "server",
  "ssr": {
    "entry": "src/server.ts"
  },
  "serviceWorker": "ngsw-config.json"  // 👈 NUEVA LÍNEA
}
```

---

### Paso 8: Enlazar el Manifest en `index.html`

Abre `src/index.html` y agrega dos líneas dentro del `<head>`: una para enlazar el manifest y otra para el color del tema:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>MovieNexus</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <!-- 👇 NUEVAS LÍNEAS para PWA -->
    <link rel="manifest" href="manifest.webmanifest">
    <meta name="theme-color" content="#111827">
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

*   `<link rel="manifest">`: Le dice al navegador dónde encontrar el manifest de la PWA.
*   `<meta name="theme-color">`: Define el color de la barra superior del navegador en dispositivos móviles.

---

### Paso 9: Verificar que todo funcione (Build local)

**⚠️ IMPORTANTE:** Los Service Workers por seguridad **solo funcionan en producción**. No funcionarán con el clásico `npm start` (ng serve).

Para verificar localmente que tu PWA compila correctamente:

```bash
ng build
```

Si el build termina sin errores, ¡la configuración PWA está correcta! Deberías ver en la salida tanto "Browser bundles" como "Server bundles".

Para probarlo localmente como PWA completa, necesitas un servidor estático:

1. Instala un servidor web ligero globalmente (solo la primera vez):
   ```bash
   npm install -g http-server
   ```
2. Ejecuta el servidor apuntando a la carpeta de distribución:
   ```bash
   http-server -p 8080 -c-1 dist/MovieNexus/browser
   ```
3. Abre `http://localhost:8080` en Chrome.
4. Busca el icono de instalar (📱) en la barra de direcciones.

---

### Paso 10: Configurar `vercel.json` para la PWA (CRÍTICO)

Si subes tu PWA a Vercel sin esta configuración, notarás que la PWA no carga correctamente o el Service Worker no se actualiza. Esto sucede porque Vercel cachea agresivamente los archivos en el servidor por defecto y no envía las rutas correctas al Service Worker en un entorno SPA.

Abre el archivo `vercel.json` en la raíz de tu proyecto y asegúrate de que tenga este contenido:

```json
{
  "headers": [
    {
      "source": "/(.*)/(ngsw-worker\\.js|ngsw\\.json)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/tmdb/(.*)",
      "destination": "/api/tmdb.js?splat=$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

*   **headers**: Le dice a Vercel que NUNCA guarde en caché el archivo `ngsw-worker.js` (el Service Worker) ni el `ngsw.json`. Así, cuando publiques una nueva versión, los dispositivos la detectarán de inmediato.
*   **rewrites**: Le dice a Vercel que cualquier ruta (ej. `/movie/123`) debe ser manejada por `index.html`. Sin esto, al recargar la página la PWA se rompería devolviendo un error 404 del servidor.

---

## Parte 2: Pruebas Unitarias (Testing) a Profundidad 🧪

Las pruebas automatizadas son como crear un "robot inspector" que revisa tu código constantemente para asegurarse de que no rompiste nada al agregar nuevas funciones. En empresas y proyectos profesionales, **no se sube código a producción si no pasa las pruebas**. Punto. Sin excepción.

### ¿Por qué hacemos pruebas?

1. **Prevención de Regresiones:** Imagina que arreglas un bug en el buscador y, sin darte cuenta, rompes la página de favoritos. Las pruebas detectan eso inmediatamente — antes de que un usuario real lo sufra.
2. **Documentación Viva:** Leer las pruebas de un componente te dice exactamente qué se supone que hace y cómo usarlo. Es como un manual que nunca se desactualiza porque SI se desactualiza, la prueba falla y te obliga a actualizarlo.
3. **Confianza al Refactorizar:** Si quieres reescribir una función para hacerla más limpia o más rápida, las pruebas te dirán inmediatamente si cambiaste su comportamiento por error. Sin pruebas, refactorizar da miedo. Con pruebas, es un placer.
4. **Requisito laboral:** En cualquier entrevista técnica para Angular te van a preguntar por testing. Saber escribir y explicar pruebas te pone por encima del 80% de candidatos junior.

### Tipos de Pruebas

| Tipo | ¿Qué prueba? | Ejemplo | Velocidad |
|---|---|---|---|
| **Unitarias** | Una pieza aislada (función, servicio, componente) | "¿El servicio devuelve películas correctamente?" | ⚡ Muy rápidas (milisegundos) |
| **Integración** | Cómo interactúan 2+ piezas juntas | "¿El componente muestra los datos del servicio?" | 🔄 Moderadas |
| **End-to-End (E2E)** | La app completa, simulando un usuario real | "¿Puedo buscar 'Inception' y ver el resultado?" | 🐢 Lentas (segundos) |

**Hoy nos enfocamos en Unitarias** — son las más fundamentales y las que más se usan en el día a día.

### Herramientas de Testing en Angular

Angular viene configurado con herramientas de testing. En nuestro proyecto usamos:

*   **Vitest:** El *Test Runner* moderno y rápido. Es el motor que ejecuta tus pruebas y te muestra los resultados (✅ verde = pasó, ❌ rojo = falló). Es la alternativa moderna a Karma, mucho más rápida.
*   **Las funciones de testing:** `describe()` (agrupar pruebas), `it()` (una prueba individual) y `expect()` (lo que esperamos que suceda).

### La regla de oro: El Patrón AAA

Toda buena prueba unitaria se divide mentalmente en **3 pasos**. Memorízalos porque los vas a usar siempre:

```
┌─────────────────────────────────────────┐
│  1. ARRANGE (Preparar)                  │
│     Configurar datos falsos, variables  │
│     y dependencias necesarias.          │
├─────────────────────────────────────────┤
│  2. ACT (Actuar)                        │
│     Ejecutar la función o método que    │
│     queremos probar.                    │
├─────────────────────────────────────────┤
│  3. ASSERT (Afirmar/Comprobar)          │
│     Verificar que el resultado sea      │
│     exactamente lo que esperábamos.     │
└─────────────────────────────────────────┘
```

---

### Paso 11: Escribir una prueba para el `MovieService`

Vamos a poner en práctica todo esto probando un **Servicio**. Los servicios son el mejor lugar para empezar porque manejan la lógica pura y las peticiones a la API — sin componentes visuales que compliquen las cosas.

Abre el archivo `src/app/core/services/movie.service.spec.ts`. (El sufijo `.spec.ts` indica que es un archivo de pruebas o "specifications" — Angular lo busca automáticamente).

Borra lo que hay y pega este código. **Lee todos los comentarios, ahí está la explicación real**:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';

// ╔══════════════════════════════════════════════════════════════╗
// ║  1. DESCRIBE: Agrupa todas las pruebas de MovieService      ║
// ║  Piénsalo como un "capítulo" dedicado a este servicio.      ║
// ╚══════════════════════════════════════════════════════════════╝
describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  2. BEFORE EACH: Se ejecuta ANTES de cada 'it'.            ║
  // ║  Es nuestro "Arrange" global — prepara el escenario limpio ║
  // ║  antes de cada prueba individual.                          ║
  // ╚══════════════════════════════════════════════════════════════╝
  beforeEach(() => {
    // TestBed es el "laboratorio" de Angular para pruebas.
    // Aquí creamos un mini-entorno con SOLO lo que necesita MovieService.
    TestBed.configureTestingModule({
      providers: [
        MovieService,
        provideHttpClient(),
        // 👇 CLAVE: Este módulo INTERCEPTA todas las peticiones HTTP
        // para que NO salgan a internet. Nos da control total.
        provideHttpClientTesting() 
      ]
    });
    
    // Inyectamos las instancias para poder usarlas en las pruebas
    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  3. AFTER EACH: Se ejecuta DESPUÉS de cada 'it'.           ║
  // ║  Limpiamos la casa — verificamos que no quedaron            ║
  // ║  peticiones HTTP "fantasma" en el limbo.                    ║
  // ╚══════════════════════════════════════════════════════════════╝
  afterEach(() => {
    httpMock.verify();
  });

  // ─── PRIMERA PRUEBA ───────────────────────────────────────────
  // 'it' define UNA prueba individual.
  // La descripción debe leerse como una oración: "debería..."
  it('debería ser creado correctamente', () => {
    // ASSERT: ¿La variable 'service' tiene un valor válido?
    // Si Angular no pudo crear el servicio (ej. falta un import),
    // esto fallaría inmediatamente.
    expect(service).toBeTruthy(); 
  });

  // ─── SEGUNDA PRUEBA ──────────────────────────────────────────
  it('debería buscar películas y devolver datos de la API simulada', () => {
    // ┌─ 1. ARRANGE (Preparar) ─────────────────────────────────┐
    // │ Creamos datos FALSOS ("Mocks") con la misma estructura  │
    // │ que devolvería la API real de TMDB.                      │
    // └─────────────────────────────────────────────────────────────┘
    const mockResponse = { results: [{ id: 1, title: 'Inception' }] };
    const searchTerm = 'Inception';

    // ┌─ 2. ACT (Actuar) ───────────────────────────────────────┐
    // │ Llamamos al método real de nuestro servicio.             │
    // │ (Cambia 'searchMovies' por el nombre real en tu servicio)│
    // └─────────────────────────────────────────────────────────────┘
    service.searchMovies(searchTerm).subscribe(response => {
      
      // ┌─ 3. ASSERT (Comprobar) ─────────────────────────────────┐
      // │ Verificamos que lo que devolvió el servicio sea         │
      // │ EXACTAMENTE igual a nuestro mock.                      │
      // └─────────────────────────────────────────────────────────────┘
      expect(response.results.length).toBe(1);
      expect(response.results[0].title).toEqual('Inception');
    });

    // ╔══════════════════════════════════════════════════════════════╗
    // ║  MAGIA DEL HTTP MOCK                                       ║
    // ║  Le decimos a Angular: "Espero que el servicio haya        ║
    // ║  intentado llamar a ESTA URL exacta".                      ║
    // ║  Si el servicio llamó a otra URL, la prueba FALLA.         ║
    // ╚══════════════════════════════════════════════════════════════╝
    const req = httpMock.expectOne(
      `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&language=es-ES`
    );
    
    // Verificamos que fue una petición GET (no POST, PUT, etc.)
    expect(req.request.method).toBe('GET');
    
    // Simulamos que TMDB respondió exitosamente con nuestro mockResponse.
    // Esto es lo que DETONA que el 'subscribe' de arriba se ejecute.
    // Sin esta línea, el subscribe nunca recibiría datos.
    req.flush(mockResponse); 
  });
});
```

### ¿Qué se tiene en cuenta al probar este servicio?

*   **Aislamiento (Isolation):** Fíjate que **no** hicimos una petición real a TMDB. Si no tuviéramos internet, si TMDB estuviera caído, o si la API cambiara sus precios — la prueba seguiría pasando (en verde). Eso es vital: la prueba evalúa **TU lógica**, no el estado del mundo exterior.

*   **Mocks/Stubs:** `mockResponse` es un "Mock" — un objeto falso que se hace pasar por la respuesta de la API. ¿Por qué no usar la API real? Porque las pruebas deben ser: (1) rápidas (no esperar a un servidor), (2) deterministas (siempre el mismo resultado), y (3) independientes (no depender de internet).

*   **Asincronía controlada:** Al usar `HttpTestingController` (`httpMock`), controlamos exactamente **en qué momento** el servidor "responde" usando `req.flush()`. Esto elimina toda la incertidumbre del networking.

*   **`httpMock.verify()`:** Esta línea en `afterEach` es un guardia de seguridad. Verifica que no quedaron peticiones HTTP "pendientes" que nunca recibieron respuesta. Si tu servicio hace una llamada HTTP que no esperabas, la prueba falla — y eso te alerta de un posible bug.

---

### Paso 12: Ejecutar las pruebas

Abre tu terminal y ejecuta:

```bash
ng test
```

**¿Qué pasa cuando ejecutas esto?**

1. Angular compila todo tu código en "modo prueba".
2. Busca todos los archivos que terminan en `.spec.ts`.
3. Ejecuta todos los bloques `describe` e `it` que encuentre.
4. Si un solo `expect` falla (por ejemplo, esperabas 1 película y llegaron 0), toda la prueba se marca en **rojo**.
5. Verás en la consola un mensaje indicando cuántas pruebas pasaron y cuántas fallaron.

**🧪 Ejercicio:** Intenta cambiar `expect(response.results.length).toBe(1);` a `toBe(2)` y ejecuta `ng test` de nuevo. Verás cómo la prueba falla a propósito — el mensaje de error te dirá *"Expected 1 to be 2"*. ¡Así es como el "robot" te avisa cuando algo no cuadra!

---

## 🚀 Paso Final: Desplegar y probar en un celular real

### Subir los cambios a GitHub

Ahora que todo está configurado, sube los cambios:

```bash
git add .
git commit -m "feat: setup PWA y pruebas unitarias base"
git push origin main
```

Vercel detectará el cambio y reconstruirá tu aplicación automáticamente. Espera **2-3 minutos** y verifica en tu panel de Vercel (vercel.com/dashboard) que el deployment esté en verde (**Ready**).

> **⚠️ Si ves el deploy en ROJO (Error):** Revisa que hayas creado el archivo `.npmrc` con `legacy-peer-deps=true`. Sin él, Vercel no puede instalar las dependencias correctamente.

### Cómo instalar MovieNexus en tu celular

#### 📱 En Android (Chrome):

1. Abre **Google Chrome** en tu celular Android.
2. Entra a la URL de tu proyecto: `tu-proyecto.vercel.app`.
3. Espera a que cargue completamente.
4. Debería aparecer un **banner inferior** que dice *"Añadir MovieNexus a la pantalla de inicio"*. ¡Tócalo!
5. Si no aparece el banner automático, toca los **tres puntitos (⋮)** arriba a la derecha y busca **"Instalar aplicación"** o **"Añadir a pantalla de inicio"**.
6. Confirma la instalación.
7. ¡Listo! Verás el icono de MovieNexus en tu pantalla de inicio.

#### 🍎 En iPhone/iPad (Safari):

1. Abre **Safari** (⚠️ DEBE ser Safari, no Chrome — en iOS solo Safari soporta PWA).
2. Entra a la URL de tu proyecto: `tu-proyecto.vercel.app`.
3. Toca el botón de **Compartir** (el cuadrado con la flechita ↑ hacia arriba, abajo en la barra de Safari).
4. Desliza las opciones hacia arriba y busca **"Añadir a pantalla de inicio"**.
5. Pon el nombre que quieras (o deja "MovieNexus") y toca **"Añadir"**.
6. ¡Listo! El icono aparecerá en tu pantalla de inicio.

#### 💻 En computadora (Chrome):

1. Abre Chrome y ve a tu URL de Vercel.
2. Busca en la barra de direcciones un **icono de una pantallita con una flecha** (📥), ubicado al lado de la estrellita de favoritos.
3. Haz clic y confirma "Instalar".
4. La app se abrirá en su propia ventana, sin barras del navegador.

### ¿Qué deberías ver al instalarla?

Al abrir MovieNexus desde el icono instalado:
- ✅ Se abre **sin barras del navegador** (como app nativa).
- ✅ La barra superior del celular toma el **color oscuro** (#111827) de tu tema.
- ✅ Todas las funciones (buscar, favoritos, ver detalles) funcionan igual.
- ✅ La app carga más rápido que desde el navegador (gracias al Service Worker y el caché).

---

## 🎉 ¡Felicidades! 🎉

Has completado no solo una aplicación funcional, sino una aplicación con:

- ✅ **Diseño profesional** con estilos avanzados y animaciones
- ✅ **Consumo de APIs** reales (TMDB)
- ✅ **Manejo de estados** vacíos, errores y carga
- ✅ **Rutas y navegación** con lazy loading
- ✅ **Interceptores HTTP** para API keys y manejo de errores
- ✅ **Pruebas unitarias** automatizadas
- ✅ **PWA instalable** en celulares y computadoras
- ✅ **Desplegada en producción** en Vercel

¡Eres oficialmente un desarrollador Angular listo para afrontar retos en el mundo laboral! 🚀
