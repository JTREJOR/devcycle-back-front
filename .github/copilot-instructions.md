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
- <!-- Agrega aquí convenciones de Next.js, componentes y estilos (Tailwind CSS v4). -->

### Paquete Compartido (`packages/shared`)
- <!-- Agrega aquí reglas sobre tipos, contratos y datos compartidos entre front y back. -->

## 3. Mapa de Documentación y Referencias
<!-- Indica qué documentos debe consultar el agente según el tipo de tarea. -->

- `MEMORY.md`: Decisiones de arquitectura y reglas de estilizado con Tailwind CSS v4.
- `docs/GUIA_ESTILOS_SISTEMA_DISENO.md`: Guía oficial del sistema de diseño, paleta de colores y medidas.
- `docs/ARQUITECTURA_DEVCYCLE.md` y `docs/ARQUITECTURA_ALTO_NIVEL.md`: Contexto de arquitectura del sistema.
- `docs/FLUJOS_FRONTEND_DEVCYCLE.md`: Especificación funcional de los flujos de usuario en el frontend.
