# DevCycle — Mapeo Integral de Flujos de Usuario, Rutas y Diagnóstico de Arquitectura Frontend

**Documento de Arquitectura y Navegación Frontend**  
**Proyecto:** DevCycle Back-Front (`apps/frontend`)  
**Fecha:** Octubre 2026  
**Líder Técnico Frontend:** Javier Enrique Trejo Rodríguez

---

## 1. Contexto y Propósito de la Solución

DevCycle es un prototipo interactivo (MVP con datos *mock*) diseñado para presentar ante los directivos y sponsors de Liverpool (**Jorge Sánchez, Omar, Clemente, Alexis Labrada**) la automatización integral de la gestión de iniciativas de software. 

Su propósito central es demostrar la reducción del **90.67% de la carga manual** (ahorrando ~304 horas/mes en comités y cálculo de costos), mediante un recorrido que va desde que una idea nace en negocio hasta que se valida su impacto tecnológico, se prioriza visualmente, se dimensiona con inteligencia artificial (Gemini) y se aprueba técnicamente.

---

## 2. Mapa Completo de Rutas del Frontend

| Ruta | Nombre de Pantalla | Actor Principal | Propósito en el Ciclo |
|---|---|---|---|
| `/` | **Home / Portafolio** | Portfolio Manager / Directores | Visión ejecutiva consolidada, métricas de las 4 etapas macro y acceso por cartera. |
| `/discovery` | **Discovery & Intake** | Solicitante / Business Partner (BP) | Formulación asistida por IA del requerimiento de negocio y caso de uso. |
| `/backlog` | **Cartera de Pendientes (Backlog TI)** | Portfolio Manager / Arquitectura | Validación mandatoria de impacto tecnológico y confirmación de sistemas afectados. |
| `/priorizacion` | **Revisión y Priorización** | Portfolio Manager / PMO | Ordenamiento visual vertical, matriz 2x2, alerta de desplazamientos y formalización. |
| `/priorizacion/evaluacion` | **Evaluación Multicriterio** | Portfolio Manager / Evaluadores | Calificación ponderada y justificaciones cualitativas de 5 criterios clave. |
| `/priorizacion/confirmacion` | **Confirmación de Decisión** | Portfolio Manager | Dictamen formal de la iniciativa (Priorizar, Observación, Ajustes, Descartar). |
| `/estimacion` | **Estimación Asistida y VoBo Dual** | Business Partner, Líder Técnico y Arquitectura | Sizing con Gemini, Hoja de Costos en GCP/Horas y doble VoBo simultáneo. |
| `/project/[id]` | **Ficha de Proyecto Legacy** | Líderes de Proyecto / PM | Detalle técnico paso a paso con stepper BPMN y carga de documentos. |
| `/team` | **Usuarios y Configuración** | Administrador de Sistema | Consulta de usuarios de prueba, roles y constantes de entorno. |

---

## 3. Explicación Detallada de los Flujos de Principio a Fin

### Flujo A: Ciclo Dorado de una Iniciativa (El Recorrido Demo Principal)
Este es el flujo principal que se debe presentar a los directivos para convencerlos del valor de la plataforma:

```text
[ 1. Discovery ] ➔ [ 2. Backlog TI ] ➔ [ 3. Priorización ] ➔ [ 4. Estimación & VoBo ] ➔ [ 5. Formalización ]
```

#### Paso 1: Registro y Descubrimiento Asistido (`/discovery`)
* **Actor:** Usuario solicitante del área de negocio o Business Partner.
* **Qué hace:**
  1. Ingresa los datos generales: título, cartera/unidad de negocio, solicitante corporativo (`@liverpool.com.mx`), sponsor ejecutivo (`@liverpool.com.mx`) e interesados adicionales para notificaciones automáticas (BRM, PMO).
  2. Redacta el dolor o problemática operativa. Puede apoyarse en el widget lateral **DataSwat AI** con sugerencias automáticas o simular subir un PDF para extraer datos.
  3. Identifica preliminarmente si tiene impacto de TI y marca los sistemas afectados (SAP, POS, APIs, Core, Pasarelas).
  4. Cuantifica el beneficio esperado (ahorro de horas hombre o monetizado anual) y el KPI de éxito.
  5. Revisa la Ficha Resumen y hace clic en **"Registrar Inicialmente y Enviar a Backlog"**.
