# Guía Oficial de Estilos y Sistema de Diseño — DevCycle (El Puerto de Liverpool)

**Documento de Estandarización Visual y de Componentes UI**  
**Proyecto:** DevCycle — Gestión Integral del Portafolio de Iniciativas  
**Organización:** El Puerto de Liverpool (Aplicación embebida en Monday.com Work OS)  
**Última actualización:** Octubre 2026

---

## 1. Propósito y Filosofía de Diseño

Este documento establece las **especificaciones visuales, cromáticas, tipográficas, dimensionales y responsivas** de **DevCycle**. Su objetivo es servir como contrato de diseño único para que cualquier célula o equipo de desarrollo construya nuevos módulos o aplicaciones satélite manteniendo exactamente el mismo *look & feel*.

El diseño de DevCycle responde a dos pilares visuales que conviven en equilibrio:
1. **Identidad Corporativa de El Puerto de Liverpool:** Presencia dominante de tonos **morados (`#833177`), magentas (`#9d2469` / `#b52670`), rosas (`#e6007e`) y acentos cálidos/naranjas (`#d97706`)** en encabezados, indicadores clave, llamadas a la acción (CTAs) y elementos de marca.
2. **Integración Nativa con Monday.com (Vibe Design System):** Fondos neutros luminosos (`#f6f7fb`), tarjetas blancas con bordes sutiles (`#e6e9ef`), tipografía limpia de alta legibilidad en tablas densas y estados operativos estandarizados (Verde, Azul, Ámbar, Rojo, Gris).

---

## 2. Tipografía y Jerarquía de Texto

### 2.1 Familia Tipográfica
* **Fuente Principal:** `Montserrat` (Google Fonts, pesos `300` a `900`).
* **Fuentes de Respaldo (Fallback):** `"Figtree", "Roboto", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
* **Fuente Monoespaciada (IDs técnicos / Folios):** `monospace` (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`).
* **Suavizado de fuente obligatorio:** `-webkit-font-smoothing: antialiased`.

### 2.2 Pesos Tipográficos (`font-weight`)
> **Nota técnica importante sobre `@vibe/core/tokens`:** La librería Vibe redefine la variable `--font-weight-bold` con valor `500`. En DevCycle es obligatorio sobrescribir `--font-weight-bold: 700` en `:root` para preservar el grosor real de los textos en negrita.

| Nivel de Peso | Valor Numérico | Uso en la Aplicación |
| :--- | :---: | :--- |
| **Regular / Normal** | `400` | Textos descriptivos extensos, párrafos secundarios y celdas regulares. |
| **Medium** | `500` | Subtítulos de apoyo, notas al pie, etiquetas no activas e inputs de formulario. |
| **SemiBold** | `600` | Botones estándar, encabezados de tablas (`th`), pills de estado y enlaces de navegación. |
| **Bold** | `700` | Títulos de tarjetas, nombres de iniciativas en tablas, etiquetas de campos (`label`) y botones CTA. |
| **ExtraBold** | `800` | Títulos principales de página (`h1`), métricas numéricas grandes (KPIs, Scores) y badges de bloque. |
| **Black** | `900` | Indicadores puntuales de marca (punto morado del header y valores de score destacados). |

### 2.3 Escala de Tamaños de Texto

| Elemento UI | Tamaño (`px`) | Alto de línea (`line-height`) | Tracking (`letter-spacing`) | Peso | Color Base |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Valor numérico gigante (KPI Card)** | `34px` | `1.0` | `0px` | `800` | `#1e2022` |
| **Valor numérico de Etapa / Score** | `30px` – `32px` | `1.0` | `0px` | `800` | `#1e2022` / `#833177` |
| **Saludo Hero (`Home • Portafolio`)** | `26px` | `1.2` | `0px` | `800` | `#1e2022` |
| **Título Principal de Vista (`h1`)** | `24px` | `1.25` | `-0.3px` | `800` | `#1e2022` |
| **Título de Modal / Sub-sección (`h2`)** | `17px` – `20px` | `1.3` | `0px` | `700` – `800` | `#1e2022` |
| **Título de Tarjeta / Bloque (`h3`)** | `14.5px` – `16px` | `1.3` | `0px` | `700` | `#1e2022` |
| **Subtítulo de Página** | `13.5px` | `1.45` | `0px` | `400` | `#676879` |
| **Texto de Cuerpo / Tablas / Inputs** | `12.5px` – `13.5px` | `1.45` | `0px` | `400` – `600` | `#383838` |
| **Etiquetas de Formulario (`label`)** | `12px` | `1.35` | `0px` | `700` | `#1e2022` |
| **Pills, Badges y Metadatos** | `11px` – `11.5px` | `1.3` | `0.2px` – `0.5px` | `600` – `700` | Según estado |
| **Sub-etiquetas / Contadores / Ejes** | `9.5px` – `10.5px` | `1.2` | `0.4px` – `0.6px` | `600` – `800` | `#676879` / `#8c8d98` |

---

## 3. Paleta de Colores Oficial

### 3.1 Colores de Identidad de Marca (El Puerto de Liverpool)

