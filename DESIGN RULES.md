# DESIGN RULES
### Insurance Agent OS

---

> Este documento recoge las reglas de diseño del proyecto, construidas a partir de referencias visuales analizadas imagen a imagen.

---

## 00 · SISTEMA DE COLOR & TIPOGRAFÍA OFICIAL

> ✅ Paleta definitiva. Estas son las únicas variables de color y tipografía permitidas en todo el proyecto.

---

### 🎨 PALETA DE COLORES

#### Fondos & Superficies (Base Neumórfica)
| Nombre | Hex | Uso |
|---|---|---|
| **Background Principal** | `#EFF2F9` | Fondo base de toda la app — blanco aperlado/gris muy frío |
| **Surface 1** | `#E4EBF1` | Superficie de cards, sidebar, inputs |
| **Surface 2** | `#B5BFC6` | Bordes sutiles, separadores, placeholders |
| **Deep Blue** | `#6E7F8D` | Textos secundarios, íconos inactivos, labels |

#### Sombras Neumórficas (valores exactos)
| | Color | Opacidad | Uso |
|---|---|---|---|
| **Shadow Light** | `#FAFBFF` | 100% | Sombra clara — arriba/izquierda |
| **Shadow Dark** | `#161B1D` | 23% | Sombra oscura — abajo/derecha |

**Valores CSS de sombra por nivel:**

```css
/* Nivel SM — Componentes pequeños (botones, inputs) */
box-shadow:
  -5px -5px 10px #FAFBFF,
   5px  5px 10px rgba(22, 27, 29, 0.23);

/* Nivel MD — Cards estándar */
box-shadow:
  -10px -10px 20px #FAFBFF,
   10px  10px 20px rgba(22, 27, 29, 0.23);

/* Nivel LG — Cards destacadas, sidebar */
box-shadow:
  -20px -20px 40px #FAFBFF,
   20px  20px 40px rgba(22, 27, 29, 0.23);

/* Inset (hundido) — Inputs, campos activos, botones presionados */
box-shadow:
  inset -5px -5px 10px #FAFBFF,
  inset  5px  5px 10px rgba(22, 27, 29, 0.23);
```

#### Color de Énfasis — NARANJA (único color de acento permitido)
| Nombre | Hex | Uso |
|---|---|---|
| **Orange Accent** | `#F7941D` | Botones primarios, highlights, íconos activos, toggles ON, progress fill, punto de nav activo, badges |

> ⚠️ **REGLA ESTRICTA**: El naranja es el **único** color de énfasis del sistema. No se permiten otros colores de acento. Toda acción primaria, estado activo o elemento destacado usa naranja.

#### Colores de Estado / Alertas (solo para feedback del sistema)
| Nombre | Hex | Uso |
|---|---|---|
| **Mint / Success** | `#69A481` | Éxito, confirmación, estado activo positivo, póliza vigente |
| **Claret / Danger** | `#7C1F31` | Error, alerta crítica, rechazo, póliza vencida, riesgo alto |
| **White Smoke** | `#E7EDEB` | Fondo alternativo de alertas suaves, chips de estado neutro |

> ⚠️ **REGLA**: Mint y Claret son **exclusivamente** para estados del sistema (alertas, badges de estado, mensajes de error/éxito). **Nunca** como color de diseño decorativo o acento de UI.

#### Textos
| Rol | Color | Uso |
|---|---|---|
| **Texto principal** | `#1A1F2B` | Títulos, valores KPI, contenido primario |
| **Texto secundario** | `#6E7F8D` | Labels, subtítulos, descripciones |
| **Texto terciario / placeholder** | `#B5BFC6` | Placeholders, texto deshabilitado, fechas secundarias |
| **Texto sobre acento** | `#FFFFFF` | Texto sobre fondos naranja o dark |

---

### 🔤 TIPOGRAFÍA OFICIAL

**Fuente principal: `Questrial`**
- Una sola familia tipográfica para todo el proyecto
- Sans-serif geométrica, limpia, moderna y muy legible
- Disponible en Google Fonts

```css
font-family: 'Questrial', sans-serif;
```

#### Escala tipográfica
| Elemento | Tamaño | Peso | Color |
|---|---|---|---|
| **H1 — Título de página** | 32–40px | 400 (Questrial es una sola weight) | `#1A1F2B` |
| **H2 — Título de sección** | 24–28px | 400 | `#1A1F2B` |
| **H3 — Título de card** | 18–22px | 400 | `#1A1F2B` |
| **Valor KPI** | 28–40px | 400 | `#1A1F2B` |
| **Body / Cuerpo** | 14–16px | 400 | `#1A1F2B` |
| **Label / Caption** | 11–13px | 400 | `#6E7F8D` |
| **Placeholder** | 13–14px | 400 | `#B5BFC6` |
| **Botón** | 13–15px | 400, letter-spacing: 0.5–1px | `#FFFFFF` o `#1A1F2B` |
| **Nav item** | 13–14px | 400 | `#6E7F8D` / `#1A1F2B` activo |
| **Tabla header** | 11–12px | 400, mayúsculas, letter-spacing: 1px | `#6E7F8D` |

> **Nota:** Questrial tiene un único peso (Regular 400). La jerarquía se logra con **tamaño**, **color** y **letter-spacing**, no con bold.

---

### 🔲 TOKENS GLOBALES (variables CSS)

