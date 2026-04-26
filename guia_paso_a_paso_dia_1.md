# Guía Paso a Paso: Día 1 - MovieNexus 🎬

Bienvenido al primer día de desarrollo de **MovieNexus**. Hoy sentaremos las bases de una aplicación profesional con Angular y SSR.

---
 
> [!IMPORTANT]
> **Estructura del Proyecto:** Todo el código de Angular reside en la carpeta `frontend/`. Asegúrate de navegar a ella con `cd frontend` antes de ejecutar cualquier comando de terminal.

## 🚀 Paso 1: Creación del Proyecto con SSR
Ejecuta el siguiente comando:
```bash
ng new MovieNexus --style css --routing true --standalone true --ssr true
```

---

## 📂 Paso 2: Arquitectura Profesional (El Secreto del Éxito)
Para trabajar como en el mundo real, dividiremos nuestra app en tres pilares:

### 1. Carpeta `core/` (Lógica Central)
Es el "cerebro" de la app. Aquí van cosas que se cargan una sola vez.
*   `services/`: Para hablar con la API de TMDB.
*   `interceptors/`: Para añadir seguridad a las peticiones.
*   `models/`: Las "plantillas" de nuestros datos (Interfaces).

### 2. Carpeta `shared/` (Componentes "Bobos")
Aquí van los componentes reutilizables. Se les llama "bobos" porque no tienen lógica de negocio; solo reciben datos y los muestran de forma bonita (ej: un botón, un spinner, una tarjeta).

### 3. Carpeta `features/` (Componentes "Inteligentes")
Representan las **páginas** de la app (Home, Detalles, Buscador). Son "inteligentes" porque ellos deciden qué datos mostrar, llaman a los servicios y orquestan a los componentes bobos de la carpeta `shared`.

> [!IMPORTANT]
> **Regla de Oro:** Si un componente se usa en muchas páginas, va a `shared`. Si representa una página completa o una funcionalidad única, va a `features`.

---

## 🎨 Paso 3: Sistema de Diseño (styles.css)
Usaremos **Variables CSS** para que el diseño sea "Premium" y fácil de cambiar:

```css
:root {
  --bg-color: #0f172a;    /* Fondo oscuro */
  --primary: #38bdf8;     /* Azul principal */
  --accent: #f43f5e;      /* Color de destaque */
  --text-main: #f8fafc;   /* Texto principal */
  --radius: 12px;         /* Bordes redondeados */
}
```

**Ejemplo de uso:**
```css
.mi-boton { background-color: var(--primary); border-radius: var(--radius); }
```

---

## 🔑 Paso 4: Conexión con el Mundo Exterior (API Keys)

Para que nuestra app muestre películas reales, necesitamos conectarnos a un servidor externo. Usaremos **The Movie Database (TMDB)**.

### ¿Qué es una API Key?
Imagina que la base de datos de películas es un **club privado**. La **API Key** es tu **carnet de identidad** o pasaporte digital.
*   **Identificación:** El servidor sabe quién pide la información.
*   **Seguridad:** Evita que personas malintencionadas saturen el sistema.
*   **Límites:** Como es gratuito, nos permiten un número generoso de consultas diarias.

### ¿De dónde salen las URLs?
*   `https://api.themoviedb.org/3`: Es la "oficina central" de datos.
*   `https://image.tmdb.org/t/p`: Es el servidor dedicado exclusivamente a los posters.

### 🛠️ Configuración de Entorno
Crea el archivo `src/environments/environment.ts` y pega lo siguiente:

```typescript
export const environment = {
  production: false,
  baseUrl: 'https://api.themoviedb.org/3',
  apiKey: 'TU_API_KEY_AQUI', // Consíguela en themoviedb.org
  imgPath: 'https://image.tmdb.org/t/p'
};
```

> [!TIP]
> **Para obtener tu llave:** Regístrate en [themoviedb.org](https://www.themoviedb.org/), ve a tu Perfil -> Ajustes -> API y solicita una clave de tipo "Developer".

---

## 🏠 Paso 5: Creación de la Primera Feature
1.  Genera el componente: `ng generate component features/home`.
2.  Configura la ruta en `app.routes.ts`:
    ```typescript
    {
      path: '',
      loadComponent: () => import('./features/home/home').then(m => m.HomeComponent)
    }
    ```

---

## ✅ Reto del Día
Verifica que al ejecutar `npm start` se vea tu diseño con el tema oscuro y que la estructura de carpetas tenga sus archivos `.gitkeep` para que Git no las ignore.

> [!TIP]
> **Nota sobre `.gitkeep`:** Es un archivo vacío que usamos para que Git "respete" nuestras carpetas vacías y no las borre.