| Nombre del Color | Hexadecimal | Rol Visual y Aplicación |
| :--- | :---: | :--- |
| **Morado Principal (`Brand Primary`)** | `#833177` | Color primario institucional. Botones principales (`purple-solid`), bordes de botones secundarios (`purple-outline`), íconos activos, enlaces y acentos del header. |
| **Morado Hover (`Brand Primary Hover`)** | `#6e2462` | Estado `on-hover` de botones morados sólidos. |
| **Morado Active (`Brand Primary Active`)** | `#581b4e` | Estado `on-click / active` de botones morados sólidos. |
| **Morado Ligero (`Brand Primary Light`)** | `#f5edf5` | Fondo `on-hover` de botones outlined, pestañas activas y cajas de íconos secundarios. |
| **Morado Suave (`Brand Primary Soft`)** | `#fbf2f7` | Fondo de banners informativos de IA (DataSwat) y llamadas contextuales. |
| **Borde Morado Suave (`Brand Primary Border`)** | `#f2d8ec` | Borde de tarjetas destacadas, cajas de resumen de score y banner de simulación. |
| **Rosa Liverpool (`Brand Accent`)** | `#e6007e` | Color de acento de alto impacto. Botones CTA de evaluación/confirmación, barras de progreso, checks activos, puntos requeridos (`*`) y badge `DATASWAT MVP`. |
| **Rosa Oscuro (`Brand Accent Dark`)** | `#b30079` | Estado `on-hover` de los botones CTA Rosa Liverpool. |
| **Rosa Active (`Brand Accent Active`)** | `#8f0060` | Estado `on-click / active` de los botones CTA Rosa Liverpool. |
| **Fuente Magenta (`Brand Magenta Text`)** | `#9d2469` | Color tipográfico para títulos destacados en tarjetas de Backlog y Priorización. |
| **Magenta Base (`Brand Magenta`)** | `#b52670` | Color de borde activo, ícono de insignia y pills seleccionadas en Backlog / Etapa 1. |
| **Magenta Hover (`Brand Magenta Hover`)** | `#961e5c` | Estado `on-hover` de elementos interactivos magenta. |
| **Magenta Active (`Brand Magenta Active`)** | `#7a174a` | Estado `on-click / active` de elementos interactivos magenta. |
| **Fondo Magenta Pastel (`Brand Magenta Bg`)** | `#fdf5f9` | Fondo de la tarjeta KPI "Backlog por priorizar" y Etapa 1 activa. |
| **Borde Magenta Pastel (`Brand Magenta Border`)** | `#f3c5de` | Borde en reposo de tarjetas y filas con tinte magenta. |

### 3.2 Superficies, Fondos, Texto y Bordes (Armonía Monday.com)

| Categoría | Nombre | Hexadecimal | Aplicación |
| :--- | :--- | :---: | :--- |
| **Fondo** | Fondo de Página (`Bg Page`) | `#f6f7fb` | Fondo general del `<body>` detrás de todas las tarjetas. |
| **Fondo** | Fondo de Tarjeta (`Bg Card`) | `#ffffff` | Superficie principal de cards, tablas, header, inputs y modales. |
| **Fondo** | Superficie Suave (`Surface Soft`) | `#fbfbfd` | Cajas internas de sub-formularios (OKRs, burbujas de bot, dropzones). |
| **Fondo** | Cabecera de Tabla / Bloque Gris | `#fafbfc` | Encabezados de tabla (`thead`), cajas de metadatos y barras de sugerencias. |
| **Texto** | Texto de Títulos (`Text Heading`) | `#1e2022` | Títulos `h1`–`h4`, nombres de iniciativas y métricas numéricas. |
| **Texto** | Texto Principal (`Text Main`) | `#383838` | Texto general de la interfaz y contenido de inputs. |
| **Texto** | Texto Secundario (`Text Secondary`) | `#676879` | Subtítulos, descripciones de apoyo, áreas de negocio y cabeceras de tabla. |
| **Texto** | Texto Apagado (`Text Muted`) | `#8c8d98` | Timestamps, textos de ayuda deshabilitados, placeholders y notas al pie. |
| **Borde** | Borde General (`Border Default`) | `#e6e9ef` | Borde exterior de todas las tarjetas, tablas, paneles y divisores principales. |
| **Borde** | Borde Sutil (`Border Subtle`) | `#f0f2f7` | Divisores internos entre filas de tabla (`#f1f3f7`) y tarjetas secundarias. |
| **Borde** | Borde de Inputs (`Border Input`) | `#dcdfe4` | Borde en reposo de campos `<input>`, `<select>` y `<textarea>`. |

---

## 4. Colores por Situación (Semánticos) y Estados de Botones

Todo botón o control interactivo debe implementar de manera consistente sus estados visuales (**Default**, **On-Hover**, **On-Click / Active**, **Focus** y **Disabled**), tanto para los botones de marca como para los botones asociados a una **situación operativa** (Información, Éxito, Advertencia/Emergencia, Error/Peligro).

### 4.1 Matriz de Estados para Botones Sólidos (Marca y Situaciones)