```css
:root {
  /* Fondos */
  --bg-base:        #EFF2F9;
  --surface-1:      #E4EBF1;
  --surface-2:      #B5BFC6;
  --deep-blue:      #6E7F8D;

  /* Sombras neumórficas */
  --shadow-light:   #FAFBFF;
  --shadow-dark:    rgba(22, 27, 29, 0.23);

  /* Acento único */
  --accent:         #F7941D;
  --accent-hover:   #E8820A;

  /* Estados */
  --success:        #69A481;
  --danger:         #7C1F31;
  --neutral-state:  #E7EDEB;

  /* Textos */
  --text-primary:   #1A1F2B;
  --text-secondary: #6E7F8D;
  --text-muted:     #B5BFC6;
  --text-on-accent: #FFFFFF;

  /* Glass */
  --glass-bg:       rgba(255, 255, 255, 0.20);
  --glass-border:   rgba(255, 255, 255, 0.30);
  --glass-blur:     blur(16px);

  /* Tipografía */
  --font-base:      'Questrial', sans-serif;

  /* Border radius */
  --radius-sm:      8px;
  --radius-md:      12px;
  --radius-lg:      20px;
  --radius-xl:      24px;
  --radius-pill:    50px;

  /* Spacing base: 8px grid */
  --space-xs:       8px;
  --space-sm:       12px;
  --space-md:       16px;
  --space-lg:       24px;
  --space-xl:       32px;
}
```

---

## 01 · LANDING PAGE — Estilo General

**Referencia:** 3D Glassmorphism Landing Page

### Estilo Visual
- Estética **3D Glassmorphism** — moderna, profunda, aireada
- Sensación de **flotación y profundidad** en todos los elementos decorativos
- Diseño **minimalista** con mucho espacio en blanco/neutro
- Atmósfera **premium y sofisticada**

### Layout
- Navegación superior: `LOGO (izquierda)` + `Links de nav (derecha)` separados por pipes ` | `
- Contenido principal centrado en la mitad inferior de la pantalla
- **Panel glass central**: contenedor translúcido con borde sutil (efecto vidrio) que agrupa título, descripción y CTA
- Elementos 3D decorativos **fuera del panel**, flotando libremente en el fondo

### Elementos Decorativos 3D
- **Esferas** sólidas 3D — tamaños variados (grande, mediano, pequeño)
- **Anillos/toros** 3D — con profundidad y sombra interior
- Distribuidos asimétricamente: esquina superior derecha, izquierda media, inferior derecha
- Efecto **blur/desenfoque** en los elementos más cercanos al borde (profundidad de campo)

### Panel Glass (Contenedor Principal)
- Fondo translúcido con muy baja opacidad
- Borde fino blanco/gris claro
- Sin sombra dura — efecto suave y etéreo
- Padding generoso interno

### Tipografía
- **Etiqueta superior**: pequeña, espaciado amplio, mayúsculas (ej. `3D GLASSMORPHISM`)
- **Título principal**: grande, bold, blanco, limpio
- **Descripción**: pequeña, blanca con opacidad reducida, párrafo corto
- **Fuente**: Sans-serif moderna (estilo Helvetica / Inter / Poppins)

### Navegación
- Links en mayúsculas, tamaño pequeño, color blanco
- Separador: pipe ` | ` entre items
- Sin subrayado — hover sutil

### CTA (Call to Action)
- Botón pequeño, rectangular, borde blanco fino
- Texto en mayúsculas: `CLICK HERE`
- Estilo outline/ghost — sin relleno sólido

### Colores
- **Fondo**: `#EFF2F9` — blanco aperlado (background base)
- **Elementos 3D decorativos**: `#F7941D` naranja — esferas y anillos de acento
- **Texto**: blanco puro `#FFFFFF`
- **Bordes glass**: `rgba(255,255,255, 0.30)`
- **Tipografía**: `Questrial`

---

## 02 · LOGIN & REGISTRO — Estilo General

**Referencia:** Neumorphism Login Form

### Estilo Visual
- Estética **Neumorfismo (Neumorphism)** — suave, tridimensional, sin bordes duros
- Sensación de elementos **extruidos/hundidos desde el fondo** — como si fueran parte de la superficie
- Diseño **limpio y minimalista** con mucho espacio en blanco
- Atmósfera **suave, confiable y profesional**

### Layout
- Formulario **centrado** en pantalla, tanto horizontal como verticalmente
- **Card principal** con esquinas muy redondeadas y sombras suaves doble (clara arriba-izquierda, oscura abajo-derecha) — efecto neumórfico
- Logo/avatar circular en la parte superior del card, centrado
- Nombre de la app debajo del logo: **título bold** + **subtítulo ligero**
- Campos de input apilados verticalmente con separación generosa
- Botón de acción principal ancho y prominente
- Links auxiliares centrados debajo del botón

### Card del Formulario
- Fondo: mismo tono que el fondo general (clave del neumorfismo)
- Bordes: sin borde visible — solo sombras
- Sombra: doble — `clara (arriba/izquierda)` + `oscura (abajo/derecha)`
- Border-radius: muy alto (~20–24px)
- Padding interno generoso

### Logo / Avatar
- Circular, centrado en la parte superior
- Fondo oscuro con icono/logo de la app
- Sin sombra dura — integrado al diseño

### Campos de Input
- Estilo neumórfico: **hundidos** en la superficie (inset shadow)
- Ícono a la izquierda (👤 persona para usuario / 🔒 candado para contraseña)
- Placeholder en gris suave
- Sin borde visible — solo sombra interior
- Border-radius: alto (~50px — tipo pill)
- Fondo igual al card

