# Instrucciones Globales de GitHub Copilot — DevCycle

Archivo de instrucciones principales del monorepo (`apps/backend`, `apps/frontend` y `packages/shared`). GitHub Copilot carga este archivo automáticamente al iniciar cualquier sesión de trabajo en el repositorio.

## 1. Contexto General y Comandos Clave
<!-- Describe aquí el propósito general del monorepo y los comandos principales (build, lint, dev, tests). -->

- **Instalación**: `pnpm install`
- **Desarrollo Backend (`apps/backend`)**: `pnpm dev:backend`
- **Desarrollo Frontend (`apps/frontend`)**: `pnpm dev:frontend`
- **Build global**: `pnpm build`
- **Lint global**: `pnpm lint`

## 2. Reglas Generales y por Módulo
<!-- Define aquí las reglas obligatorias que el agente debe respetar antes de modificar código. -->

### Backend (`apps/backend`)
- <!-- Agrega aquí convenciones de NestJS, arquitectura, endpoints y manejo de datos. -->

### Frontend (`apps/frontend`)
- **Cumplimiento obligatorio de lineamientos**: Cada nueva feature, componente o ajuste en el frontend **DEBE tener en cuenta y respetar SIEMPRE** el documento `docs/LINEAMIENTOS_DESARROLLO_FRONTEND.md`.
- **Estilos y Sistema de Diseño**: Usar exclusivamente Tailwind CSS v4 con variables registradas en `@theme inline` dentro de `apps/frontend/src/app/globals.css` y seguir `docs/GUIA_ESTILOS_SISTEMA_DISENO.md`. Prohibido escribir CSS puro o estilos inline estáticos.
- **Flujo de Ramas**: Cada nueva feature debe trabajarse siempre en una nueva rama `feature/nombre-feature` creada a partir de la rama `main` actualizada.

### Paquete Compartido (`packages/shared`)
- <!-- Agrega aquí reglas sobre tipos, contratos y datos compartidos entre front y back. -->

## 3. Mapa de Documentación y Referencias
<!-- Indica qué documentos debe consultar el agente según el tipo de tarea. -->

- `docs/LINEAMIENTOS_DESARROLLO_FRONTEND.md`: **Documento obligatorio SIEMPRE** para cualquier desarrollo o nueva feature en `apps/frontend` (arquitectura, stack, estructura de carpetas, reglas de código, seguridad, DoD y flujo de Git).
- `MEMORY.md`: Decisiones de arquitectura y reglas de estilizado con Tailwind CSS v4.
- `docs/GUIA_ESTILOS_SISTEMA_DISENO.md`: Guía oficial del sistema de diseño, paleta de colores y medidas.
- `docs/ARQUITECTURA_DEVCYCLE.md` y `docs/ARQUITECTURA_ALTO_NIVEL.md`: Contexto de arquitectura del sistema.
- `docs/FLUJOS_FRONTEND_DEVCYCLE.md`: Especificación funcional de los flujos de usuario en el frontend.