| Tipo / Situación | Uso Principal | Fondo Default | Fondo On-Hover | Fondo On-Click (Active) | Texto | Borde | Sombra / Efecto Hover |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Primario Marca (`Purple Solid`)** | Acciones principales del módulo (Crear iniciativa, Avanzar paso, Guardar). | `#833177` | `#6e2462` | `#581b4e` | `#ffffff` | `1.5px solid` (mismo color de fondo) | Sin elevación o ligera transición `0.15s ease` |
| **CTA Destacado (`Accent Solid`)** | Confirmación final de flujo (Evaluar iniciativa, Guardar y continuar, Enviar a Backlog). | `#e6007e` | `#b30079` | `#8f0060` | `#ffffff` | `none` o `1.5px solid` | Sombra `0 2px 6px rgba(230,0,126,0.25)` y `translateY(-1px)` en hover |
| **Información (`Info`)** | Acciones informativas, consulta de documentación, sincronización con Monday. | `#0284c7` | `#0369a1` | `#075985` | `#ffffff` | `1.5px solid` (mismo color de fondo) | Sombra suave `0 2px 6px rgba(2,132,199,0.25)` |
| **Éxito / Aprobación (`Success`)** | Otorgar VoBo Técnico/Arquitectura, Aprobar paso, Generar Charter final. | `#059669` *(o `#10b981`)* | `#047857` | `#065f46` | `#ffffff` | `1.5px solid` (mismo color de fondo) | Sombra suave `0 2px 6px rgba(5,150,105,0.25)` |
| **Advertencia / Emergencia (`Warning`)** | Solicitar refinamiento, pausar en observación, alertas de atención inmediata. | `#d97706` | `#b45309` | `#92400e` | `#ffffff` | `1.5px solid` (mismo color de fondo) | Sombra suave `0 2px 6px rgba(217,119,6,0.25)` |
| **Error / Peligro (`Danger`)** | Rechazar aprobación, descartar iniciativa, eliminar registro crítico. | `#dc2626` | `#b91c1c` | `#991b1b` | `#ffffff` | `1.5px solid` (mismo color de fondo) | Sombra suave `0 2px 6px rgba(220,38,38,0.25)` |
| **Deshabilitado (`Disabled`)** | Cualquier botón cuya acción aún no cumple precondiciones (ej. sin doble VoBo). | `#94a3b8` *(o opacidad `0.5`)* | `#94a3b8` *(sin cambio)* | `#94a3b8` *(sin cambio)* | `#ffffff` | `1.5px solid #94a3b8` | `cursor: not-allowed`, sin sombra ni movimiento |

### 4.2 Matriz de Estados para Botones Secundarios / Outlined y Fantasma

| Variante Outlined | Uso Principal | Estado Default (Fondo / Borde / Texto) | Estado On-Hover (Fondo / Borde / Texto) | Estado On-Click / Active |
| :--- | :--- | :--- | :--- | :--- |
| **Outlined Morado (`Purple Outline`)** | Acciones secundarias (Volver, Actualizar, Refinar, Cancelar, Subir archivo). | Fondo: `#ffffff`<br>Borde: `1.5px solid #833177`<br>Texto: `#833177` | Fondo: `#f5edf5`<br>Borde: `1.5px solid #833177`<br>Texto: `#833177` | Fondo: `#f2d8ec`<br>Borde: `1.5px solid #581b4e`<br>Texto: `#581b4e` |
| **Outlined Rosa (`Pink Outline`)** | Solicitar ajustes en evaluación o regresar al paso anterior de evaluación. | Fondo: `#ffffff`<br>Borde: `1px solid #fbcfe8`<br>Texto: `#db2777` | Fondo: `#fdf2f8`<br>Borde: `1px solid #db2777`<br>Texto: `#db2777` | Fondo: `#fce7f3`<br>Borde: `1px solid #9d174d`<br>Texto: `#9d174d` |
| **Outlined Peligro (`Danger Outline`)** | Botón rápido "Descartar" o eliminar elemento secundario. | Fondo: `#ffffff`<br>Borde: `1px solid #fee2e2`<br>Texto: `#dc2626` | Fondo: `#fef2f2`<br>Borde: `1px solid #fca5a5`<br>Texto: `#b91c1c` | Fondo: `#fee2e2`<br>Borde: `1px solid #dc2626`<br>Texto: `#991b1b` |
| **Outlined Neutro (`Neutral Outline`)** | Guardar borrador, previsualizar fila, agregar capacidad/OKR. | Fondo: `#ffffff`<br>Borde: `1px solid #d0d4e4`<br>Texto: `#374151` | Fondo: `#f3f4f6`<br>Borde: `1px solid #9ca3af`<br>Texto: `#1e2022` | Fondo: `#e5e7eb`<br>Borde: `1px solid #6b7280`<br>Texto: `#1e2022` |

### 4.3 Paleta de Superficies por Situación (Badges, Pills y Banners de Alerta)

Cuando una situación se representa en un **Badge, Pill o Banner informativo** (no interactivo), se utiliza la combinación de **Fondo Pastel + Texto Intenso + Borde Suave de `1px`**:

