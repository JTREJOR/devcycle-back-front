# DevCycle — Portafolio de Proyectos (maquetado)

Aplicación custom embebida en Monday.com para el descubrimiento, gestión y ejecución del portafolio de proyectos. Esta primera entrega es un **maquetado navegable con datos dummy**: muestra las 6 etapas del ciclo de vida (una por cada flujo homologado "To Be" compartido), su subflujo de pasos con decisiones/aprobaciones, un módulo de Usuarios y Perfiles, y un asistente tipo copiloto — todo con datos de ejemplo y un backend mínimo en memoria.

## Estructura

```
apps/backend/    NestJS + TypeScript — API REST con datos mock en memoria
apps/frontend/   Next.js (App Router) + TypeScript — UI con Vibe Design System
packages/shared/ Tipos y datos dummy compartidos (etapas, roles, usuarios, proyectos)
```

Monorepo con **pnpm workspaces**. Cada app es independiente y pensada para desplegarse en su propio Cloud Run de GCP (ver `Dockerfile` en cada una).

## Cómo correrlo en local

```bash
corepack enable        # si pnpm no está activado en la máquina
pnpm install            # instala todo y compila packages/shared (postinstall)
```

En dos terminales:

```bash
pnpm dev:backend        # http://localhost:3001
pnpm dev:frontend       # http://localhost:3002
```

Copia `apps/backend/.env.example` → `.env` y `apps/frontend/.env.example` → `.env.local` si necesitas cambiar puertos/orígenes.

La app funciona standalone en el navegador (fuera de Monday) usando un contexto mock; dentro de un iframe de Monday, `monday-sdk-js` toma el contexto real automáticamente.

## Qué es real y qué es mock en esta entrega

- **Datos**: los 6 flujos (etapas + subpasos + decisiones/aprobaciones) están modelados fielmente a partir de los documentos de flujo compartidos, en `packages/shared/src/flows-data.ts`. Los proyectos, roles y usuarios son dummy.
- **Backend**: repositorio en memoria (se reinicia al reiniciar el proceso), sin base de datos ni autenticación real.
- **Aprobaciones por rol**: cada paso de tipo `approval` requiere un rol específico; usa el selector **"Actuar como"** del encabezado para simular distintos perfiles y probar el gating.
- **Asistente**: respuestas basadas en reglas simples (`apps/backend/src/assistant`), no hay llamada a un LLM real todavía.
- **Monday / Jira**: no hay integración real (OAuth, webhooks, sincronización de tableros) — solo la lectura de contexto vía `monday-sdk-js` en el frontend.
- **Archivos**: el drag-and-drop de la Etapa 0 envía solo metadata (nombre/tamaño/tipo) al backend, que responde con un "insight" simulado; no hay almacenamiento real de archivos.

## Siguientes pasos sugeridos

1. Integración real con Monday (OAuth, contexto de cuenta/usuario, webhooks) y con Jira (épicas/historias).
2. Persistencia real (base de datos) en vez del repositorio en memoria.
3. Asistente con un LLM real detrás de `POST /assistant/chat`.
4. Dockerfiles → CI/CD hacia los dos Cloud Run.
