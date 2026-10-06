# DevCycle — Arquitectura Técnica a Alto Nivel

Diagrama y desglose técnico de componentes, flujo de datos e infraestructura para la solución productiva de DevCycle en Google Cloud Platform (GCP).

---

## 1. Diagrama de Arquitectura (Mermaid)

```mermaid
flowchart TD
    %% CLIENTE Y PLATAFORMA HOST
    subgraph S_FRONT["1. Capa Frontend"]
        FRONT["DevCycle Frontend<br/>(Next.js / React / Vibe UI)"]
        MONDAY_HOST["Monday.com<br/>(Contenedor Iframe / Monday SDK)"]
    end

    %% INGRESS & API GATEWAY
    subgraph S_INGRESS["2. Puerta de Enlace (GCP)"]
        LB["Cloud Load Balancer / Ingress"]
        BFF["BFF / API Gateway<br/>(NestJS en Cloud Run)"]
    end

    %% MICROSERVICIOS BACKEND
    subgraph S_BACKEND["3. Microservicios Backend (GCP Cloud Run)"]
        direction TB
        SVC_INIT["Iniciativas & Portafolio<br/>(NestJS)"]
        SVC_SIZING["Estimación & Sizing IA<br/>(NestJS)"]
        SVC_SYNC["Sincronizador Jira & Monday<br/>(NestJS)"]
        SVC_NOTIF["Servicio de Notificaciones<br/>(NestJS)"]
    end

    %% MENSAJERÍA ASÍNCRONA
    subgraph S_EVENTS["4. Bus de Eventos Asíncronos"]
        PUBSUB[("Google Cloud Pub/Sub")]
    end

    %% BASE DE DATOS
    subgraph S_DATA["5. Persistencia de Datos (VPC Privada)"]
        DB[("Cloud SQL<br/>PostgreSQL 16")]
    end

    %% SERVICIOS EXTERNOS
    subgraph S_EXT["6. Servicios Externos & APIs"]
        GEMINI["Google Cloud Vertex AI<br/>(Gemini API)"]
        JIRA["Jira Cloud REST API"]
        MONDAY_API["Monday.com GraphQL API"]
        GCHAT["Google Chat Webhooks"]
    end

    %% RELACIONES FRONTEND
    MONDAY_HOST <-->|"monday-sdk-js"| FRONT
    FRONT -->|"HTTPS / REST"| LB
    LB --> BFF

    %% RELACIONES GATEWAY -> MICROSERVICIOS
    BFF -->|"HTTP / VPC Interna"| SVC_INIT
    BFF -->|"HTTP / VPC Interna"| SVC_SIZING
    BFF -->|"HTTP / VPC Interna"| SVC_SYNC

    %% RELACIONES A BASE DE DATOS
    SVC_INIT -->|"TCP (Prisma ORM)"| DB
    SVC_SIZING -->|"TCP (Prisma ORM)"| DB
    SVC_SYNC -->|"TCP (Prisma ORM)"| DB

    %% RELACIONES DE EVENTOS
    SVC_INIT -->|"Publica eventos"| PUBSUB
    SVC_SIZING -->|"Publica eventos"| PUBSUB
    PUBSUB -->|"Consume eventos"| SVC_SYNC
    PUBSUB -->|"Consume eventos"| SVC_NOTIF

    %% RELACIONES A APIS EXTERNAS
    SVC_SIZING <-->|"Inferencia"| GEMINI
    SVC_SYNC <-->|"Sincronización"| MONDAY_API
    SVC_SYNC <-->|"Sincronización"| JIRA
    SVC_NOTIF -->|"Alertas"| GCHAT
```

---

## 2. Componentes Técnicos

1. **Frontend (Next.js 16 + React 19 + Vibe UI):**
   - Interfaz web interactiva ejecutada como aplicación web moderna.
   - Funciona standalone o embebida dentro de Monday.com mediante `monday-sdk-js`.
   - Se comunica con el backend mediante llamadas seguras HTTPS REST contra el Gateway.

2. **BFF / API Gateway (NestJS en GCP Cloud Run):**
   - Único punto de entrada público para el backend.
   - Valida autenticación corporativa y contexto de Monday.
   - Enruta peticiones hacia los microservicios internos dentro de la red privada (VPC).

3. **Microservicios Backend (GCP Cloud Run):**
   - **`Iniciativas & Portafolio`:** Ciclo de vida de iniciativas (4 etapas macro), validación en Backlog TI y priorización visual.
   - **`Estimación & Sizing IA`:** Agente conversacional conectado a Gemini, cálculo de Hoja de Costos y VoBo dual.
   - **`Sincronizador Jira & Monday`:** Conexión bidireccional entre las épicas de Jira y los tableros de Monday.com.
   - **`Servicio de Notificaciones`:** Despacho de alertas a canales de Google Chat y correos corporativos.

4. **Bus de Eventos (Google Cloud Pub/Sub):**
   - Desacopla las operaciones pesadas (sincronizaciones, notificaciones y cálculos) de manera asíncrona y resiliente.

5. **Base de Datos (Cloud SQL PostgreSQL 16):**
   - Hospedada dentro de la VPC privada de GCP sin IP pública.
   - Conexión vía Serverless VPC Access Connector con transacciones ACID para garantizar consistencia en priorizaciones y aprobaciones.

6. **Servicios Externos:**
   - **Google Cloud Vertex AI (Gemini):** Motor para el chat inteligente de dimensionamiento técnico.
   - **Monday.com GraphQL API:** Publicación y lectura de tableros directivos.
   - **Jira Cloud API:** Creación y seguimiento de épicas e historias técnicas.
   - **Google Chat:** Alertas y notificaciones en tiempo real a los comités y directores.