* **Resultado:** La iniciativa se almacena en el store con estado "Nueva", marcada como `enCarteraPendientes: true` e `impactoTIConfirmado: false`.

#### Paso 2: Filtro Mandatorio en Cartera de Pendientes (`/backlog`)
* **Actor:** Portfolio Manager y Arquitecto de Dominio.
* **Qué hace:**
  1. El PM entra a `/backlog` y filtra por su Cartera de Negocio (p. ej. *Digital* o *Negocios Financieros*).
  2. Selecciona la iniciativa recién registrada para analizar su justificación de negocio.
  3. **Decisión Mandatoria:**
     - Responde obligatoriamente: *¿Requiere intervención de TI?*
     - Valida y confirma la lista de sistemas tecnológicos Liverpool involucrados (SAP ERP, Core, API Gateway, etc.).
     - Asigna el nivel de complejidad tecnológica preliminar (Baja, Media, Alta).
  4. Hace clic en **"Confirmar y Pasar a Priorización"** (o "Descartar Iniciativa de TI").
* **Resultado:** Si requiere TI, se desbloquea hacia el backlog activo de priorización con `impactoTIConfirmado: true`. Si no requiere TI, se descarta para no consumir capacidad de desarrollo.

#### Paso 3: Priorización Visual y Control de Capacidad (`/priorizacion`)
* **Actor:** Portfolio Manager.
* **Qué hace:**
  1. Visualiza las iniciativas ordenadas verticalmente por prioridad (`#1`, `#2`, `#3`...).
  2. Utiliza los controles de arrastre / botones de reordenamiento (`▲`, `▼`, `TOP`) para mover iniciativas según la capacidad y estrategia del trimestre.
  3. **Alerta de Desplazamientos:** Al mover una iniciativa a un puesto superior, el sistema despliega un modal interactivo advirtiendo: *"Mover esta iniciativa a la posición #1 provocará el desplazamiento de N iniciativas en el backlog"*.
  4. Consulta la **Matriz 2x2** (Impacto vs Esfuerzo) para ubicar iniciativas en los cuadrantes *Quick Wins*, *Estratégicas*, *Bajo Valor* o *Tácticas*.
  5. Al finalizar los acuerdos del comité, presiona **"Formalizar Prioridades"**. Un modal confirma el congelamiento del orden y simula el disparo de notificaciones por correo y Google Chat a directores y BRM (Clemente / Alexis Labrada).

#### Paso 4: Sizing Asistido con IA y Doble VoBo Técnico (`/estimacion`)
* **Actor:** Business Partner, Líder Técnico y Líder de Arquitectura.
* **Qué hace:**
  1. **Tab 1 (Sizing Gemini):** El BP dialoga con el asistente virtual para responder preguntas de dimensionamiento: TPS pico requeridos (p. ej. 450 TPS), volumen de usuarios mensuales (3.2M) y nivel de resiliencia/SLA (99.95%).
  2. Gemini calcula automáticamente las horas de desarrollo (Front, Back, QA) y la infraestructura de nube (Cloud Run, Cloud SQL HA, Pub/Sub, BigQuery). El BP hace clic en *"✨ Aplicar dimensionamiento a Hoja de Costos"*.
  3. **Tab 2 (Hoja de Costos):** Visualiza la Hoja de Costos y Charter consolidado: desglose de horas por perfil técnico en MXN y costo de nube en USD/mes.
  4. **Tab 3 (VoBo Dual):**
     - El **Líder Técnico** revisa horas y factibilidad del equipo -> Otorga *"VoBo Técnico"* o solicita *"Refinar"*.
     - El **Líder de Arquitectura** revisa componentes, nube y seguridad -> Otorga *"VoBo Arquitectura"* o solicita *"Refinar"*.
     - En caso de observaciones, se registra el motivo de refinamiento y se notifica al BP para reajustar.
  5. Una vez que ambos líderes otorgan su VoBo, se habilita el botón verde **"Generar Charter y Pasar a Ejecución"**.