### Opciones de Login / Registro
- ✅ **Correo + Contraseña** (campos principales)
- ✅ **Google** — botón social con logo de Google
- ✅ **Apple** — botón social con logo de Apple
- Botones sociales: estilo secundario, outline o neumórfico, con ícono + texto

### Botón Principal (CTA)
- Ancho completo del formulario
- Color de acento de la paleta oficial (pendiente ⚠️)
- Border-radius: pill (~50px)
- Texto: `Login` o `Crear cuenta` — bold, blanco
- Sin sombra dura — gradiente suave opcional

### Links Auxiliares
- `¿Olvidaste tu contraseña?` + `or` + `Sign Up`
- Centrados, tamaño pequeño
- Color gris suave con link en color de acento

### Tipografía
- **Nombre de app**: bold, oscuro, tamaño grande
- **Subtítulo**: regular/light, gris medio, tamaño pequeño
- **Labels/Placeholders**: regular, gris claro
- **Botón**: bold, blanco o oscuro según contraste
- **Fuente**: Sans-serif moderna (Inter / Poppins / Nunito)

### Colores
- **Fondo general**: `#EFF2F9` — blanco aperlado
- **Card**: `#E4EBF1` — surface 1
- **Botón principal**: `#F7941D` — naranja acento
- **Texto principal**: `#1A1F2B`
- **Texto secundario/placeholder**: `#B5BFC6`
- **Sombras neumórficas**: clara `#FAFBFF` / oscura `rgba(22,27,29,0.23)`
- **Tipografía**: `Questrial`

---

## 03 · SISTEMA DE DISEÑO COMPLETO — Layout & Componentes

**Referencias:** Dashboard Neumórfico + Calendario Neumórfico  
**Filosofía:** *Sistema de lujo — Neumorfismo base + capas de cristal (Glassmorphism) en elementos de acento*

---

### 3.1 · FILOSOFÍA VISUAL DEL SISTEMA

- **Base**: Neumorfismo — todo emerge o se hunde suavemente de la superficie
- **Acento de lujo**: Glassmorphism — capas translúcidas, cristal y opacidades en cards destacadas, modales y widgets premium
- **Regla de oro**: Los elementos **funcionales** son neumórficos. Los elementos **de destaque/métricas/alertas** son glass
- Sensación general: **premium, aireado, sofisticado, sin ruido visual**
- Nunca bordes duros. Nunca sombras agresivas. Todo es suave

---

### 3.2 · ESTRUCTURA DE LAYOUT (Dashboard)

```
┌─────────────────────────────────────────────────────┐
│  SIDEBAR (izquierda fija)  │  ÁREA PRINCIPAL         │
│  ─────────────────────     │  ───────────────────    │
│  • Avatar + nombre         │  KPI Cards (fila)       │
│  • ID / rol                │  ─────────────────────  │
│  • Nav items               │  Gráficos (2 columnas)  │
│  • Íconos de acción        │  ─────────────────────  │
│    (settings, logout)      │  Tabla de datos         │
└─────────────────────────────────────────────────────┘
```

- **Sidebar**: fija a la izquierda, estrecha, neumórfica, card elevada
- **Área principal**: grid fluido, 12 columnas, gap generoso
- **Header opcional**: bienvenida + avatar + notificaciones + logout (fila superior derecha)
- Todo respira — padding interno mínimo `24px`, gap entre secciones mínimo `20px`

---

### 3.3 · SIDEBAR

- Fondo: mismo tono que el fondo base (neumorfismo integrado)
- Card con sombra doble neumórfica (clara arriba/izquierda, oscura abajo/derecha)
- Border-radius: `20–24px`
- **Avatar**: circular, centrado o alineado arriba, con sombra suave
- **Nombre de usuario**: bold, oscuro, tamaño medio
- **ID/Rol**: pequeño, gris suave
- **Nav items**:
  - Ícono + texto en línea
  - Item activo: botón neumórfico hundido (`inset shadow`) + punto de color o highlight de acento
  - Item inactivo: sin sombra, texto gris
  - Hover: transición suave de sombra
- **Íconos de acción** (settings, logout): neumórficos, circulares, en la parte inferior del sidebar
- Separación generosa entre grupos de nav

---

### 3.4 · KPI CARDS (Tarjetas de métricas)

- Filas horizontales en la parte superior del dashboard
- Cada card: **neumórfica** — elevada suavemente del fondo
- Contenido:
  - **Ícono** a la derecha (neumórfico, cuadrado redondeado)
  - **Label** arriba: pequeño, gris suave (`Fan Data`, `Income`, `Works`...)
  - **Valor** abajo: grande, bold, oscuro (`2387+`, `$673+`)
- Border-radius: `16–20px`
- Sin bordes visibles
- **Variante glass de lujo**: en cards de métricas destacadas → fondo translúcido con blur, borde cristal sutil

---

### 3.5 · CARDS GENERALES

**Tipo A — Neumórfica (base):**
- Fondo igual al fondo base
- Sombra doble neumórfica
- Border-radius: `20px`
- Padding: `24px`
- Sin borde

