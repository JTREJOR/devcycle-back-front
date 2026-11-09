# AGENTS.md — Lineamientos para Agentes de IA (Raíz del Monorepo)

Archivo estándar de entrada en la raíz del repositorio para agentes de IA. Aplica de forma global a todo el monorepo (`apps/backend`, `apps/frontend` y `packages/shared`).

## Instrucciones Principales
Para evitar duplicidad, las reglas detalladas de desarrollo, arquitectura y referencias de todo el proyecto se centralizan en:

- **`.github/copilot-instructions.md`**: Instrucciones globales para Backend, Frontend y paquete compartido.
- **`MEMORY.md`**: Memoria persistente de decisiones técnicas y de estilos del proyecto.
- **`docs/`**: Documentación técnica de arquitectura, flujos y sistema de diseño.

## Notas Adicionales para Agentes
- **REGLA OBLIGATORIA PARA FRONTEND (`apps/frontend`)**: Cada nueva feature, componente o cambio en el frontend **DEBE tener en cuenta y respetar SIEMPRE** el documento **`docs/LINEAMIENTOS_DESARROLLO_FRONTEND.md`** junto con **`docs/GUIA_ESTILOS_SISTEMA_DISENO.md`**.
- **REGLA OBLIGATORIA PARA BACKEND (`apps/backend`)**: Cada nueva feature, módulo, endpoint o microservicio en el backend **DEBE tener en cuenta y respetar SIEMPRE** el documento **`docs/LINEAMIENTOS_DESARROLLO_BACKEND.md`**.
- **Flujo Oficial de Ramas (`pro` ➔ `feature` ➔ `dev` ➔ `qas` ➔ `pro`)**:
  1. Toda nueva feature debe trabajarse en una rama `feature/nombre-feature` (que nace siempre de `pro`) o en una rama con las iniciales/username de Liverpool del desarrollador (ej. `jetr` o `jetrejor`, previamente emparejada con `pro` sin conflictos).
  2. Al terminar una feature, el merge es **únicamente hacia `dev`** (nunca directo a `qas` ni a `pro`). Si es una rama `feature/nombre-feature`, se elimina tras integrarse en `dev`.
  3. La promoción hacia producción sigue sin excepción el flujo **`dev` ➔ `qas` ➔ `pro`** (`qas` solo recibe merges desde `dev`, y `pro` solo recibe merges desde `qas`).
  4. Los mensajes de commit se mantienen en inglés bajo Conventional Commits.