#### Paso 5: Supervisión y Seguimiento en Home (`/`)
* **Actor:** Directores, PMO y Sponsors.
* **Qué hace:**
  1. Consulta la gráfica de dona interactiva que consolida el avance en las **4 Etapas Macro**: *1. Definición*, *2. Estimación*, *3. Ejecución* y *4. Cierre*.
  2. Selecciona su Cartera de Negocio para ver únicamente sus indicadores sin mezclarse con otras áreas.
  3. Revisa la bandeja prioritaria y el estado operativo estándar (*Por iniciar, En curso, Finalizado, Atrasado*).

---

### Flujo B: Evaluación Multicriterio Profunda (`/priorizacion/evaluacion` y `/priorizacion/confirmacion`)
* **Actor:** Portfolio Manager / Evaluadores de Comités.
* **Qué hace:**
  1. En `/priorizacion`, al hacer clic en el menú contextual `...` de una iniciativa, ingresa a `/priorizacion/evaluacion?id=...`.
  2. Califica los 5 criterios ponderados (1 a 5) con justificaciones escritas por criterio:
     - Impacto al negocio (30%)
     - Alineación estratégica (25%)
     - Urgencia / oportunidad (15%)
     - Complejidad preliminar (15%)
     - Riesgos y dependencias (15%)
  3. Presiona **"Continuar a Decisión"**, lo que navega a `/priorizacion/confirmacion?id=...`.
  4. En la pantalla de confirmación, selecciona el dictamen formal (*Priorizar, En observación, Solicitar ajustes, Descartar*), ajusta la prioridad final (*Alta, Media, Baja*) y confirma el destino.
  5. La iniciativa queda actualizada con score final y regresa a `/priorizacion`.

---

### Flujo C: Ficha de Proyecto Stepper BPMN (`/project/[id]`)
* **Actor:** Project Manager / Equipo de Delivery.
* **Qué hace:**
  1. Consulta la ficha de un proyecto (`proj-01`, `proj-02`, etc.) derivado del mock de `@devcycle/shared`.
  2. Visualiza el `StageTracker` y navega por los subpasos BPMN heredados de los flujos To-Be iniciales (`SubflowStepper`).
  3. Consulta o sube documentos de soporte mediante `FileDropzone`.

---

### Flujo D: Administración de Usuarios y Roles (`/team`)
* **Actor:** Administrador / Desarrollador.
* **Qué hace:**
  1. Consulta el catálogo de usuarios registrados y sus correos corporativos.
  2. Inspecciona los roles de prueba (Directores, PMO, BRM, Arquitectura, Líder Técnico) que se usan en el selector *"Actuar como"* del header.
  3. Consulta las constantes de diseño y marca institucional Liverpool.

---

## 4. Diagnóstico de Páginas y Componentes: ¿Cuáles están repetidas, obsoletas o sobran?

Al cruzar los requerimientos y acuerdos de negocio contra la estructura actual del frontend, se identifican las siguientes oportunidades de optimización y limpieza:

### 1. Duplicidad entre Evaluación Rápida (Modal) y Sub-rutas (`/priorizacion/evaluacion` + `/confirmacion`)
* **Diagnóstico:** **Duplicidad funcional**.
* **Detalle:** En `/priorizacion/page.tsx` existe un modal rápido con sliders para evaluar y asignar score/prioridad inmediatamente. Sin embargo, también existen dos páginas completas de sub-ruta (`/priorizacion/evaluacion` y `/priorizacion/confirmacion`). Esto genera dos caminos distintos para hacer exactamente lo mismo.
* **Recomendación:** 
  - *Opción Recomendada:* Mantener el flujo guiado profundo (`/evaluacion` ➔ `/confirmacion`) porque es visualmente impactante y muestra las justificaciones cualitativas que los directivos y comités valoran, eliminando el modal redundante de `/priorizacion` para evitar confusión.