| Situación / Estado | Fondo (`Background`) | Texto e Ícono (`Text`) | Borde (`1px solid`) | Casos de Uso en DevCycle |
| :--- | :---: | :---: | :---: | :--- |
| **Éxito / Finalizado / Aprobado** | `#e6f7ee` *(o `#ecfdf5`)* | `#059669` | `#a7f3d0` | Estado "Finalizado", Score alto (`>= 80`), VoBo Aprobado, Etapa "Ejecución". |
| **Información / En Curso / Definición** | `#f0f9ff` *(o `#eff6ff`)* | `#0284c7` *(o `#2563eb`)* | `#bae6fd` *(o `#bfdbfe`)* | Estado "En curso", "En priorización", Etapa "Definición" / "Formalización", Callouts informativos. |
| **Advertencia / En Revisión / Media** | `#fff7ed` *(o `#fffbeb`)* | `#d97706` | `#fed7aa` *(o `#fde68a`)* | Estado "En revisión", Prioridad "Media", Score medio (`70–79`), Etapa "Autorización", VoBo Pendiente. |
| **Error / Atrasado / Rechazado / Alta** | `#fde8e8` *(o `#fef2f2`)* | `#dc2626` *(o `#ef4444`)* | `#fca5a5` *(o `#fecaca`)* | Estado "Atrasado", Prioridad "Alta", Iniciativas rechazadas. |
| **Marca / Rol / Con Comentarios** | `#f5eef5` | `#833177` | `#e9d5e8` | Rol activo en el Header (`ADMIN_ROOT`), Estado "Con comentarios", Madurez de iniciativa. |
| **Nueva / Destacado Rosa** | `#fdf2f8` | `#db2777` | `#fbcfe8` | Estado "Nueva", Estado "Por iniciar", Badges de OKR y numeradores rosas. |
| **Estimación / Violeta TI** | `#f5f3ff` | `#7c3aed` | `#ddd6fe` | Etapa 2 "Estimación", Badges de arquitectura técnica. |
| **Neutro / Cerrado / Descartado** | `#f1f3f5` | `#6c757d` | `#e2e5ea` | Estado "Descartada", Etapa "Cierre", etiquetas de sistema o solo lectura. |

---

## 5. Especificaciones y Medidas Exactas de Componentes

### 5.1 Layout Global y Contenedores

| Componente | Propiedad | Medida Exacta / Valor |
| :--- | :--- | :--- |
| **Header Superior (`AppShell`)** | Altura fija (Desktop `>= 640px`) | `58px` (`--app-header-height`) |
| | Padding horizontal | `24px` en Desktop (`14px` en Móvil `< 640px`) |
| | Borde inferior | `1px solid #e6e9ef` |
| | Posición | `sticky`, `top: 0`, `z-index: 20`, fondo `#ffffff` |
| **Contenedor Principal (`main`)** | Ancho máximo (`max-width`) | `1400px` (centrado con `margin: 0 auto`) |
| | Padding interior | `24px` vertical × `32px` horizontal en Desktop (`16px` en Móvil) |
| | Desplazamiento con Chat abierto | En pantallas `>= 1024px`, `padding-right: 392px` (`360px` del chat + `32px`) |
| **Panel Lateral Copilot** | Ancho fijo | `360px` (`--app-copilot-width`), `max-width: 100vw` |
| | Botón flotante (FAB) | Círculo de `52px × 52px`, `border-radius: 50%`, fijo a `bottom: 24px`, `right: 24px` |

### 5.2 Botones

| Tipo de Botón | Altura / Padding | Border Radius | Grosor de Borde | Tamaño y Peso de Fuente | Espacio Ícono-Texto (`gap`) |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Botón Estándar (`Solid` y `Outlined`)** | Padding: `7px` arriba/abajo × `14px`–`16px` izq/der | `8px` | `1.5px solid` | `13px` · Peso `600` | `6px` |
| **Botón de Acción de Barra Inferior** | Padding: `8px` arriba/abajo × `16px`–`20px` izq/der | `8px` | `1px solid` (outlined) / `none` (solid) | `12.5px` – `13px` · Peso `600`–`700` | `6px` |
| **Botón CTA Ancho Completo (Detalle)** | Ancho: `100%` · Padding: `10px` × `18px` | `8px` | `none` | `13.5px` · Peso `700` | `8px` |
| **Botón "Atrás" (`BackButton`)** | Padding: `6px` arriba/abajo × `12px` izq/der | `8px` | `1px solid #e6e9ef` | `12.5px` · Peso `700` | `5px` |
| **Botón de Tabla ("Ver" / "Previsualizar")** | Padding: `3px`–`4px` arriba/abajo × `10px`–`18px` izq/der | `6px` | `1px solid` (`#db2777` o `#d0d4e4`) | `11.5px` – `12px` · Peso `600` | `4px` |
| **Botón Cuadrado de Ícono (Header)** | `34px × 34px` | `8px` | `1px solid transparent` | Ícono `20px` | — |
| **Botón Cerrar Modal / Menú (`X`)** | `30px × 30px` | `6px` | `1px solid #e2e8f0` | Ícono `18px` | — |
| **Botón Paginador (`<` / `>`)** | `26px × 26px` | `6px` | `1px solid #e2e8f0` | Ícono `14px` | — |
| **Botón Píldora IA (`btn-ai-assist`)** | Padding: `5px` arriba/abajo × `12px` izq/der | `20px` (`9999px`) | `1px solid #f2d8ec` | `12px` · Peso `600` | `6px` |

### 5.3 Tarjetas (Cards)

