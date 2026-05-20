# Guía Pedagógica: Día 11 - Deferrable Views (Carga Diferida) ⏳

Hoy aprenderemos sobre una de las características más potentes de Angular para mejorar el rendimiento: los **Deferrable Views** (`@defer`). Esto nos permite retrasar la carga de ciertos componentes pesados (como reproductores de video o secciones de comentarios) hasta que sean estrictamente necesarios, mejorando nuestras métricas de *Web Vitals*.

---

## 🧠 Contexto Pedagógico: ¿Por qué diferir la carga?

En la página de detalles de una película, podríamos tener información crítica (título, sinopsis) y otra secundaria (el tráiler, lista de actores secundarios, o comentarios).
*   **El problema:** Si cargamos todo de inmediato, el tiempo de carga inicial (*First Contentful Paint*) y el peso del paquete principal de JavaScript se incrementan, penalizando la experiencia del usuario y el SEO.
*   **La solución (`@defer`):** Angular nos permite indicar de manera declarativa en el HTML qué partes deben cargarse "más tarde" (por ejemplo, cuando el usuario hace scroll hacia ellas). Angular se encarga del *Lazy Loading* automático de esos componentes.

---

## 📡 Paso 1: Identificando los Bloques Pesados

Imaginemos que en nuestro componente de detalle (`src/app/features/movie-detail/movie-detail.component.ts`), tenemos un componente pesado para el tráiler o el elenco completo.
Por ahora, asumamos que tenemos un componente hipotético `<app-movie-trailer>` o `<app-movie-cast>` que queremos diferir.

Abre `src/app/features/movie-detail/movie-detail.component.html`:

```html
<!-- Carga Inmediata: Lo más importante (Above the fold) -->
<section class="hero-detail">
  <h1>{{ movie().title }}</h1>
  <p>{{ movie().overview }}</p>
</section>

<!-- Carga Diferida: El Tráiler -->
<section class="trailer-section">
  <h2>Tráiler Oficial</h2>
  
  @defer (on viewport) {
    <!-- Este componente (y su código JavaScript) solo se descarga cuando esta área entra en la pantalla -->
    <app-movie-trailer [movieId]="movie().id"></app-movie-trailer>
  } @placeholder (minimum 500ms) {
    <!-- Lo que se muestra ANTES de que se cumpla la condición o mientras se descarga -->
    <div class="trailer-placeholder">
      <p>Haz scroll para ver el tráiler...</p>
    </div>
  } @loading {
    <!-- Lo que se muestra DURANTE la descarga de red del componente -->
    <div class="spinner">Cargando reproductor...</div>
  } @error {
    <!-- Si la red falla al intentar descargar el componente -->
    <p>Error al cargar el reproductor de video.</p>
  }
</section>
```

---

## 🧩 Paso 2: Entendiendo los Triggers (Desencadenadores)

El bloque `@defer` admite varias condiciones (triggers) para iniciar la descarga y el renderizado. Hemos usado `on viewport`, pero existen muchos otros:

1.  **`on viewport`**: Cuando el elemento entra en la pantalla (usa un *Intersection Observer* nativo por detrás).
2.  **`on interaction`**: Cuando el usuario interactúa (hace clic, toca) el área del placeholder.
3.  **`on hover`**: Cuando el cursor pasa por encima del área.
4.  **`on timer(5s)`**: Carga automática después de un tiempo definido (ej. 5 segundos).
5.  **`when condicionBoolean`**: Carga imperativa basada en una señal o variable booleana de tu TypeScript.

### Ejemplo Combinado (Interacción o Hover)

Puedes combinar varios triggers. Por ejemplo, para cargar el elenco de actores:

```html
<section class="cast-section">
  <h2>Elenco Principal</h2>

  @defer (on interaction; on hover) {
    <app-movie-cast [cast]="movieCast()"></app-movie-cast>
  } @placeholder {
    <button class="btn-load">Mostrar Elenco Completo</button>
  }
</section>
```

---

## 🎨 Paso 3: Optimizando los Bloques Secundarios (CSS)

Añadir placeholders visualmente estables mejora la UX y evita el salto de contenido (*Layout Shift*).
Añade estos estilos en `movie-detail.component.css`:

```css
.trailer-placeholder {
  height: 400px;
  background-color: var(--color-surface-variant, #2a2a2a);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 1px dashed var(--color-text-secondary, #888);
  color: var(--color-text-secondary, #888);
}

.spinner {
  display: flex;
  justify-content: center;
  padding: 2rem;
  color: var(--color-primary, #e50914);
  font-weight: bold;
}
```

---

## ✅ Prueba de Aprendizaje (Checklist)

1.  **¿Cuál es la diferencia principal entre `@defer` y usar un `@if` estándar para ocultar contenido?**
    *(Respuesta: `@if` decide si el componente se renderiza o no en el DOM, pero el código fuente JavaScript del componente ya fue descargado en el bundle principal. `@defer` hace "Lazy Loading" a nivel de componente: el navegador ni siquiera descarga el JavaScript de esa parte hasta que se cumpla la condición, haciendo la carga inicial más rápida).*
2.  **¿Para qué sirve el bloque `@placeholder`?**
    *(Respuesta: Muestra un contenido temporal que reserva el espacio en el DOM mientras se espera que se cumpla el trigger (ej. hacer scroll). Es vital para evitar "saltos" en la interfaz o Layout Shifts).*
3.  **¿Qué ocurre internamente si especificas `(on viewport)`?**
    *(Respuesta: Angular utiliza la API de Intersection Observer del navegador para detectar cuándo el placeholder se vuelve visible en la pantalla y, en ese preciso momento, inicia la descarga del componente).*

---

## 💾 Control de Versiones
Finaliza el día guardando tu progreso:
```bash
git add .
git commit -m "feat: implementar carga diferida (@defer) en la vista de detalles para optimizar rendimiento"
git push origin main
```
