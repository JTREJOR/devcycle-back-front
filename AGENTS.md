# AGENTS.md — Lineamientos para Agentes de IA (Raíz del Monorepo)

Archivo estándar de entrada en la raíz del repositorio para agentes de IA. Aplica de forma global a todo el monorepo (`apps/backend`, `apps/frontend` y `packages/shared`).

## Instrucciones Principales
Para evitar duplicidad, las reglas detalladas de desarrollo, arquitectura y referencias de todo el proyecto se centralizan en:

- **`.github/copilot-instructions.md`**: Instrucciones globales para Backend, Frontend y paquete compartido.
- **`MEMORY.md`**: Memoria persistente de decisiones técnicas y de estilos del proyecto.
- **`docs/`**: Documentación técnica de arquitectura, flujos y sistema de diseño.

## Notas Adicionales para Agentes
- **REGLA OBLIGATORIA PARA FRONTEND (`apps/frontend`)**: Cada nueva feature, componente o cambio en el frontend **DEBE tener en cuenta y respetar SIEMPRE** el documento **`docs/LINEAMIENTOS_DESARROLLO_FRONTEND.md`** junto con **`docs/GUIA_ESTILOS_SISTEMA_DISENO.md`**.
- Toda nueva feature debe trabajarse siempre en una rama `feature/nombre-feature` que nazca de la rama `main` actualizada.