| Variante de Card | Border Radius | Borde | Padding Interior | Sombra (`box-shadow`) | Notas de Diseño |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Card Principal (Tablas, Widgets, Evaluación)** | `14px` | `1px solid #e6e9ef` | `20px` a `24px` | `0 1px 3px rgba(0, 0, 0, 0.03)` | Fondo `#ffffff`. Encabezado interno con `padding-bottom: 14px` y `border-bottom: 1px solid #f1f3f5`. |
| **Card General / Ficha (`board-card`)** | `12px` | `1px solid #e6e9ef` | `20px` arriba/abajo × `24px` izq/der | `0 1px 3px rgba(0, 0, 0, 0.03)` | Usada en Ficha de Proyecto, Usuarios y bloques de Discovery. |
| **Card KPI / Selector de Etapa** | `16px` | `1px solid #e2e8f0` (`1.5px` activa) | `16px` arriba/abajo × `20px` izq/der | Reposo: `0 1px 3px rgba(0,0,0,0.02)`<br>Hover/Activa: `0 6px 18px rgba(131,49,119,0.08)` | Altura mínima (`min-height`): `142px`. Elevación `translateY(-2px)` en hover. |
| **Card de Configuración (`config-card`)** | `10px` | `1px solid #e6e9ef` | `16px` arriba/abajo × `20px` izq/der | `0 1px 2px rgba(0, 0, 0, 0.02)` | Espacio interno entre elementos (`gap`): `14px`. |
| **Sub-caja de Metadatos (Gris)** | `8px` | `1px solid #f1f3f7` | `10px` arriba/abajo × `12px` izq/der | Sin sombra | Fondo `#fafbfc`. Usada en grillas `2×2` de detalle de iniciativa. |
| **Card de Página en Construcción** | `16px` | `1px solid #e6e9ef` | `40px` arriba × `36px` lados/abajo (`28px × 20px` en móvil) | `0 8px 28px rgba(131,49,119,0.06)` | `max-width: 780px`. Incluye barra superior de `6px` con gradiente `linear-gradient(90deg, #833177, #e6007e)`. |

### 5.4 Formularios, Inputs y Controles de Selección

| Control | Border Radius | Borde en Reposo | Borde y Anillo en `Focus` | Padding Interior | Tipografía |
| :--- | :---: | :---: | :--- | :---: | :---: |
| **Input de Texto / Select Estándar** | `7px` – `8px` | `1px solid #dcdfe4` *(o `#d0d4e4`)* | Borde: `#833177`<br>Ring: `0 0 0 2px rgba(131, 49, 119, 0.15)` | `9px` arriba/abajo × `12px` izq/der | `13px` – `13.5px` · Color `#383838` |
| **Textarea** | `6px` – `8px` | `1px solid #d0d4e4` | Borde: `#833177` o `#db2777`<br>Ring: `0 0 0 2px rgba(219, 39, 119, 0.15)` | `10px` arriba/abajo × `12px` izq/der | `12.5px` – `13.5px` · `line-height: 1.4` |
| **Segmented Control (Contenedor)** | `10px` | Sin borde | — | `4px` (`gap: 4px`) | Fondo `#f1f3f5` |
| **Segmented Control (Botón Interno)** | `8px` | Sin borde | — | `6px` arriba/abajo × `16px` izq/der | `13px` · Inactivo `#676879` (`500`) / Activo `#833177` (`700`) con fondo `#f5edf5` |
| **Botón de Escala Numérica (`1` al `5`)** | `6px` | `1px solid #d0d4e4` | Activo: Fondo `#e6007e`, Borde `#e6007e`, Texto `#ffffff` | Tamaño fijo: `30px × 30px` | `12.5px` · Peso `700` |
| **Radio Card / Pirámide Card** | `8px` – `10px` | `1px` o `1.5px solid #e5e7eb` | Activo: Fondo `#fdf2f8`, Borde `#e6007e` o `#db2777` | `12px`–`14px` arriba/abajo × `14px`–`16px` izq/der | Título `13px` (`700`), Descripción `11px` (`400`) |

### 5.5 Tablas, Pills, Badges y Modales