**Tipo B — Glass de lujo (acento):**
- Fondo: `rgba(255,255,255, 0.15–0.25)`
- Blur de fondo: `backdrop-filter: blur(12–20px)`
- Borde: `1px solid rgba(255,255,255, 0.3)`
- Border-radius: `20px`
- Sombra suave: `0 8px 32px rgba(0,0,0,0.08)`
- Uso: modales, widgets premium, cards de resumen ejecutivo, alertas importantes

**Tipo C — Tabla de datos:**
- Fondo neumórfico suave (hundida en la superficie)
- Filas alternadas con opacidad muy sutil
- Headers: texto pequeño, bold, gris medio, mayúsculas
- Celdas: texto regular, gris oscuro
- Sin bordes verticales — solo separadores horizontales muy sutiles

---

### 3.6 · GRÁFICOS

**Gráfico de barras:**
- Barras neumórficas: sombra suave, borde redondeado superior
- Color de barras: acento de paleta oficial (pendiente ⚠️)
- Variante: barras glass con gradiente y opacidad
- Eje Y con líneas guía muy sutiles, casi invisibles
- Labels en gris claro

**Gráfico donut/circular:**
- Estilo glass — trazo con gradiente
- Valor central: grande, bold, con símbolo (`$12,358`)
- Leyenda debajo: puntos de color + label + porcentaje
- Fondo del donut: hueco, transparente

**Filtros de tiempo** (`Last 7 Days ▼`, `All Time ▼`):
- Botón pequeño, neumórfico, con dropdown suave
- Posición: esquina superior derecha del widget

---

### 3.7 · BOTONES

**Primario (CTA principal):**
- Neumórfico elevado → al presionar: se hunde (inset)
- Color de acento sólido (paleta oficial ⚠️)
- Border-radius: pill (`50px`) o redondeado (`12px`) según contexto
- Texto bold, blanco
- Transición suave de sombra en hover/active

**Secundario:**
- Neumórfico sin relleno de color
- Texto en color de acento o gris oscuro
- Border-radius igual al primario

**Ghost / Outline:**
- Borde sutil (color de acento o blanco con opacidad)
- Fondo transparente o glass
- Para acciones terciarias

**Ícono circular (acción):**
- Botón neumórfico circular
- Solo ícono, sin texto
- Uso: settings, logout, notificaciones, compartir

**Regla general:**
- Nunca bordes duros ni sombras agresivas en botones
- Siempre transición de `0.2–0.3s ease` en hover/active

---

### 3.8 · INPUTS & FORMULARIOS

- Estilo neumórfico hundido (`inset shadow`)
- Border-radius: pill (`50px`) para inputs simples, `12px` para textareas
- Sin borde visible — solo sombra interior
- Ícono a la izquierda (opcional)
- Placeholder: gris suave
- Focus: leve highlight de acento + sombra interior más pronunciada
- Dropdowns: neumórficos, con flecha chevron, border-radius alto

---

### 3.9 · CALENDARIO & WIDGETS DE FECHA

- Grid de días: neumórfico suave, fondo integrado
- Día activo/hoy: botón neumórfico hundido o circle con color de acento
- Días de otro mes: texto muy tenue (20–30% opacidad)
- Eventos en el calendario: puntos de color bajo el número del día
- Navegación de mes: botones neumórficos circulares (`<` `>`)
- Dropdowns de mes/año: neumórficos con flecha

---

### 3.10 · LISTAS & EVENTOS

- Item de evento/lista: card neumórfica pequeña, fila horizontal
- Punto de color a la izquierda (categoría del evento)
- Texto del evento: regular, oscuro
- Hora: gris suave, tamaño pequeño
- Botón `+ Add New`: ghost/outline, neumórfico, texto con `+` prefix
- Separación entre items: gap `8–12px`

---

### 3.11 · NOTIFICACIONES & BADGES

- Badge de notificación: círculo pequeño de color de acento, posición absoluta sobre ícono
- Panel de notificaciones: card glass de lujo (Tipo B) al hacer click en ícono de campana
- Ícono de notificación: neumórfico circular en header

---

### 3.12 · TIPOGRAFÍA DEL SISTEMA

| Elemento | Peso | Tamaño | Color |
|---|---|---|---|
| Título de sección | Bold | 18–22px | Oscuro |
| Valor KPI | Bold | 24–32px | Oscuro |
| Label de card | Regular | 11–13px | Gris medio |
| Nav item activo | SemiBold | 13–14px | Oscuro / acento |
| Nav item inactivo | Regular | 13–14px | Gris suave |
| Placeholder | Regular | 13–14px | Gris claro |
| Tabla header | Bold | 11–12px | Gris medio, mayúsculas |
| Tabla celda | Regular | 13px | Gris oscuro |
| **Fuente del sistema** | — | — | **Inter / Poppins / Nunito** |

---

### 3.13 · EFECTOS & ANIMACIONES

- **Transiciones**: `0.2–0.3s ease` en todos los estados hover/active/focus
- **Sombra neumórfica** en hover de cards: ligero aumento de profundidad
- **Inset shadow** en botones/inputs al presionar: sensación táctil
- **Backdrop blur** en elementos glass: `blur(12–20px)`
- **Aparición de modales/panels**: fade + leve scale (`0.95 → 1`)
- **Gráficos**: animación de entrada suave (barras crecen, donut gira)
- Sin animaciones exageradas — todo es **sutil y elegante**

---

### 3.14 · ESPACIADO & GRID

