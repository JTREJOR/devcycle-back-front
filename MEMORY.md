# Memoria de Decisiones de Arquitectura y Estilos — DevCycle Frontend

Este documento funciona como memoria persistente para agentes y desarrolladores sobre las reglas y decisiones técnicas de estilizado en `apps/frontend`.

## 1. Uso obligatorio de Tailwind CSS v4 (Cero CSS puro ni estilos inline)
- **Todo el estilizado de componentes y vistas debe realizarse con clases utilitarias de Tailwind CSS v4**, incluyendo estados (`hover:`, `focus:`, `active:`, `disabled:`) y diseño responsivo mediante los breakpoints nativos de Tailwind (`sm:`, `md:`, `lg:`, `xl:`).
- **No se deben crear clases de CSS puro** (como `.mi-componente__card`) ni usar `style={{ ... }}` en línea para maquetación o colores estáticos.

## 2. Variables Globales en `globals.css` + `@theme inline`
- El archivo `apps/frontend/src/app/globals.css` se mantiene **únicamente** para:
  1. Importar Tailwind (`@import "tailwindcss";`) y tokens base (`@import "@vibe/core/tokens";`).
  2. Definir las variables globales de colores, tipografía y dimensiones en `:root` (p. ej. `--color-warning-500`, `--brand-primary`, `--status-green-bg`, etc.).
  3. Exponer dichas variables a Tailwind mediante el bloque **`@theme inline`**.
- **Regla de mapeo y consumo**:
  - Si en `:root` / `@theme inline` se define `--color-warning-500`, en los componentes y páginas debe consumirse directamente con las utilidades generadas por Tailwind:
    - Texto: `text-warning-500`
    - Fondo: `bg-warning-500`
    - Borde: `border-warning-500`
  - Del mismo modo, variables de marca y estado registradas en `@theme inline` (`--color-brand-primary`, `--color-brand-accent`, `--color-text-main`, `--color-text-secondary`, `--color-border-default`, `--color-status-green-bg`, etc.) se usan como `bg-brand-primary`, `text-brand-primary`, `border-border-default`, `bg-status-green-bg`, `text-status-green-text`, etc.

## 3. Plan de Migración por Fases
- **Fase 1 (En curso / Completada)**: Migración de todos los componentes en `apps/frontend/src/components/*` a Tailwind CSS v4.
- **Fase 2 (Pendiente de VoBo del usuario)**: Migración de todas las páginas en `apps/frontend/src/app/**` y limpieza final de las clases legacy restantes en `globals.css`.