| Componente | Especificaciones de Medidas y Estilo |
| :--- | :--- |
| **Tablas (`table`)** | • Ancho `100%`, `border-collapse: collapse`.<br>• **Cabecera (`th`):** Fondo `#fafbfc`, borde inferior `1px solid #e6e9ef`, padding `10px 12px`, fuente `11.5px`–`12px` (`600`), color `#676879`.<br>• **Celdas (`td`):** Borde inferior `1px solid #f1f3f7`, padding `12px`–`13px` vertical × `12px` horizontal, `vertical-align: middle`.<br>• **Fila Hover:** Fondo `#fafbfe`.<br>• **Fila Seleccionada:** Fondo `#fdf5fa` con borde izquierdo `3px solid #833177` (o `4px solid` del color de la iniciativa en Home). |
| **Pills y Badges de Estado** | • `border-radius: 12px` (o `9999px` en pills circulares).<br>• Padding: `2px`–`3px` arriba/abajo × `8px`–`10px` izq/der.<br>• Borde: `1px solid` del token correspondiente.<br>• Fuente: `11px`–`11.5px`, peso `600`–`700`, `white-space: nowrap`. |
| **Badge de Score Numérico** | • Ancho mínimo (`min-width`): `28px` en tabla de Iniciativas (`34px` en Home).<br>• `border-radius: 6px`–`8px`, padding `2px 6px` (o `3px 8px`), fuente `11.5px`–`12px` (`700`). |
| **Barras de Progreso / Nivel** | • Pista (`track`): Altura `6px`–`8px`, `border-radius: 3px`–`4px`, fondo `#e5e7eb` o `#e2e8f0`.<br>• Relleno (`fill`): Altura `100%`, `border-radius: 3px`–`4px`, fondo `#e6007e` (o `#db2777`), transición `width 0.3s ease`. |
| **Modales (`Dialog`)** | • **Overlay:** `position: fixed`, `inset: 0`, fondo `rgba(17, 24, 39, 0.45)`, `backdrop-filter: blur(3px)`, `z-index: 50`.<br>• **Tarjeta del Modal:** `max-width: 500px` a `580px`, `width: 100%`, `max-height: 90vh`, `border-radius: 16px`, borde `1px solid #e6e9ef`, sombra `0 20px 40px rgba(0, 0, 0, 0.15)`, fondo `#ffffff`. |
| **Notificación Flotante (`Toast`)** | • Posición fija: `top: 74px` (`58px` del header + `16px`), `right: 24px`, `z-index: 100`.<br>• Estilo: Fondo `#1e2022`, texto `#ffffff`, `border-radius: 8px`, padding `10px 18px`, fuente `13px` (`600`), sombra `0 8px 24px rgba(0, 0, 0, 0.15)`. |

---

## 6. Responsividad y Breakpoints Oficiales

La aplicación sigue el enfoque **Mobile-First** utilizando los breakpoints estándar de **Tailwind CSS v4**. A continuación se detallan los puntos de quiebre y cómo deben adaptarse las vistas:

| Breakpoint | Ancho Mínimo (`min-width`) | Dispositivo Objetivo | Comportamiento de Layout y Grillas en DevCycle |
| :--- | :---: | :--- | :--- |
| **Base (Móvil)** | `< 640px` | Teléfonos móviles | • Header en altura automática (`height: auto`) con `flex-wrap` y padding `10px 14px`.<br>• Contenedor `main` con padding reducido a `16px`.<br>• Todas las grillas de KPIs, etapas, formularios y mega-menú colapsan a **1 sola columna (`grid-cols-1`)**. |
| **`sm`** | `640px` (`40rem`) | Móviles grandes / Phablets | • Header pasa a altura fija de `58px` (`sm:h-header`) sin salto de línea.<br>• Grillas de tarjetas KPI (Home), etapas (Iniciativas), bloques de Discovery (1.1–3.1) y tarjetas del Mega Menú pasan a **2 columnas (`sm:grid-cols-2`)**.<br>• Tarjeta de métricas de Confirmación pasa a **3 columnas (`sm:grid-cols-3`)**. |
| **`md`** | `768px` (`48rem`) | Tablets (Vertical) | • Se muestra el correo electrónico del usuario activo en el Header (`md:inline`).<br>• Grilla de 6 etapas en `/iniciativas` y el Mega Menú pasan a **3 columnas (`md:grid-cols-3`)**.<br>• Tarjetas de Doble VoBo (`/estimacion`) y Pirámide Estratégica (`/evaluacion`) se distribuyen en **2 columnas (`md:grid-cols-2`)**. |
| **`lg`** | `1024px` (`64rem`) | Laptops / Tablets Horizontales | • Se activan las vistas divididas a 2 columnas principales:<br>  - Home (`1.8fr` tabla + `1fr` widgets).<br>  - Iniciativas (`1.7fr` tabla + `1fr` panel de detalle).<br>  - Discovery (`7fr` formulario + `3fr` asistente DataSwat AI).<br>  - Evaluación (`1fr` resumen + `1.8fr` criterios) y Confirmación (`1.25fr` análisis + `1fr` decisión).<br>• Grilla de 4 KPIs de Home pasa a **4 columnas (`lg:grid-cols-4`)**.<br>• Cuando el panel Copilot está abierto, `main` reserva `padding-right: 392px`. |
| **`xl`** | `1280px` (`80rem`) | Monitores de Escritorio | • Grilla de las 6 etapas en `/iniciativas` se despliega en **6 columnas en una sola fila (`xl:grid-cols-6`)**.<br>• Mega Menú desplegable muestra sus **5 columnas completas (`xl:grid-cols-5`)**.<br>• Sección inferior de `/iniciativas` (Matriz 2×2 + Metodología + Acciones rápidas) se muestra en **3 columnas (`xl:grid-cols-[1.25fr_1fr_1.15fr]`)**.<br>• Filas de los 5 criterios de evaluación muestran sus 3 bloques en línea (`xl:grid-cols-[minmax(200px,1.5fr)_180px_minmax(220px,1.5fr)]`). |

---

## 7. Referencia de Variables en `globals.css` y `@theme inline`

El archivo `apps/frontend/src/app/globals.css` es la **única hoja de estilos global** del proyecto. No contiene clases CSS manuales; únicamente declara las variables en `:root` y las expone a Tailwind CSS v4 mediante la directiva `@theme inline`.

> **Regla de uso con Tailwind CSS v4:** Cualquier variable registrada en `@theme inline` con el prefijo `--color-<nombre>` se utiliza directamente en las clases de utilidad como `bg-<nombre>`, `text-<nombre>`, `border-<nombre>`, `ring-<nombre>`, `from-<nombre>` o `to-<nombre>`. Por ejemplo, `--color-warning-500` se usa como `bg-warning-500` o `text-warning-500`.