| Concepto | Valor |
|---|---|
| Grid base | 8px |
| Padding card | 20–28px |
| Gap entre cards | 16–24px |
| Border-radius card | 16–24px |
| Border-radius botón pill | 50px |
| Border-radius botón normal | 12px |
| Border-radius input | 50px (pill) |
| Ancho sidebar | 180–220px |

---

### 3.15 · COLORES DEL SISTEMA ✅ DEFINIDOS

- **Fondo base**: `#EFF2F9` — blanco aperlado frío
- **Surface card**: `#E4EBF1`
- **Shadow Light**: `#FAFBFF` — 100% opacidad
- **Shadow Dark**: `#161B1D` — 23% opacidad
- **Acento único**: `#F7941D` — naranja (botones, activos, highlights)
- **Success**: `#69A481` — Mint (solo alertas positivas)
- **Danger**: `#7C1F31` — Claret (solo alertas críticas)
- **Glass overlay**: `rgba(255,255,255,0.20)` + `blur(16px)`
- **Texto principal**: `#1A1F2B`
- **Texto secundario**: `#6E7F8D`
- **Texto muted/placeholder**: `#B5BFC6`
- **Tipografía**: `Questrial` (Google Fonts)

---

## 04 · LAYOUTS ADICIONALES — Doble Sidebar & Médico/Timeline

**Referencias:** Dashboard con sidebar doble (íconos + panel expandido) + UI médica con timeline horizontal

### 4.1 · SIDEBAR DOBLE (Desktop avanzado)

```
┌──────┬──────────────────┬──────────────────────────────┐
│ ICON │  PANEL EXPANDIDO │   ÁREA DE CONTENIDO PRINCIPAL │
│ NAV  │  (contextual)    │                               │
│      │  • Proyectos     │   Título + métricas           │
│      │  • Status        │   Tabs + Search               │
│      │  • History       │   Contenido principal         │
│      │  • Documents     │                               │
└──────┴──────────────────┴──────────────────────────────┘
```

- **Capa 1 — Icon Rail** (izquierda extrema, ~60px ancho):
  - Fondo oscuro/dark (`#1a1a1a` o color profundo de paleta)
  - Solo íconos, sin texto
  - Ícono activo: highlight sutil (glass o acento)
  - Ícono de settings en la parte inferior
  - Separador visual entre grupos de íconos
  - Texto vertical rotado opcional para sección (`NAV`, `SETTINGS`)

- **Capa 2 — Panel expandido** (~220–260px):
  - Fondo claro neumórfico
  - Avatar + nombre + email del usuario arriba
  - Grupos con label de categoría (`Projects`, `Status`, `History`, `Documents`)
  - Items con ícono + texto + badge de número (opcional)
  - Item activo: neumórfico hundido con highlight
  - Search bar neumórfica para documentos
  - Árbol de archivos/folders con indentación y íconos de carpeta
  - Botón `+` para agregar documentos
  - Scrollable si hay muchos items

- **Área principal**:
  - Header con título de sección grande + subtítulo gris
  - KPI destacado: número grande + badge de crecimiento (`↑ 204%`) en glass de acento
  - Botón `See Report →` — ghost/outline neumórfico
  - Tabs de navegación interna: `Workflows | Permissions | Executions`
  - Tab activo: subrayado con color de acento, texto más bold
  - Search bar neumórfica para filtrar contenido
  - Área de contenido vacío: mensaje contextual + ilustración sutil

### 4.2 · UI MÉDICA / TIMELINE HORIZONTAL (Referencia de módulo de historial/actividad)

> Aplicable al módulo de historial de cliente, pipeline de ventas, o timeline de actividad del agente

- **Header de módulo**:
  - Tabs pill horizontales con ícono + texto (`Treatment Dynamics`, `Visits`, `Medications`, `Labs`, `Allergies`)
  - Tab activo: fondo sólido neumórfico elevado, texto oscuro
  - Tab inactivo: ghost, texto gris

- **Panel de info del sujeto** (izquierda):
  - Card neumórfica con datos clave en línea: Label pequeño + valor grande
  - Ejemplo: `Diagnosis: Hypertension` / `Heart Rate: 89 bpm` / `Pressure: 100/67`
  - Sub-tabs secundarios: `Office Visits | Medications | Labs | Procedures`

- **Timeline horizontal**:
  - Línea de tiempo horizontal con punto de acento (círculo de color vivo, tipo amarillo neón o acento primario)
  - Marcadores de fecha/período (`Sep | 1 Week`)
  - Cards de eventos flotando sobre/bajo la línea: neumórficas, compactas
  - Cards con título + dato principal + mini gráfico o ícono
  - Scroll horizontal para navegar el tiempo

---

## 05 · COMPONENTES UI KIT COMPLETO — Neumorphic

**Referencias:** NEU UI Kit + Mobile Neumorphic Widgets

### 5.1 · BOTONES (todas las variantes)

| Variante | Descripción |
|---|---|
| **Elevado** | Neumórfico saliente — sombra doble externa |
| **Hundido (pressed)** | Inset shadow — estado activo/presionado |
| **Flat** | Sin sombra — estado deshabilitado |
| **Con ícono** | Ícono izquierda + texto |
| **Solo ícono** | Circular o cuadrado redondeado |
| **Ghost/Outline** | Sin fondo, borde sutil |

- Tamaños: `SM (32px)` / `MD (44px)` / `LG (56px)`
- Border-radius: pill para acciones primarias, `12px` para secundarias, `16px` para grupos
- Grupos de botones: misma card neumórfica contenedora, items separados por gap

