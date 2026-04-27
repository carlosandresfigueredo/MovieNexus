# Guía Paso a Paso: Día 1 - MovieNexus 🎬

Bienvenido al primer día de desarrollo de **MovieNexus**. Hoy sentaremos las bases de una aplicación profesional con Angular y SSR.

---
 
> [!IMPORTANT]
> **Estructura del Proyecto:** Todo el código de Angular reside en la raíz del proyecto. Asegúrate de estar en `c:\Angular\MovieNexus` antes de ejecutar comandos.

## 🚀 Paso 1: Creación del Proyecto con SSR
Ejecuta el siguiente comando para iniciar el proyecto con soporte para servidor:
```bash
ng new MovieNexus --style css --routing true --standalone true --ssr true
```

---

## 📂 Paso 2: Arquitectura Profesional (Clean Architecture)
Para trabajar como en el mundo real, dividiremos nuestra app en pilares organizados:

### 1. Carpeta `core/` (Lógica Global)
El "cerebro" de la app. Contiene servicios globales, modelos e interceptores.
*   `services/`: Conexión con la API de TMDB.
*   `models/`: Interfaces de datos (ej: `Movie.ts`).

### 2. Carpeta `shared/` (Componentes Reutilizables)
Aquí viven los componentes que se usan en toda la app.
*   `components/layout/`: Aquí guardamos el **Header** y **Footer**, ya que definen el esqueleto de la web.

### 3. Carpeta `features/` (Páginas y Lógica de Negocio)
Representan las secciones de la app (Home, Detalles, Buscador). Son componentes "inteligentes" que gestionan datos.

---

## 🏗️ Paso 3: Convención de Nombres "Minimalista"
En proyectos modernos y profesionales, buscamos la máxima limpieza:
*   **Clases:** Usamos nombres directos como `Header`, `Footer` o `Home` (en lugar de `HeaderComponent`).
*   **Archivos:** Quitamos el `.component` del nombre. Ejemplo: `header.ts`, `header.html`, `header.css`.
*   **Selectores:** Usamos prefijos claros para componentes estructurales (ej: `app-header`).

---

## 🎨 Paso 4: Sistema de Diseño (styles.css)
Usamos **Variables CSS** para un diseño Premium y fácil de mantener:

```css
:root {
  --bg-color: #0f172a;    /* Fondo oscuro sleek */
  --primary: #38bdf8;     /* Azul vibrante */
  --accent: #f43f5e;      /* Acento rosa/rojo */
  --text-main: #f8fafc;   /* Texto claro */
  --radius: 12px;         /* Bordes redondeados modernos */
}
```

---

## 🔑 Paso 5: API Keys (TMDB)
Para mostrar películas reales, necesitamos una **API Key** de The Movie Database.
*   **Identificación:** Es tu "pasaporte" digital para que el servidor de TMDB te deje entrar.
*   **Configuración:** Se guarda en `src/environments/environment.ts`.

---

## 🏠 Paso 6: Tu primera Feature
Generamos la página de inicio y configuramos su ruta de carga perezosa (*Lazy Loading*):

```typescript
// app.routes.ts
{
  path: '',
  loadComponent: () => import('./features/home/home').then(m => m.Home)
}
```

---

## ✅ Reto del Día
1.  Verifica que el servidor corra con `npm start`.
2.  Asegúrate de que la carpeta `shared/components/layout` tenga tu Header y Footer.
3.  **Nota sobre `.gitkeep`:** Solo se usa en carpetas que están **vacías**. Si la carpeta ya tiene archivos, el `.gitkeep` se puede borrar para mantener el proyecto limpio.
