<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Reglas de Estilizado (Memoria del Proyecto)

1. **Tailwind CSS v4 obligatorio**: No escribir CSS puro ni estilos inline (`style={{ ... }}`) para diseño o colores. Usar utilidades de Tailwind CSS y sus breakpoints responsivos (`sm:`, `md:`, `lg:`, `xl:`).
2. **Variables en `globals.css` + `@theme inline`**:
   - Todas las variables de color y tema se declaran en `src/app/globals.css` y se registran dentro del bloque `@theme inline`.
   - Toda variable `--color-<nombre>` (por ejemplo `--color-warning-500` o `--color-brand-primary`) debe consumirse en JSX usando las clases nativas de Tailwind (`text-warning-500`, `bg-brand-primary`, `border-brand-primary`, etc.).
   - Ver `../../MEMORY.md` en la raíz del repositorio para el detalle completo de la arquitectura y fases de migración.

