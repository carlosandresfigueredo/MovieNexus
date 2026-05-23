# Guía Pedagógica: Día 14 - Robustez, Empty States y Manejo de Errores 🛡️

Ya tenemos una aplicación casi completa, con animaciones fluidas, consumo de APIs, estados de carga elegantes (skeletons) y persistencia de datos. Pero, ¿qué pasa cuando algo sale mal? ¿O cuando una búsqueda no retorna resultados? ¿O cuando el usuario navega a una ruta que no existe?

Hoy nos enfocaremos en la **Experiencia de Usuario (UX) en los casos límite (Edge Cases)**. Construiremos componentes de "Empty State" y manejaremos los errores de forma global para que la app no colapse silenciosamente.

---

## 🧠 Contexto Pedagógico: ¿Por qué son importantes los Empty States y el manejo de Errores?

Un buen desarrollador se destaca no solo cuando la app funciona perfecto (el *Happy Path*), sino cuando previene la frustración del usuario si algo falla.
*   **Empty States (Estados Vacíos):** Cuando una lista no tiene elementos (ej. Favoritos vacío), mostrar una pantalla en blanco parece un error. Debemos indicar claramente qué pasa y dar una "Llamada a la Acción" (Call to Action).
*   **Manejo Global de Errores (Interceptors):** Las peticiones HTTP pueden fallar (se cae el servidor, el usuario pierde internet). Atrapar los errores globalmente nos permite mostrar alertas o mensajes amigables.
*   **Páginas 404 (Not Found):** Redirigir a un usuario que ingresó mal una URL evita que se quede viendo una pantalla rota.

---

## 🎨 Paso 1: Crear un Componente Reutilizable "EmptyState"

Vamos a abstraer la lógica de "mostrar un mensaje con un ícono" en un componente genérico. Así podremos usarlo en la búsqueda, en favoritos o en cualquier lista vacía.

1. Genera un nuevo componente dentro de `shared/components`:
   ```bash
   ng g c shared/components/empty-state --standalone
   ```

2. Configura los `@Input` en `empty-state.ts` para que sea dinámico:
   *(Este archivo ya ha sido creado en tu proyecto. Si lo revisas verás atributos dinámicos como `icon`, `title`, `message`)*.

3. En el HTML `empty-state.html`, renderiza estos inputs y opcionalmente añade un botón. ¡Revisa el archivo y su CSS en el código!

### Refactorización en Favoritos
Ya no usaremos HTML puro en `favorites.html` para el mensaje de vacío. Ahora importamos y usamos `<app-empty-state>`. Revisa cómo quedó el archivo `favorites.html` para entender cómo se aplica.

---

## 🚨 Paso 2: Crear un Interceptor Global de Errores (HttpErrorInterceptor)

Vamos a interceptar TODAS las respuestas de la API antes de que lleguen a los componentes. Si detectamos un error, lo logueamos o preparamos un mensaje, y luego se lo devolvemos al componente (o mostramos una notificación global).

1. Creamos el archivo `core/interceptors/error.interceptor.ts`. 
2. Dentro, usamos `catchError` de RxJS:

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado.';
      // Analizamos si es error de red (cliente) o de servidor (404, 500, 401)
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error de red: ${error.error.message}`;
      } else {
        // ... switch(error.status) ...
      }
      console.error('Error Interceptado:', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
```

3. **¡Muy Importante!** Para que el interceptor funcione, debemos registrarlo en `app.config.ts`:

```typescript
provideHttpClient(
  withFetch(),
  withInterceptors([apiInterceptor, errorInterceptor]) // ¡Añadido aquí!
)
```

---

## 🛸 Paso 3: Crear la página 404 (Not Found)

Cuando el usuario escriba en la URL `http://localhost:4200/rutafalsa123`, queremos que vea un mensaje amigable y no una consola llena de errores.

1. Crea el componente: `ng g c features/not-found --standalone`
2. En `not-found.html`, podemos re-aprovechar nuestro componente genérico `EmptyState`:

```html
<app-empty-state 
  icon="🛸"
  title="Error 404: Dimensión Desconocida"
  message="La página que buscas parece haber sido abducida."
  actionText="Volver al Inicio"
  actionLink="/">
</app-empty-state>
```

3. **Configurar el Router:** Abre `app.routes.ts` y añade la ruta comodín o *wildcard* (`**`). Esta ruta **SIEMPRE DEBE IR AL FINAL** del arreglo de rutas. Atrapa cualquier URL que no haya hecho "match" con las de arriba.

```typescript
export const routes: Routes = [
  // ... rutas anteriores (home, movie, favorites)
  {
    path: '**', // Atrapa TODO lo que no exista
    loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound)
  }
];
```

---

## 🎯 Paso 4: ¡Pruébalo en Vivo!

1. Inicia tu aplicación (`npm start`).
2. Ve a la sección de **Favoritos**. Si no tienes películas guardadas, verás nuestro nuevo y elegante `EmptyStateComponent`.
3. En la barra de direcciones de tu navegador, escribe una URL falsa: `http://localhost:4200/esta-pagina-no-existe`. ¡Aparecerá el Error 404 con nuestro alien! 🛸
4. Apaga temporalmente tu conexión a internet e intenta recargar la página; observa la consola del navegador para ver nuestro Error Interceptor en acción.

---

## ✅ Prueba de Aprendizaje (Checklist)

1.  **¿Por qué la ruta comodín (`**`) debe ir al final del arreglo en `app.routes.ts`?**
    *(Respuesta: Porque el router evalúa las rutas de arriba hacia abajo. Si pones `**` de primero, atrapará TODAS las rutas, incluyendo el home, y todo mostrará 404).*
2.  **¿Para qué sirve `catchError` en el Interceptor?**
    *(Respuesta: Atrapa el error que devuelve el servidor (ej: 401 No Autorizado) para que podamos manipularlo, procesarlo o registrarlo antes de que nuestra app colapse).*
3.  **¿Cuál es el beneficio de abstraer el `<app-empty-state>`?**
    *(Respuesta: Mantenemos el principio DRY (Don't Repeat Yourself). Un solo componente se encarga de los estilos y diseño, y lo alimentamos con `@Input` diferentes en Búsqueda, Favoritos o Errores).*

---

## 💾 Control de Versiones

¡Nuestra app ya es mucho más robusta y "a prueba de balas"! Guarda tu progreso:

```bash
git add .
git commit -m "feat: manejar estados vacios y errores HTTP de forma global"
git push origin main
```

¡Excelente trabajo! Mañana será el **Día 15**, donde daremos el pulido final y aprenderemos sobre cómo hacer el Deploy para que el mundo pueda ver nuestro trabajo.
