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

## 3. Plan de Migración por Fases y Documentación Oficial
- **Fase 1 (Completada)**: Migración de todos los componentes en `apps/frontend/src/components/*` a Tailwind CSS v4.
- **Fase 2 (Completada)**: Migración de todas las páginas en `apps/frontend/src/app/**` (`page.tsx`, `layout.tsx`, `discovery/page.tsx`, `estimacion/page.tsx`, `iniciativas/page.tsx`, `iniciativas/evaluacion/page.tsx`, `iniciativas/confirmacion/page.tsx`, `project/[id]/page.tsx`, `team/page.tsx`, `en-construccion/page.tsx`, `not-found.tsx`) a Tailwind CSS v4 y limpieza total de las clases CSS legacy y variables no utilizadas en `globals.css`.
- **Guía Oficial de Estilos y Sistema de Diseño**: Ver `docs/GUIA_ESTILOS_SISTEMA_DISENO.md` para la especificación completa de paleta de colores Liverpool + Monday.com, colores por situación y estados de botones, medidas exactas de componentes (px), breakpoints responsivos y diccionario de variables de `globals.css`.

## 4. Cumplimiento Obligatorio de Lineamientos de Desarrollo Frontend
- **REGLA CRÍTICA (SIEMPRE OBLIGATORIA)**: Cada nueva feature, pantalla, componente o modificación para el frontend (`apps/frontend`) **DEBE tener en cuenta y cumplir SIEMPRE** el documento oficial **`docs/LINEAMIENTOS_DESARROLLO_FRONTEND.md`**.
- Antes de planificar o escribir código en el frontend, cualquier desarrollador o agente de IA debe consultar `docs/LINEAMIENTOS_DESARROLLO_FRONTEND.md` y `docs/GUIA_ESTILOS_SISTEMA_DISENO.md` para respetar:
  - El stack tecnológico oficial (Next.js 16 App Router, React 19, TypeScript estricto, Tailwind CSS v4 con `@theme inline`, `@vibe/core`, `@vibe/icons`, Zustand, TanStack React Query, Axios, React Hook Form, React Hot Toast y `@devcycle/shared`).
  - La estructura de carpetas y separación de responsabilidades (`src/app` ➔ `src/components` ➔ `src/lib/queries` / `src/store` ➔ `src/lib/apiClient`).
  - La regla de trabajo en Git: toda nueva feature debe trabajarse en una nueva rama `feature/nombre-feature` creada a partir de `pro` (o en una rama con iniciales/username del desarrollador como `jetr` o `jetrejor` previamente emparejada con `pro`), integrarse únicamente hacia `dev` (eliminando la rama `feature/nombre-feature` al terminar), promoverse estrictamente en orden `dev` ➔ `qas` ➔ `pro`, mantener commits en inglés bajo Conventional Commits y cumplir con la Definition of Done (DoD).