### 7.1 Tabla Completa de Variables Globales

| Variable en `:root` | Variable en `@theme inline` | Valor | Clase Tailwind Generada (Ejemplos) | Explicación y Propósito |
| :--- | :--- | :---: | :--- | :--- |
| `--font-family` | `--font-sans` | `"Montserrat", "Figtree", ...` | `font-sans` | Fuente institucional principal aplicada en todo el `<body>`. |
| `--title-font-family` | — | `var(--font-family)` | *(Interna Vibe UI)* | Homologa los títulos de componentes `@vibe/core` a Montserrat. |
| `--h1-font-family` | — | `var(--font-family)` | *(Interna Vibe UI)* | Homologa los encabezados `h1` de `@vibe/core` a Montserrat. |
| `--font-weight-bold` | — | `700` | `font-bold` | Corrige la sobreescritura de `@vibe/core/tokens` (que define bold en `500`) para garantizar negritas reales (`700`). |
| `--brand-primary` | `--color-brand-primary` | `#833177` | `bg-brand-primary`, `text-brand-primary`, `border-brand-primary` | Morado institucional primario de Liverpool / DevCycle. |
| `--brand-primary-hover` | `--color-brand-primary-hover` | `#6e2462` | `hover:bg-brand-primary-hover`, `hover:border-brand-primary-hover` | Tono morado oscuro para el estado `hover` de botones primarios. |
| `--brand-primary-active` | `--color-brand-primary-active` | `#581b4e` | `active:bg-brand-primary-active` | Tono morado profundo para el estado `on-click / active`. |
| `--brand-primary-light` | `--color-brand-primary-light` | `#f5edf5` | `bg-brand-primary-light`, `hover:bg-brand-primary-light` | Fondo lavanda claro para hovers de botones outlined, pestañas activas e íconos. |
| `--brand-primary-soft` | `--color-brand-primary-soft` | `#fbf2f7` | `bg-brand-primary-soft` | Fondo rosado/morado muy tenue para banners de asistencia IA. |
| `--brand-primary-border` | `--color-brand-primary-border` | `#f2d8ec` | `border-brand-primary-border` | Borde morado pastel para tarjetas resaltadas y cajas de resumen. |
| `--brand-accent` | `--color-brand-accent` | `#e6007e` | `bg-brand-accent`, `text-brand-accent`, `border-brand-accent` | Rosa Liverpool para CTAs principales, barras de avance e indicadores clave. |
| `--brand-accent-dark` | `--color-brand-accent-dark` | `#b30079` | `hover:bg-brand-accent-dark` | Tono rosa oscuro para el estado `hover` de botones CTA. |
| `--brand-accent-active` | `--color-brand-accent-active` | `#8f0060` | `active:bg-brand-accent-active` | Tono rosa intenso para el estado `on-click / active` de botones CTA. |
| `--brand-magenta` | `--color-brand-magenta` | `#b52670` | `bg-brand-magenta`, `border-brand-magenta`, `text-brand-magenta` | Color magenta para bordes activos, badges e íconos de Backlog y Priorización. |
| `--brand-magenta-hover` | `--color-brand-magenta-hover` | `#961e5c` | `hover:bg-brand-magenta-hover` | Estado `hover` para controles interactivos magenta. |
| `--brand-magenta-active` | `--color-brand-magenta-active` | `#7a174a` | `active:bg-brand-magenta-active` | Estado `on-click / active` para controles interactivos magenta. |
| `--brand-magenta-text` | `--color-brand-magenta-text` | `#9d2469` | `text-brand-magenta-text` | Color de fuente magenta para títulos destacados (ej. "Backlog por priorizar"). |
| `--brand-magenta-bg` | `--color-brand-magenta-bg` | `#fdf5f9` | `bg-brand-magenta-bg` | Fondo pastel magenta para tarjetas KPI de Backlog y Etapa 1. |
| `--brand-magenta-border` | `--color-brand-magenta-border` | `#f3c5de` | `border-brand-magenta-border` | Borde pastel magenta para tarjetas y filas seleccionadas. |
| `--color-text-heading` | `--color-text-heading` | `#1e2022` | `text-text-heading`, `bg-text-heading` | Gris carbón casi negro para títulos `h1`–`h4`, métricas y fondo de toasts. |
| `--color-text-main` | `--color-text-main` | `#383838` | `text-text-main` | Color de texto principal de alto contraste para lectura general. |
| `--color-text-secondary` | `--color-text-secondary` | `#676879` | `text-text-secondary` | Gris medio (Monday Vibe) para subtítulos, áreas y cabeceras de tabla. |
| `--color-text-muted` | `--color-text-muted` | `#8c8d98` | `text-text-muted` | Gris suave para metadatos secundarios, horas y textos deshabilitados. |
| `--color-border` | `--color-border-default` | `#e6e9ef` | `border-border-default` | Borde estructural estándar de tarjetas, header y contenedores. |
| `--color-border-subtle` | `--color-border-subtle` | `#f0f2f7` | `border-border-subtle` | Borde divisorio ligero para listas de pendientes y secciones internas. |
| `--color-border-input` | `--color-border-input` | `#dcdfe4` | `border-border-input` | Borde estándar en reposo para inputs, selects y textareas. |
| `--bg-page` | `--color-bg-page` | `#f6f7fb` | `bg-bg-page` | Gris azulado muy claro para el fondo general de la aplicación. |
| `--bg-card` | `--color-bg-card` | `#ffffff` | `bg-bg-card` | Blanco puro para tarjetas, paneles, modales e inputs. |
| `--bg-surface-soft` | `--color-surface-soft` | `#fbfbfd` | `bg-surface-soft` | Blanco cálido suave para sub-tarjetas, dropzones y burbujas de asistente. |
| `--color-info-500` | `--color-info-500` | `#0284c7` | `bg-info-500`, `text-info-500`, `border-info-500` | Azul semántico para situaciones de **Información** (estado Default). |
| `--color-info-600` | `--color-info-600` | `#0369a1` | `hover:bg-info-600` | Azul semántico para estado **On-Hover** en botones de información. |
| `--color-info-700` | `--color-info-700` | `#075985` | `active:bg-info-700` | Azul semántico para estado **On-Click / Active** en botones de información. |
| `--color-success-500` | `--color-success-500` | `#059669` | `bg-success-500`, `text-success-500`, `border-success-500` | Verde semántico para situaciones de **Éxito / Aprobación** (estado Default). |
| `--color-success-600` | `--color-success-600` | `#047857` | `hover:bg-success-600` | Verde semántico para estado **On-Hover** en botones de confirmación/éxito. |
| `--color-success-700` | `--color-success-700` | `#065f46` | `active:bg-success-700` | Verde semántico para estado **On-Click / Active** en botones de éxito. |
| `--color-warning-500` | `--color-warning-500` | `#d97706` | `bg-warning-500`, `text-warning-500`, `border-warning-500` | Naranja/Ámbar para situaciones de **Advertencia / Emergencia** (estado Default). |
| `--color-warning-600` | `--color-warning-600` | `#b45309` | `hover:bg-warning-600` | Naranja/Ámbar para estado **On-Hover** en botones de advertencia. |
| `--color-warning-700` | `--color-warning-700` | `#92400e` | `active:bg-warning-700` | Naranja/Ámbar para estado **On-Click / Active** en botones de advertencia. |
| `--color-danger-500` | `--color-danger-500` | `#dc2626` | `bg-danger-500`, `text-danger-500`, `border-danger-500` | Rojo semántico para situaciones de **Error / Peligro / Rechazo** (estado Default). |
| `--color-danger-600` | `--color-danger-600` | `#b91c1c` | `hover:bg-danger-600` | Rojo semántico para estado **On-Hover** en botones de error/peligro. |
| `--color-danger-700` | `--color-danger-700` | `#991b1b` | `active:bg-danger-700` | Rojo semántico para estado **On-Click / Active** en botones de error/peligro. |
| `--status-green-bg` / `text` / `border` | `--color-status-green-bg` / `text` / `border` | `#e6f7ee` / `#059669` / `#a7f3d0` | `bg-status-green-bg`, `text-status-green-text`, `border-status-green-border` | Trío de tokens para pills y banners de estado **Finalizado / Aprobado**. |
| `--status-red-bg` / `text` / `border` | `--color-status-red-bg` / `text` / `border` | `#fde8e8` / `#dc2626` / `#fca5a5` | `bg-status-red-bg`, `text-status-red-text`, `border-status-red-border` | Trío de tokens para pills y banners de estado **Atrasado / Error**. |
| `--status-orange-bg` / `text` / `border` | `--color-status-orange-bg` / `text` / `border` | `#fff7ed` / `#d97706` / `#fed7aa` | `bg-status-orange-bg`, `text-status-orange-text`, `border-status-orange-border` | Trío de tokens para pills y banners de estado **En Proceso / Refinamiento**. |
| `--status-blue-bg` / `text` / `border` | `--color-status-blue-bg` / `text` / `border` | `#f0f9ff` / `#0284c7` / `#bae6fd` | `bg-status-blue-bg`, `text-status-blue-text`, `border-status-blue-border` | Trío de tokens para pills y banners de estado **Por Iniciar / Información**. |
| `--status-purple-bg` / `text` / `border` | `--color-status-purple-bg` / `text` / `border` | `#f5eef5` / `#833177` / `#e9d5e8` | `bg-status-purple-bg`, `text-status-purple-text`, `border-status-purple-border` | Trío de tokens para pills de **Rol institucional, Cartera activa y Madurez**. |
| `--status-gray-bg` / `text` / `border` | `--color-status-gray-bg` / `text` / `border` | `#f1f3f5` / `#6c757d` / `#e2e5ea` | `bg-status-gray-bg`, `text-status-gray-text`, `border-status-gray-border` | Trío de tokens para pills **Neutras, Prioridad estándar y campos de Sistema**. |
| `--app-header-height` | `--spacing-header` | `58px` | `h-header`, `top-header` | Altura estándar de la barra superior fija y desplazamiento de paneles laterales/menú. |
| `--app-copilot-width` | `--spacing-copilot` | `360px` | `w-copilot` | Ancho estándar del panel lateral del asistente Copilot. |