### 5.2 · SLIDERS & CONTROLES

- **Slider horizontal**: track hundido (inset) + thumb elevado (círculo neumórfico) + color de acento en la parte activa
- **Slider vertical**: igual pero orientado verticalmente — ideal para volumen, brillo, progreso
- **Progress bar**: track hundido + fill de acento con borde redondeado
- **Toggle/Switch**: pill neumórfico — off: gris / on: color de acento
- **Radio button**: círculo neumórfico — seleccionado: punto de acento interior
- **Checkbox**: cuadrado redondeado neumórfico — checked: ícono check de acento

### 5.3 · WIDGETS DE INFORMACIÓN (Mobile/Tablet)

- **Widget de reloj/fecha**:
  - Hora: bold grande, oscuro
  - Día + fecha: separados por pipe `|`, tamaño medio
  - Notificaciones: íconos neumórficos pequeños (campana, avión)

- **Widget de control rápido** (grid 2x2):
  - Card neumórfica contenedora
  - Cada control: botón circular neumórfico con ícono (WiFi, Bluetooth, Alarma, etc.)
  - Colores de acento solo en el estado activo

- **Widget de música/media**:
  - Card neumórfica
  - Título bold + artista gris
  - Progress bar de acento
  - Controles: `◀ ‖ ▶` — botones neumórficos circulares pequeños

- **Widget de clima**:
  - Ícono de clima (neumórfico, cuadrado redondeado)
  - Temperatura: bold grande
  - Descripción: regular, gris
  - Pronóstico: texto secundario pequeño

- **Widget de progreso vertical**:
  - Slider vertical neumórfico
  - Fill de color de acento (amarillo/acento primario)
  - Valor en texto dentro del fill o debajo

### 5.4 · BOTTOM NAV BAR (Mobile)

- Card neumórfica horizontal en la parte inferior
- 4–5 íconos centrados con separación igual
- Ícono activo: elevado, con punto de acento debajo o highlight
- Ícono inactivo: plano, gris suave
- Sin labels de texto (solo íconos) — o con label muy pequeño debajo
- Border-radius superior: `20–24px`

### 5.5 · TARJETAS WIDGET COMPUESTAS

- **Tarjeta con gráfico de barras vertical**:
  - Label `Peak Demand` + valor destacado
  - Barras neumórficas (algunas en acento, la actual resaltada)
  - Labels de días debajo (M T W T F S S)

- **Tarjeta de eficiencia/progreso**:
  - Label + valor (`60%`)
  - Progress bar neumórfica hundida con fill de acento
  - Fondo card neumórfico estándar

---

## 06 · VISTA MÓVIL & TABLET — Responsive Design

**Referencias:** Mobile Neumorphic UI + Tablet Dashboard

### 6.1 · PRINCIPIOS RESPONSIVE

- **Mobile first**: diseñar primero para móvil, escalar a tablet y desktop
- El sistema neumórfico se mantiene idéntico en todos los breakpoints
- Las sombras se reducen ligeramente en móvil (pantallas más pequeñas = menos profundidad)
- El glass se usa con más moderación en móvil (rendimiento)

### 6.2 · BREAKPOINTS

| Breakpoint | Rango | Layout |
|---|---|---|
| **Mobile S** | < 375px | 1 columna, sidebar oculto |
| **Mobile** | 375–767px | 1 columna, bottom nav |
| **Tablet** | 768–1024px | 2 columnas, sidebar colapsable |
| **Desktop** | 1025–1440px | Sidebar fija + grid 12 col |
| **Desktop XL** | > 1440px | Sidebar doble + grid ampliado |

### 6.3 · MOBILE LAYOUT

```
┌─────────────────────────┐
│  Header (hora, fecha,   │
│  notificaciones)        │
├─────────────────────────┤
│                         │
│   Widgets en grid       │
│   (2 columnas o full)   │
│                         │
│   Cards de contenido    │
│   (full width)          │
│                         │
├─────────────────────────┤
│  Bottom Nav Bar         │
│  (5 íconos neumórficos) │
└─────────────────────────┘
```

- **Header móvil**: hora grande (bold) + fecha + íconos de acción (pill neumórfico con puntos de color)
- **Widgets**: grid de 2 columnas con gap `16px` — cards neumórficas cuadradas o rectangulares
- **Cards full-width**: para contenido principal, listas, calendarios
- **Bottom Nav**: fija en la parte inferior, siempre visible, neumórfica

### 6.4 · TABLET LAYOUT

```
┌──────────┬──────────────────────────┐
│ SIDEBAR  │   ÁREA PRINCIPAL         │
│ (180px,  │   Header                 │
│ colaps.) │   Grid 2 columnas        │
│          │   Cards + widgets        │
└──────────┴──────────────────────────┘
```

- Sidebar colapsable a icon-rail en tablet portrait
- Sidebar expandida en tablet landscape
- Grid de 2 columnas para el área principal
- KPI cards: 2 por fila (en lugar de 4)
- Gráficos: full width o 2 columnas

### 6.5 · ADAPTACIONES NEUMÓRFICAS EN MÓVIL

- Sombras: reducidas en intensidad (`blur: 6–10px` vs `10–20px` en desktop)
- Border-radius: mantener alto pero consistente (`16–20px`)
- Touch targets: mínimo `44px` de altura para todos los elementos interactivos
- Spacing: padding interno mínimo `16px` en móvil (vs `24px` en desktop)
- Tipografía: escalar ligeramente — títulos más pequeños, mejor legibilidad

