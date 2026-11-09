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
- **Cumplimiento obligatorio de lineamientos**: Cada nueva feature, módulo, endpoint o microservicio en el backend **DEBE tener en cuenta y respetar SIEMPRE** el documento `docs/LINEAMIENTOS_DESARROLLO_BACKEND.md` (arquitectura de 4 microservicios en Cloud Run, PostgreSQL en Cloud SQL con Prisma ORM, Pub/Sub y TypeScript estricto con cero uso de `any`).

### Frontend (`apps/frontend`)
- **Cumplimiento obligatorio de lineamientos**: Cada nueva feature, componente o ajuste en el frontend **DEBE tener en cuenta y respetar SIEMPRE** el documento `docs/LINEAMIENTOS_DESARROLLO_FRONTEND.md`.
- **Estilos y Sistema de Diseño**: Usar exclusivamente Tailwind CSS v4 con variables registradas en `@theme inline` dentro de `apps/frontend/src/app/globals.css` y seguir `docs/GUIA_ESTILOS_SISTEMA_DISENO.md`. Prohibido escribir CSS puro o estilos inline estáticos.

### Flujo Oficial de Ramas y Commits (Git)
1. **Rama de trabajo**: Toda nueva feature debe trabajarse en una rama `feature/nombre-feature` o en una rama que comience con las iniciales del desarrollador o username de Liverpool (ej. `jetr` o `jetrejor`).
2. **Origen desde `pro`**: Cada nueva rama `feature/nombre-feature` debe nacer de `pro`. Si se usa una rama con iniciales/username de desarrollador, antes de iniciar debe emparejarse con `pro` (sin conflictos y desplegable).
3. **Merge exclusivo hacia `dev`**: Al terminar una feature, el merge se realiza **únicamente hacia `dev`**. Ninguna rama `feature/*` o de desarrollador puede mergearse directamente a `qas` o `pro`.
4. **Limpieza**: Tras integrar una rama `feature/nombre-feature` en `dev`, se debe eliminar dicha rama `feature/nombre-feature`.
5. **Promoción estricta (`dev` ➔ `qas` ➔ `pro`)**: `qas` solo recibe merges desde `dev`, y `pro` solo recibe merges desde `qas`, sin ninguna excepción.
6. **Commits**: Los mensajes de commit se escriben en inglés bajo Conventional Commits.

### Paquete Compartido (`packages/shared`)
- <!-- Agrega aquí reglas sobre tipos, contratos y datos compartidos entre front y back. -->

## 3. Mapa de Documentación y Referencias
<!-- Indica qué documentos debe consultar el agente según el tipo de tarea. -->

- `docs/LINEAMIENTOS_DESARROLLO_FRONTEND.md`: **Documento obligatorio SIEMPRE** para cualquier desarrollo o nueva feature en `apps/frontend` (arquitectura, stack, estructura de carpetas, reglas de código, seguridad, DoD y flujo de Git).
- `docs/LINEAMIENTOS_DESARROLLO_BACKEND.md`: **Documento obligatorio SIEMPRE** para cualquier desarrollo o nueva feature en el backend (catálogo de 4 microservicios, comunicación, PostgreSQL, reglas de NestJS/TypeScript sin `any`, DoD y flujo de Git).
- `MEMORY.md`: Decisiones de arquitectura y reglas de estilizado con Tailwind CSS v4.
- `docs/GUIA_ESTILOS_SISTEMA_DISENO.md`: Guía oficial del sistema de diseño, paleta de colores y medidas.
- `docs/ARQUITECTURA_DEVCYCLE.md` y `docs/ARQUITECTURA_ALTO_NIVEL.md`: Contexto de arquitectura del sistema.
- `docs/FLUJOS_FRONTEND_DEVCYCLE.md`: Especificación funcional de los flujos de usuario en el frontend.