### 2. Desconexión y Obsolescencia de `/project/[id]`
* **Diagnóstico:** **Ruta desactualizada y desconectada**.
* **Detalle:**
  - Consume datos de `useProject(id)` del backend/shared, por lo que **no reconoce** las iniciativas creadas en `/discovery` o gestionadas en `/priorizacion` (que viven en el Zustand store).
  - Sigue mostrando el modelo antiguo de **6 etapas macro** (`flujo-0` a `flujo-5`), contradiciendo la unificación a 4 etapas acordada en las sesiones técnicas.
  - Presenta campos manuales que el equipo acordó expresamente eliminar (presupuesto manual, dependencias de arquitectura y fechas objetivo).
* **Recomendación:** Rediseñar `/project/[id]` para que lea la iniciativa desde `priorizacionStore`, mostrando un **Charter Ejecutivo / Ficha de Iniciativa 360°** que consolide:
  1. Datos del Discovery inicial.
  2. Validación de sistemas confirmados en Backlog TI.
  3. Score y dictamen de Priorización.
  4. Hoja de Costos de Estimación y VoBo de los líderes.

### 3. Código Muerto: `components/ProjectBoard.tsx`
* **Diagnóstico:** **100% obsoleto / Código muerto**.
* **Detalle:** Es un componente tabla remanente de la primera maqueta base que ya no es importado ni utilizado en ninguna vista del proyecto (reemplazado por las tablas personalizadas de Home y Priorización).
* **Recomendación:** Eliminar el archivo para mantener el repositorio limpio.

### 4. Enlaces rotos en `MainMenuOverlay.tsx`
* **Diagnóstico:** **Hipervínculos a anclas inexistentes**.
* **Detalle:** Los elementos de menú *"Comité"* (`/#comite`) y *"Auditoría"* (`/#auditoria`) apuntan a identificadores DOM que no existen en `page.tsx`.
* **Recomendación:**
  - Redirigir *"Comité"* a `/priorizacion?tab=comite`.
  - Reemplazar *"Auditoría"* por un modal de trazabilidad o enlazarlo a la Cartera de Pendientes (`/backlog`).

### 5. Página `/team`
* **Diagnóstico:** **Secundaria / Fuera del flujo de negocio**.
* **Detalle:** Es una vista de configuración interna. No estorba técnicamente, pero no debe tener protagonismo durante una presentación a directivos.
* **Recomendación:** Mantenerla únicamente como enlace secundario en el menú overlay, sin destacarla en la navegación principal.

---

## 5. Resumen de Flujo Óptimo Propuesto para la Demo Ejecutiva

Para una presentación de alto impacto ante directores, el recorrido debe ser lineal y coherente:

1. **Paso 0 (`/`):** El director ve el tablero con sus 4 etapas macro y filtra por su cartera de negocio.
2. **Paso 1 (`/discovery`):** Negocio formula una iniciativa con ayuda del chat de IA y la envía.
3. **Paso 2 (`/backlog`):** TI recibe la iniciativa, valida obligatoriamente que requiere software y confirma los sistemas (SAP, Core, etc.).
4. **Paso 3 (`/priorizacion` y `/evaluacion`):** El PM la evalúa con score 0-100, la reordena visualmente (alerta de desplazamientos) y formaliza el orden de atención.
5. **Paso 4 (`/estimacion`):** Se dimensiona con Gemini (horas y servicios GCP) y recibe el VoBo dual simultáneo de Líder Técnico y Arquitectura.
6. **Paso 5 (`/project/[id]`):** Se visualiza el Charter de Proyecto consolidado listo para ejecución.