### 6.6 · GESTOS & INTERACCIONES MÓVIL

- **Swipe horizontal**: para tabs, calendarios, timelines
- **Pull to refresh**: indicador neumórfico circular
- **Long press**: menú contextual con card glass flotante
- **Swipe en items de lista**: acciones rápidas (archivar, eliminar, editar)
- **Bottom sheet**: para filtros, opciones adicionales — card neumórfica que sube desde abajo

---

## 07 · MÓDULO XORIA — Asistente Personal IA

**XORIA** es el asistente de IA integrado del Insurance Agent OS. Su interfaz sigue el mismo sistema de diseño del proyecto pero adopta el layout clásico y funcional de los mejores asistentes IA (GPT, Claude, Manus).

### 7.1 · LAYOUT GENERAL

```
┌──────────────────────────────────────────────────────┐
│  HEADER: Logo XORIA + estado (online) + acciones     │
├────────────────┬─────────────────────────────────────┤
│                │                                      │
│  SIDEBAR       │   ÁREA DE CHAT PRINCIPAL             │
│  HISTORIAL     │                                      │
│                │   [Mensajes del usuario]             │
│  • Hoy         │   [Respuestas de XORIA]              │
│  • Ayer        │                                      │
│  • Esta semana │   ...                                │
│  • Anteriores  │                                      │
│                │                                      │
│  [+ New Chat]  ├─────────────────────────────────────┤
│                │   INPUT BAR (fija abajo)             │
└────────────────┴─────────────────────────────────────┘
```

### 7.2 · SIDEBAR DE HISTORIAL

- Fondo neumórfico — misma superficie que el sistema
- **Botón `+ New Chat`**: prominente, en la parte superior, color de acento primario, pill o redondeado
- **Grupos por tiempo**: `Hoy`, `Ayer`, `Esta semana`, `Anteriores` — labels de categoría en gris pequeño y mayúsculas
- **Item de conversación**:
  - Neumórfico hundido cuando está activo
  - Texto truncado (1 línea) con el título/resumen del chat
  - Hover: leve elevación neumórfica
  - Acción de eliminar: aparece en hover (ícono `×` a la derecha)
- Scrollable verticalmente
- Ancho: `240–280px`

### 7.3 · ÁREA DE CHAT

- Fondo: igual al fondo base del sistema (integrado, no contrasta)
- Scroll vertical de mensajes
- **Mensaje del usuario** (derecha):
  - Burbuja neumórfica elevada — alineada a la derecha
  - Border-radius asimétrico: todos los bordes redondeados excepto esquina inferior derecha (`4px`)
  - Fondo: color de acento suave o superficie neumórfica
  - Texto: oscuro, regular
  - Avatar del usuario: pequeño círculo a la derecha (opcional)

- **Respuesta de XORIA** (izquierda):
  - Burbuja glass de lujo — `backdrop-filter: blur(12px)` + borde cristal
  - Border-radius asimétrico: todos redondeados excepto esquina inferior izquierda (`4px`)
  - Fondo: `rgba(255,255,255,0.2)` — translúcido
  - Avatar de XORIA: pequeño, circular, con logo/ícono de IA — a la izquierda
  - Texto: oscuro, regular, con soporte para **Markdown** (bold, code blocks, listas)
  - **Code blocks**: fondo oscuro neumórfico hundido, fuente monospace, botón `Copy`
  - **Listas**: bullet points con punto de acento
  - **Loading/typing**: 3 puntos animados en burbuja glass

- **Separador de fecha**: centrado, texto pequeño gris (`Hoy`, `Ayer`, `12 Mar`)

### 7.4 · BARRA DE INPUT (fija en la parte inferior)

- Card neumórfica elevada, full-width del área de chat
- Border-radius: `20px` (pill grande)
- **Input de texto**:
  - Neumórfico hundido internamente
  - Placeholder: `Escribe a XORIA...`
  - Multi-línea: crece con el contenido (max ~5 líneas), luego scroll interno
- **Íconos de acción** (izquierda del input):
  - 📎 Adjuntar archivo
  - 🎤 Voz/audio
  - Neumórficos circulares pequeños
- **Botón enviar** (derecha del input):
  - Circular, color de acento, ícono `→` o `↑`
  - Neumórfico elevado — al presionar: hundido
  - Deshabilitado cuando el input está vacío (gris, plano)
- **Sugerencias rápidas** (sobre el input, solo en chat nuevo):
  - Pills neumórficas con prompts sugeridos: `¿Cómo va mi pipeline?` / `Resumen del día` / `Buscar cliente...`
  - Scroll horizontal si hay muchas

### 7.5 · HEADER DE XORIA

- Logo/nombre `XORIA` — tipografía especial o bold del sistema
- Indicador de estado: punto verde + texto `Online` / `Procesando...`
- Acciones: `Nuevo chat` (ícono) + `Configuración` (ícono) — neumórficos circulares
- En móvil: ícono de hamburguesa para mostrar/ocultar sidebar de historial

### 7.6 · ESTADOS ESPECIALES

- **Estado vacío (nuevo chat)**:
  - Centro del área: logo grande de XORIA con animación sutil (pulso suave)
  - Texto de bienvenida: `Hola [nombre], soy XORIA. ¿En qué te ayudo hoy?`
  - Grid de acciones rápidas: 4 cards neumórficas con íconos — `Analizar cliente`, `Ver pipeline`, `Redactar propuesta`, `Resumen diario`

- **Estado cargando respuesta**:
  - Burbuja glass con 3 puntos animados (bounce suave)
  - Indicador sutil en el header: `XORIA está escribiendo...`

- **Estado de error**:
  - Burbuja con borde de color de alerta suave
  - Mensaje de error + botón `Reintentar` — ghost neumórfico

- **Estado de error**:
  - Burbuja con borde de color de alerta suave
  - Mensaje de error + botón `Reintentar` — ghost neumórfico

### 7.7 · MÓVIL — XORIA

- Sidebar de historial: oculta por defecto, se abre como drawer desde la izquierda (overlay glass)
- Input bar: fija en la parte inferior, sobre el bottom nav (o reemplaza al bottom nav en el módulo XORIA)
- Burbujas: max-width `85%` del viewport
- Header compacto: solo logo XORIA + ícono de historial + ícono de nuevo chat

---

## 08 · SISTEMA DE ICONOGRAFÍA

**Referencia:** Iconos duotono glass — naranja + gris translúcido

---

### 8.1 · ESTILO DE ÍCONOS

- **Estilo**: Duotono con efecto glass/translúcido
- **Dos capas de color**:
  - Capa base: `#F7941D` naranja — forma principal del ícono
  - Capa superior: gris plateado translúcido (`#B5BFC6` con opacidad 60–80%) — superpuesta con efecto glass
- **Forma**: geométrica, redondeada, sin detalles finos ni líneas delgadas
- **Sin contornos** (no outline icons) — siempre filled/sólido con las dos capas
- El efecto glass de la capa gris da profundidad y lujo sin agregar color extra

### 8.2 · REGLAS DE USO

> **REGLAS ABSOLUTAS — SIN EXCEPCIONES:**

- **CERO emojis** en toda la interfaz — ni en UI, ni en contenido, ni en mensajes del sistema
- **CERO colores fuera de la paleta oficial** en íconos — solo `#F7941D` (naranja) y `#B5BFC6` (gris) con sus opacidades
- **CERO rosa, morado, lila, turquesa, azul brillante** ni ningún color no definido en el sistema
- Los íconos de estado usan: `#69A481` Mint (éxito) o `#7C1F31` Claret (error) — solo en contextos de alerta
- **NUNCA** usar íconos de colores aleatorios para decorar — el color es funcional, no decorativo

### 8.3 · LIBRERÍA DE ÍCONOS BASE

Íconos confirmados del sistema (estilo duotono glass):

| Ícono | Nombre | Uso en IAOS |
|---|---|---|
| Contrast | Contrast | Modo claro/oscuro, configuración visual |
| Popsicle | Popsicle | — (decorativo/vacío de estado) |
| Zap | Zap | Acciones rápidas, automatizaciones, XORIA |
| Stack | Stack | Módulos, capas, productos apilados |
| File | File | Documentos, pólizas, contratos |
| Map Pin | Map Pin | Ubicación del cliente, zona geográfica |
| Image | Image | Adjuntos, galería, documentos con foto |
| Mail | Mail | Email, comunicaciones, bandeja |
| User | User | Perfil, cliente, agente |
| Check | Check | Tarea completada, póliza vigente, confirmación |
| Send | Send | Enviar mensaje, acción de XORIA, propuesta enviada |
| Bag | Bag | Productos, cotizaciones, ventas |
| Payment | Payment | Pagos, primas, facturación |
| Messaging | Messaging | Chat, XORIA, comunicación interna |

### 8.4 · LIBRERÍA RECOMENDADA

- **Lucide Icons** — librería open source, estilo limpio, sin opinionated colors
- **Phosphor Icons** — variantes filled y duotone nativas
- Aplicar colores del sistema manualmente sobre los SVGs
- Tamaños estándar: `16px` / `20px` / `24px` / `32px` / `48px`

### 8.5 · ÍCONOS EN COMPONENTES

| Componente | Ícono | Color |
|---|---|---|
| Nav activo | Específico de módulo | `#F7941D` naranja |
| Nav inactivo | Específico de módulo | `#B5BFC6` gris |
| Botón primario | Opcional, derecha o izquierda | `#FFFFFF` blanco |
| Input username | User | `#B5BFC6` gris |
| Input password | Lock/Bag | `#B5BFC6` gris |
| Badge éxito | Check | `#69A481` mint |
| Badge error | X / Alert | `#7C1F31` claret |
| XORIA (logo) | Zap o Stack | Duotono naranja+gris |
| Bottom nav activo | Específico | `#F7941D` naranja |
| Bottom nav inactivo | Específico | `#B5BFC6` gris |
| KPI card | Específico de métrica | Duotono naranja+gris |
| Settings | Gear/Sliders | `#6E7F8D` deep blue |
| Notificaciones | Bell | `#6E7F8D` deep blue, badge `#F7941D` |

### 8.6 · LO QUE NUNCA SE HACE

- No emojis (nunca, jamás, en ningún contexto de la UI)
- No íconos de colores fuera de la paleta
- No mezclar estilos de íconos (outline + filled + duotono juntos)
- No íconos decorativos sin función clara
- No colores rosa, morado, lila, cian, azul eléctrico, verde lima, ni ningún color no definido
- No degradados multicolor en íconos
- No íconos animados con colores fuera de paleta

---
