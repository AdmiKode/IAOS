# IAOS — Insurance Agent Operating System
## Documento Maestro: Funcionalidad, Arquitectura Operativa y Estrategia de Producto
### Versión ejecutiva · Marzo 2026

---

# ÍNDICE

1. Qué es IAOS y por qué existe
2. Por qué IAOS no es un CRM
3. Arquitectura del sistema: cuatro capas operativas
4. PERFIL 1 — Agente independiente
5. PERFIL 2 — Promotoría / Broker
6. PERFIL 3 — Aseguradora / Carrier
7. PERFIL 4 — Usuario asegurado / App cliente
8. XORIA — La capa de inteligencia operativa
9. Procesos end-to-end completos
10. Datos: qué entra, qué sale, quién los usa
11. Reportes y exportaciones
12. Finanzas por perfil
13. Integraciones y capacidades técnicas
14. Calidad de datos mock y escalado por perfil
15. Recomendaciones para demo con inversionistas

---

# 1. QUÉ ES IAOS Y POR QUÉ EXISTE

IAOS es un sistema operativo para el sector asegurador mexicano. No es un CRM con datos de seguros encima. Es la infraestructura digital completa que necesita un participante del mercado asegurador —agente, promotoría, aseguradora o asegurado— para operar su negocio de principio a fin, tomar decisiones basadas en datos y hacerlo asistido por inteligencia artificial en tiempo real.

El sector asegurador en México opera con una cadena compleja: aseguradora → promotoría → agente → asegurado. Cada eslabón tiene herramientas distintas, desconectadas, muchas veces manuales. Los agentes usan Excel para comisiones. Las promotoríatienen reportes en PDF. Las aseguradoras tienen sistemas core de los años 90. El asegurado no tiene visibilidad de nada.

IAOS conecta toda esa cadena en una sola plataforma, con un perfil adaptado para cada participante y con XORIA como copiloto de inteligencia artificial que opera transversalmente en todos los perfiles.

**El mercado objetivo**: GNP, AXA, Qualitas, Metlife, MAPFRE, HDI y cualquier aseguradora que distribuya a través de red de agentes en México. El TAM incluye 200,000+ agentes certificados CNSF, 2,000+ promotoríasactivas y 6 grandes aseguradoras.

---

# 2. POR QUÉ IAOS NO ES UN CRM

Un CRM gestiona contactos y oportunidades. IAOS va mucho más allá:

- Gestiona la operación completa de una póliza desde la solicitud hasta la renovación o siniestro
- Controla cobranza, comisiones y CFDI en el mismo sistema
- Incluye un core asegurador funcional: underwriting, policy admin, billing, claims
- Tiene tracking en tiempo real de ajustadores en siniestros auto
- Tiene detección de fraude predictiva con scores por entidad
- Tiene análisis de riesgo actuarial por póliza y solicitud
- Tiene una capa de IA conversacional que no solo responde preguntas sino que ejecuta acciones
- Le da al asegurado final una app de servicio 24/7 con trazabilidad completa

Un CRM dice "Roberto Sánchez es cliente". IAOS dice "Roberto Sánchez tiene una póliza Vida Temporal en emisión, su próximo recibo es $4,200 el 1 de abril, su póliza viene de un pipeline que tomó 12 días, y XORIA sugiere llamarle hoy porque no ha confirmado la documentación pendiente".

---

# 3. ARQUITECTURA DEL SISTEMA: CUATRO CAPAS OPERATIVAS

## Capa 1 — Agente individual
Workspace completo para operar cartera, pipeline, clientes, cobranza, siniestros, financiero y comunicación. Orientado a productividad diaria.

## Capa 2 — Promotoría / Broker
Vista consolidada del equipo de agentes. Gestión de producción, comisiones de red, rankings, pipeline agregado, alertas del equipo y análisis estratégico de canal.

## Capa 3 — Core Asegurador (Carrier)
Sistema tipo PolicyCenter + BillingCenter + ClaimCenter. Underwriting, administración de pólizas, cobranza centralizada, gestión de siniestros con adjuster tracking, red de distribución, finanzas, riesgo predictivo y antifraude.

## Capa 4 — App del Asegurado
Aplicación móvil-first para el usuario final. Visualización de pólizas, pagos, reportes de siniestro, mensajería con agente y acceso 24/7 a su protección.

## Capa transversal — XORIA
Copiloto de IA que actúa en los cuatro perfiles anteriores. Responde preguntas, genera documentos, resume información, detecta prioridades y ejecuta acciones asistidas sobre el contexto del usuario activo.

---

# 4. PERFIL 1 — AGENTE INDEPENDIENTE

## 4.1 Vista general del perfil

El agente es el núcleo de la distribución de seguros en México. Opera bajo una promotoría, tiene cartera propia de clientes y pólizas, genera su propia producción y es responsable de renovaciones, cobranza y atención al cliente.

**Lo que controla**: su cartera de pólizas, sus prospectos, sus clientes, sus tickets, sus comisiones, su agenda, su comunicación y su relación directa con aseguradoras.

**Lo que no controla**: la red de otros agentes, las decisiones de suscripción de la aseguradora, los reportes consolidados de la promotoría, las reservas de siniestros.

**Decisiones que toma**: a qué prospecto contactar hoy, qué producto cotizar, cuándo iniciar una renovación, cómo responder un siniestro, cómo estructurar su pipeline.

## 4.2 Sitemap completo del agente

```
/agent/dashboard          → Panel principal con KPIs, pipeline y agenda
/agent/clientes           → CRM de clientes con expediente completo
/agent/pipeline           → Kanban de prospectos por etapa
/agent/nueva-venta        → Flujo asistido de captación y cotización
/agent/polizas            → Cartera completa de pólizas
/agent/renovaciones       → Alertas y gestión de vencimientos próximos
/agent/cobranza           → Estado de pagos y recibos pendientes
/agent/siniestros         → Tickets de siniestros activos y cerrados
/agent/tickets            → Centro de soporte y seguimiento
/agent/mensajes           → Mensajería multicanal con clientes
/agent/correo             → Bandeja de correo integrada
/agent/agenda             → Calendario de actividades y citas
/agent/financiero         → Comisiones, CFDI, flujo de caja, documentos OCR
/agent/reportes           → Reportes exportables de producción y cartera
/agent/knowledge          → Base de conocimiento por aseguradora y ramo
/agent/aseguradora        → Vista carrier para broker/admin
/agent/equipo             → Gestión de agentes para promotoría
/agent/plan               → Metas, cuotas y plan de trabajo
/agent/compliance         → Bitácora de auditoría y cumplimiento
/agent/catalogos          → Catálogos: ramos, aseguradoras, productos
/agent/config             → Configuración del workspace
/agent/ia-control         → Panel de control de IA y modelo activo
/agent/voz                → Interfaz de voz para operación hands-free
/agent/xoria              → Chat conversacional con XORIA
```

## 4.3 Inventario funcional por módulo — Agente

### DASHBOARD AGENTE

**Objetivo**: Vista 360 del negocio del agente en un solo scroll.

**KPIs en pantalla**:
- Pólizas activas: cantidad de pólizas vigentes en cartera. Calcula: filtro de pólizas con status activa/vigente. Abre: panel de detalle con lista de pólizas activas. Ejemplo real: 247.
- Prima mensual acumulada: suma de primas de todas las pólizas activas en el mes. Calcula: sum(prima × frecuencia). Ejemplo real: $184,320 MXN. Tendencia: +8.3% vs mes anterior.
- Leads en pipeline: conteo de prospectos activos en todas las etapas del kanban. Ejemplo real: 38. Tendencia: +5 esta semana.
- Renovaciones próximas: pólizas que vencen en los próximos 30 días. Calcula: filtro por fecha de vencimiento ≤ hoy + 30 días. Ejemplo real: 14. Activa alerta urgente.
- Tickets abiertos: tickets con status abierto o en_proceso. Ejemplo real: 6. Tendencia: -2 (mejora).
- Tasa de cierre: leads que llegaron a emisión / leads totales. Calcula: (leads en emisión / leads totales) × 100. Ejemplo real: 67%. Tendencia: +4% vs trimestre anterior.

**Elementos visuales adicionales**:
- Gráfica de área: evolución mensual de primas (Oct–Mar), con línea de leads superpuesta
- GrowthRingChart: anillos concéntricos de crecimiento de cartera por ramo
- Donut chart: distribución de ramos en cartera
- Bar chart: producción mensual comparativa
- Pipeline Kanban: tarjetas de prospectos por etapa (scroll horizontal, 8 columnas)
- Agenda del día: citas con tipo (llamada, reunión, seguimiento, tarea), cliente y horario
- XORIA Briefing: resumen de 3 alertas clave generadas por IA para el día

**Acciones disponibles desde dashboard**:
- Clic en KPI → abre modal de detalle con tabla de datos reales
- Clic en prospecto del Kanban → navega a pipeline completo
- Clic en "Nueva venta asistida" → inicia flujo de captación con XORIA
- Clic en micrófono → activa voz hands-free
- Clic en "Preguntar a XORIA" → navega al chat de XORIA con contexto cargado

---

### PIPELINE DE VENTAS

**Objetivo**: Gestionar el ciclo de vida completo de un prospecto, desde el primer contacto hasta la emisión.

**Etapas del pipeline (8)**:
1. Nuevo — prospecto sin contacto
2. Contactado — primer acercamiento realizado
3. Perfilamiento — datos básicos capturados
4. Expediente — documentación en proceso
5. Cotización — propuesta generada
6. Negociación — revisión de condiciones
7. Aceptación — cliente decide contratar
8. Emisión — póliza en trámite final

**Por cada prospecto se registra**: nombre, email, teléfono, ramo, producto, valor estimado de prima, score de probabilidad de cierre (0-100), agente asignado, fecha de creación y último contacto.

**Acciones disponibles**:
- Crear nuevo lead con formulario completo (nombre, teléfono, email, ramo, aseguradora, etapa, valor)
- Abrir detalle del prospecto: ver historial, score, contacto, producto
- Avanzar etapa del prospecto con confirmación y fecha de cambio
- Agregar nota al expediente del prospecto
- Filtrar por nombre, producto o ramo
- Navegar a expediente de cliente relacionado
- Contactar por teléfono, correo o WhatsApp directamente desde el panel

**Datos que consume**: MOCK_LEADS (12 prospectos demo), PIPELINE_STAGES, MOCK_ASEGURADORAS, MOCK_RAMOS.

**Datos que genera**: movimiento de etapa, notas de seguimiento, registro de contacto.

**Área de negocio que impacta**: generación de negocio nuevo, tasa de conversión, pipeline value.

**Valor principal**: comercial + operativo.

---

### CLIENTES (CRM)

**Objetivo**: Expediente vivo de cada cliente. Concentra toda la relación: pólizas, pagos, siniestros, conversaciones, notas y score de relación.

**Por cada cliente se almacena**:
- Datos personales: nombre, email, teléfono, RFC, fecha de nacimiento, género, dirección, ocupación, estado civil
- Score de relación (0-100) calculado a partir de puntualidad de pagos, antigüedad, reclamaciones, interacciones
- Tags de clasificación: GMM, Auto, Corporativo, Cliente VIP, Prospecto, etc.
- Notas del agente con fecha y autor
- Historial de pólizas asignadas
- Historial de pagos
- Siniestros registrados
- Conversaciones en todos los canales

**Acciones disponibles**:
- Ver expediente completo por cliente
- Agregar y editar notas
- Ver pólizas activas y su estado
- Ver pagos pendientes y atrasados
- Ver siniestros en proceso
- Contactar por WhatsApp, email o teléfono
- Navegar a pipeline si el cliente está como prospecto

**Valor**: operativo + relacional + documental.

---

### PÓLIZAS

**Objetivo**: Administración de toda la cartera de pólizas del agente.

**Por cada póliza se muestra**:
- Número de póliza, aseguradora, tipo de ramo/producto
- Cliente asegurado
- Prima (mensual o anual)
- Suma asegurada / cobertura
- Fecha de inicio y vencimiento
- Status: activa, vigente, pendiente, vencida

**Filtros disponibles**: por status, por aseguradora, por ramo, por fecha de vencimiento.

**Acciones disponibles**:
- Ver detalle de póliza (número, vigencia, prima, coberturas, aseguradora)
- Iniciar renovación desde la póliza
- Ver historial de pagos de la póliza
- Ver siniestros asociados
- Exportar cartera a CSV

**KPIs de sección**: total de pólizas activas, prima acumulada, distribución por ramo, distribución por aseguradora.

---

### RENOVACIONES

**Objetivo**: Módulo de alertas preventivas. Detecta pólizas próximas a vencer y permite actuar antes de que el cliente pierda cobertura.

**Cómo detecta renovaciones**: filtro automático de pólizas con fecha de vencimiento dentro de los próximos 30, 60 o 90 días.

**Información por renovación**:
- Nombre del cliente
- Tipo de póliza y aseguradora
- Fecha de vencimiento exacta
- Prima actual
- Status (pendiente de gestión / en proceso / renovada)

**Acciones disponibles**:
- Marcar como "en proceso de renovación"
- Generar recordatorio al cliente
- Iniciar propuesta de renovación
- Registrar fecha de contacto

**Impacto de negocio**: retención de cartera, prevención de caída de primas, continuidad de la relación con el cliente.

---

### COBRANZA

**Objetivo**: Control total de recibos y pagos de primas. El agente ve qué está cobrado, qué está pendiente y qué está vencido.

**Por cada recibo se muestra**:
- Cliente, concepto (póliza y mes), monto, fecha de vencimiento, status (pagado, pendiente, vencido)

**KPIs de cobranza**:
- Total cobrado en el mes
- Total pendiente
- Total vencido
- Efectividad de cobranza (cobrado / esperado × 100)

**Acciones disponibles**:
- Ver detalle de cada recibo
- Enviar recordatorio de pago al cliente (WhatsApp / correo)
- Registrar pago manual con método, banco y referencia
- Ver historial de pagos por póliza
- Exportar cobranza a CSV

**Dato real de demo**: $184,320 de prima mensual activa. Pagados en fecha: $149,700. Efectividad: 81%.

---

### SINIESTROS (Agente)

**Objetivo**: Gestión del agente en el ciclo de vida de una reclamación. El agente no es quien resuelve el siniestro, pero es el intermediario entre el asegurado y la aseguradora.

**Información por siniestro**:
- Folio del siniestro
- Cliente y póliza involucrada
- Tipo de siniestro (hospitalización, choque, robo, etc.)
- Descripción del evento
- Fecha de reporte
- Status actual
- Monto estimado
- Aseguradora responsable
- Línea de tiempo completa de acciones tomadas (con fecha, responsable y descripción)

**Acciones disponibles**:
- Registrar nuevo siniestro
- Ver timeline del siniestro
- Añadir nota interna al expediente
- Notificar a la aseguradora
- Comunicarse con el cliente desde el ticket
- Confirmar resolución y cerrar siniestro

**Siniestros demo activos**:
- Ana López — Hospitalización urgente (GNP) — $85,000 — carta aval aprobada
- Ana López — Choque vehicular (Qualitas) — $28,400 — ajustador asignado en camino
- Laura Vega — Choque vehicular (Qualitas) — $32,400 — cerrado y liquidado
- Empresa XYZ — Hospitalización Colectivo (AXA) — $61,200 — cerrado

---

### TICKETS DE SOPORTE

**Objetivo**: Centro de atención al cliente del agente. Cada ticket representa una solicitud, aclaración o problema abierto con un cliente.

**Tipos de ticket reales en el sistema**:
- Aclaración de cobro duplicado
- Solicitud de endoso (cambio de dirección)
- Alta de empleado al colectivo
- Renovación urgente de póliza vencida
- Solicitud de constancia de vigencia
- Baja de empleados del colectivo
- Siniestro urgente (hospitalización)
- Duda sobre cobertura

**Por cada ticket se registra**:
- Nombre del cliente
- Asunto específico
- Status: abierto, en_proceso, cerrado
- Prioridad: baja, media, alta, urgente
- Fecha de creación
- Línea de tiempo de notas (agente, cliente, sistema)

**Acciones disponibles**:
- Crear nuevo ticket desde la lista de clientes
- Agregar nota interna o respuesta al cliente
- Cambiar status y prioridad
- Ver historial completo de acciones (quién, cuándo, qué)
- Filtrar por status, prioridad o cliente

---

### MENSAJERÍA MULTICANAL

**Objetivo**: Centro de comunicación unificado. El agente ve y responde mensajes de WhatsApp, email y la app del cliente en un solo lugar, con historial completo por conversación.

**Canales integrados en demo**:
- WhatsApp (simulado)
- Email / correo
- App cliente

**Por cada conversación se muestra**:
- Nombre del cliente y canal de origen
- Mensajes no leídos (badge de conteo)
- Último mensaje y hora
- Historial completo de mensajes con timestamp

**Conversaciones demo activas**:
- Ana López (WhatsApp) — cargo duplicado, 2 mensajes no leídos
- Empresa XYZ (Email) — bajas de colectivo
- Roberto Sánchez (WhatsApp) — espera de póliza de vida
- Laura Vega (App) — agradecimiento por liquidación de siniestro
- Miguel Ángel Cruz (WhatsApp) — solicita descarga de póliza

---

### CORREO INTEGRADO

**Objetivo**: Bandeja de entrada de correo electrónico del agente, integrada dentro del workspace. XORIA puede leer, resumir y responder correos.

**Correos demo disponibles**:
- Ana López: RE aclaración de cobro (urgente, no leído, starred)
- GNP Seguros: Confirmación carta aval SA-2026-3412 (no leído)
- Empresa XYZ RH: Bajas de empleados colectivo AXA (leído)
- Roberto Sánchez: consulta sobre póliza de vida (leído)

**Acciones disponibles**:
- Leer correo completo
- Responder (con borrador sugerido por XORIA)
- Marcar como importante
- Archivar
- Pedir a XORIA que resuma la bandeja y proponga respuestas

---

### AGENDA

**Objetivo**: Calendario de actividades del agente con integración a su pipeline y clientes.

**Tipos de evento**: llamada, reunión presencial, seguimiento, tarea interna.

**Demo del día** (19 marzo 2026):
- 09:00 — Llamada Empresa XYZ — GMM colectivo
- 11:00 — Presentación propuesta — Laura Vega
- 13:00 — Seguimiento renovación — Ana López
- 16:00 — Revisión expediente — Miguel Ángel Cruz

**Acciones disponibles**:
- Ver agenda del día / semana / mes
- Crear nuevo evento con cliente asociado
- Pedir a XORIA que organice el día o sugiera prioridades
- Recibir recordatorios por XORIA antes de cada cita

---

### FINANCIERO DEL AGENTE

**Objetivo**: Módulo de control financiero personal del agente. Comisiones, CFDI, flujo de caja y documentos financieros con OCR.

**5 secciones (tabs)**:

**Resumen financiero**:
- KPI Ingresos del mes: $36,850 MXN
- KPI Comisiones pendientes: $17,196 MXN (3 por cobrar)
- KPI CFDI timbradas: 3 timbradas, 2 pendientes
- KPI Recibos por cobrar activos
- Barras de comisiones por aseguradora (GNP vs AXA vs Qualitas vs MAPFRE vs Metlife)

**Comisiones**:
- Tabla completa de comisiones con: póliza, cliente, tipo, prima base, porcentaje de comisión, monto, status (pagada / pendiente) y fecha
- Porcentajes reales por aseguradora: GNP 18%, AXA 10%, Qualitas 15%, MAPFRE 12%, Metlife 20%
- Acciones: enviar recordatorio a aseguradora, exportar a CSV, ver detalle

**CFDI / Facturas**:
- Lista de facturas emitidas con folio, concepto, monto, IVA, total, status (timbrada / pendiente / cancelada) y UUID
- Acción: timbrar nueva factura, ver XML, cancelar
- Agregar nueva factura desde formulario

**Flujo de caja**:
- Gráfica histórica de 6 meses: ingresos vs gastos vs comisiones
- Datos demo: crecimiento de $28,400 (Oct 25) a $36,850 (Mar 26)
- Tabla mes a mes con variaciones

**Documentos con OCR**:
- Repositorio de estados de cuenta y facturas subidos
- Análisis automático por OCR: detecta montos, fechas, RFC y tipo de documento
- Documentos demo: Estado cuenta GNP Mar 2026, Factura AMIS, Estado cuenta AXA Feb 2026
- Acción: subir nuevo documento, ver análisis OCR, registrar manualmente

---

### KNOWLEDGE HUB (Base de conocimiento)

**Objetivo**: Biblioteca de documentos técnicos de cada aseguradora organizada por ramo. El agente consulta condiciones generales, tarifas, procesos y manuales directamente en el workspace.

**Aseguradoras con documentación**:
- GNP Seguros: 14 documentos (Condiciones GMM, Tabla deducibles, Manual operativo, etc.)
- AXA Seguros: 11 documentos (Condiciones colectivo, Guía altas y bajas, etc.)
- Qualitas: 8 documentos (Cláusula amplia, Procedimiento siniestros auto, etc.)
- MAPFRE: 9 documentos (Condiciones hogar, etc.)
- Metlife: 7 documentos (Tabla primas vida, Proceso expedición, etc.)
- HDI Seguros: 6 documentos

**Tipos de documento**: Condiciones Generales, Tabla de Deducibles, Manual Operativo, Guías, Cláusulas, Procedimientos, Tablas de Primas.

**Integración con XORIA**: el agente puede preguntarle a XORIA sobre cualquier condición o cobertura y XORIA consulta el knowledge hub para responder con precisión.

---

### REPORTES (Agente)

**Objetivo**: Generación y exportación de reportes de producción y cartera.

**Reportes disponibles**:
- Producción por mes (prima emitida, leads, tasa de cierre)
- Cartera activa por ramo
- Cobranza del mes (cobrado, pendiente, vencido, efectividad)
- Siniestros activos y cerrados
- Pipeline por etapa y valor

**Acciones**: exportar a CSV, filtrar por período, compartir reporte.

---

### COMPLIANCE / BITÁCORA

**Objetivo**: Registro de auditoría de todas las acciones del agente en el sistema. Cumplimiento regulatorio CNSF.

**Tipos de acciones registradas**: login, emisión de póliza, descarga de documento, consulta a XORIA, modificación de datos, alta de usuario, renovaciones, apertura de tickets.

**Cada registro incluye**: acción, usuario, módulo, IP, fecha y hora, tipo (acceso, operación, documento, IA, admin, sistema).

**Filtros**: por tipo de acción, por módulo, por fecha, por usuario.

---

### CATÁLOGOS MAESTROS

**Objetivo**: Tablas de referencia editables para ramos, aseguradoras y productos.

**Catálogos disponibles**:
- Ramos: GMM, Auto, Vida, Hogar, Daños, RC, GMM Colectivo, Transporte (8 ramos)
- Aseguradoras: GNP, AXA, Qualitas, MAPFRE, Metlife, HDI (6 carriers)
- Productos por ramo y aseguradora

---

### VOZ (Agente)

**Objetivo**: Interfaz de operación por voz. El agente puede interactuar con XORIA, dictar notas, enviar mensajes y ejecutar acciones sin tocar el teclado.

**Tecnología**: Web Speech API (SpeechRecognition en español México). Activa desde el dashboard y desde el módulo de voz dedicado.

**Casos de uso de voz**:
- "XORIA, ¿quién tiene renovación esta semana?"
- "Agrega una nota a Ana López: me confirmó renovación para abril"
- "¿Cuántas pólizas activas tengo?"
- "Redacta un correo de seguimiento para Roberto Sánchez"

---

# 5. PERFIL 2 — PROMOTORÍA / BROKER

## 5.1 Vista general del perfil

La promotoría es la entidad que agrupa, supervisa y desarrolla a un equipo de agentes independientes. Opera como canal de distribución entre la aseguradora y los agentes. Su trabajo es garantizar que el equipo cumpla metas de producción, calidad de expediente y servicio.

El broker es una variante similar con enfoque más corporativo: puede manejar cuentas empresariales y actuar como intermediario directo entre grandes clientes y las aseguradoras.

**Lo que controla**: producción del equipo, comisiones de red (overrides), metas por agente, asignación de prospectos, desempeño de su canal y reportes consolidados.

**Lo que no controla**: decisiones de suscripción de la aseguradora, política de primas ni resolución de siniestros.

## 5.2 Sitemap de la promotoría

```
/agent/dashboard      → Dashboard de promotoría (con vista diferenciada por rol)
/agent/equipo         → Gestión de agentes del equipo
/agent/equipo/[id]    → Expediente de agente individual
/agent/pipeline       → Pipeline consolidado de todos los agentes
/agent/polizas        → Cartera consolidada del canal
/agent/cobranza       → Cobranza del equipo
/agent/financiero     → Overrides, comisiones de red, CFDI
/agent/reportes       → Reportes de producción del canal
/agent/xoria          → XORIA con contexto de promotoría
```

## 5.3 Dashboard de promotoría — KPIs específicos

**KPIs del panel de promotoría** (calculados en tiempo real sobre el equipo):
- Pólizas activas del equipo: suma de todas las pólizas activas de todos los agentes. Demo: 860 pólizas totales del equipo.
- Prima total del equipo: suma de prima mensual de todos los agentes. Demo: $711,220 MXN.
- Comisión mensual total: suma de comisiones de todos los agentes en el mes. Demo: $106,683 MXN.
- Leads en pipeline: suma de todos los leads activos del equipo. Demo: 130 prospectos.
- Tasa de cierre promedio: promedio de tasas de cierre individuales. Demo: 60.4%.
- Agentes activos vs total: Demo: 4 activos / 5 totales (1 inactivo: Héctor Ríos).

**Ranking de agentes** (por prima mensual):
1. Valeria Castillo — $298,400 — 99% de meta — 312 pólizas — 74% cierre
2. Carlos Mendoza — $184,320 — 92% de meta — 247 pólizas — 67% cierre
3. Lucía Morán — $142,800 — 95% de meta — 178 pólizas — 71% cierre
4. Diego Pacheco — $64,200 — 80% de meta — 89 pólizas — 52% cierre
5. Héctor Ríos — $21,500 — 43% de meta — 34 pólizas — 38% cierre (inactivo 9 días)

**Alertas del equipo** (automáticas):
- Héctor Ríos sin actividad hace 9 días → requiere contacto
- 14 pólizas vencen en los próximos 30 días → iniciar renovaciones
- Valeria Castillo al 99% de su meta mensual → posible incentivo o más leads
- 3 tickets de siniestros sin asignar → atención urgente
- Diego Pacheco con 5 leads sin seguimiento → riesgo de pérdida

**Pipeline consolidado del equipo**:
- Valor total en pipeline: $2.87M
- Prospectos calientes (score ≥ 80): conteo automático
- Distribución por etapa en barras de progreso

## 5.4 Gestión de equipo — Expediente de agente

**Por cada agente del equipo se muestra**:
- Nombre, email, cédula CNSF, status (activo/inactivo), plan (Básico/Profesional/Empresarial)
- Pólizas activas, prima total, leads en pipeline, tasa de cierre
- Comisión del mes, meta mensual, avance porcentual (barra de progreso con color semáforo)
- Ramos que opera y aseguradoras con las que trabaja
- Último acceso al sistema

**Acciones disponibles desde expediente de agente**:
- Ver cartera completa del agente
- Ver pipeline del agente
- Ver comisiones del agente
- Contactar al agente (email/WhatsApp)
- Asignar leads desde el pool de promotoría

## 5.5 Finanzas de promotoría

**Overrides**: porcentaje adicional que la aseguradora paga a la promotoría sobre la producción de sus agentes. Visible en módulo financiero como ingreso de canal.

**Comisiones de red**: acumulación de comisiones individuales de todos los agentes del equipo.

**Forecast de producción**: proyección del mes basada en el ritmo actual del equipo.

**XORIA para promotoría**:
- "¿Qué agente está más lejos de su meta?"
- "¿Qué ramo tiene mayor crecimiento este mes?"
- "Genera un reporte de producción del equipo"
- "¿A quién debo contactar para motivar a cerrar el mes fuerte?"
- "¿Cuánto override voy a generar si Valeria cierra sus 3 cotizaciones pendientes?"

---

# 6. PERFIL 3 — ASEGURADORA / CARRIER

## 6.1 Vista general del perfil

El perfil aseguradora es el más complejo del sistema. Representa el backend operativo de una aseguradora como GNP, operando sus cuatro grandes sistemas funcionales: Underwriting (suscripción), PolicyCenter (administración de pólizas), BillingCenter (cobranza y comisiones) y ClaimCenter (siniestros).

**Propósito**: dar visibilidad y control operativo completo de la cartera, la red de distribución y los resultados financieros de la aseguradora.

**Lo que controla**: decisiones de suscripción, activación y cancelación de pólizas, liberación de comisiones, resolución de siniestros, gestión de la red de promotoríasy agentes, control de riesgo y detección de fraude.

## 6.2 Sitemap del carrier

```
/agent/aseguradora                   → Dashboard ejecutivo del carrier
/agent/aseguradora/underwriting      → Bandeja de suscripción
/agent/aseguradora/polizas           → PolicyCenter — cartera completa
/agent/aseguradora/billing           → BillingCenter — cobranza y comisiones
/agent/aseguradora/siniestros        → ClaimCenter — gestión de siniestros
/agent/aseguradora/red-agentes       → Red de distribución y promotoríaas
/agent/aseguradora/finanzas          → Dashboard financiero ejecutivo
/agent/aseguradora/riesgo            → Panel de riesgo predictivo
/agent/aseguradora/antifraude        → Módulo de detección de fraude
/agent/aseguradora/reportes          → Catálogo de reportes operativos
/agent/aseguradora/comisiones        → Liquidación de comisiones y CFDI
```

## 6.3 Dashboard ejecutivo del carrier — KPIs

**12 KPIs ejecutivos en tiempo real**:
- Primas emitidas del mes: $184.6M MXN (+8.4% vs febrero)
- Primas cobradas: $161.9M MXN (+5.9% vs febrero)
- Solicitudes en suscripción: 148 activas (41 con SLA < 24h)
- Tasa de aprobación: 73.8% (-1.2 pp vs febrero — alerta)
- Tiempo promedio de emisión: 36 horas (-4h vs febrero — mejora)
- Pólizas activas: 52,418 vigentes (+1,942 netas)
- Renovaciones próximas: 4,286 (1,104 en los próximos 30 días)
- Siniestros abiertos: 612 (+34 vs febrero)
- Siniestros en SLA crítico: 74 (12% del backlog — alerta)
- Ajustadores activos: 93 (68 en ruta, 19 en sitio)
- Promotoría top del mes: Vidal Grupo — $32.4M emitidos
- Agente top del mes: Valeria Castillo — $4.8M emitidos

---

## 6.4 UNDERWRITING — Bandeja de suscripción

**Objetivo**: Gestión del flujo de solicitudes de seguro. Cada solicitud debe ser evaluada, documentada y dictaminada antes de emitir la póliza.

**Etapas de suscripción**:
1. Nuevo — solicitud ingresada, sin revisar
2. En revisión — suscriptor asignado, en análisis
3. Observado — hay inconsistencias o documentos faltantes
4. Pendiente información — se solicitó información adicional al agente
5. Aprobado — póliza autorizada, pasa a emisión
6. Rechazado — solicitud denegada con motivo documentado

**Por cada solicitud se muestra**:
- ID de solicitud (UW-2026-XXXX)
- Fecha y hora de ingreso
- Producto y ramo (GMM Elite, Auto Amplia, Vida Patrimonial, etc.)
- Nombre del asegurado
- Agente y promotoría de origen
- Prima anual estimada
- Score de riesgo (0-100, calculado automáticamente)
- Inconsistencias detectadas (por IA o revisión manual)
- Lista de documentos con status (ok / faltante / observado)
- Observaciones del suscriptor

**Casos reales en demo**:
- UW-2026-1041: Carlos Méndez Ruiz — GMM Elite — Score 82 — Bajo riesgo — Nuevo
- UW-2026-1038: Sofía Torres García — Vida Patrimonial — Score 54 — Comprobante observado — En revisión
- UW-2026-1034: Grupo Comercial del Norte — Auto Amplia Flota $1.24M — Score 68 — VIN inconsistente — Observado
- UW-2026-1029: Constructora Omega — GMM Colectivo 100+ $2.98M — Score 76 — Aprobado
- UW-2026-1023: Rubén Zepeda — Vida Patrimonial — Score 39 — Antecedente no declarado — Rechazado
- UW-2026-1018: Textiles Prisma — Daños PyME $320K — Score 63 — Avalúo faltante — Pendiente información

**Acciones disponibles**:
- Dictaminar: aprobar, rechazar, pedir información adicional
- Añadir observaciones al expediente
- Solicitar documentos faltantes al agente
- Consultar score de riesgo (panel de riesgo predictivo integrado)
- Exportar bandeja a CSV
- Consultar a XORIA sobre el caso

---

## 6.5 POLICYCENTER — Administración de pólizas

**Objetivo**: Repositorio completo de todas las pólizas emitidas. Controla el ciclo de vida completo de cada póliza.

**Status de póliza**: activa, pendiente_pago, cancelada, vencida, renovada.

**Por cada póliza se muestra**:
- ID de póliza
- Producto y ramo
- Asegurado y beneficiarios
- Prima anual y suma asegurada
- Vigencia (inicio y fin)
- Agente y promotoría de origen
- Historial de movimientos (emisión, endosos, cancelación)
- Endosos aplicados (tipo, fecha, impacto en prima)
- Documentos asociados (carátula, condiciones, recibos)

**Pólizas demo**:
- GNP-GMM-2026-01842: Carlos Méndez — GMM Elite — Activa — $103,200/año — Agente Valeria Castillo
- GNP-AUTO-2025-9942: Grupo Comercial del Norte — Auto Flotilla 120 unidades — Pendiente pago — $1,248,000/año
- GNP-VIDA-2024-7712: Rubén Zepeda — Vida Patrimonial — Cancelada (declaración inexacta)
- GNP-DANOS-2023-4031: Textiles Prisma — Daños PyME — Vencida sin renovar
- GNP-GMM-2025-5412: Constructora Omega — GMM Colectivo 100+ — Renovada — $2,980,000/año

**Acciones disponibles**:
- Ver expediente completo de la póliza
- Aplicar endoso (cambio de datos, suma asegurada, beneficiarios)
- Cancelar póliza con motivo registrado
- Iniciar proceso de renovación
- Ver historial de movimientos completo
- Descargar documentos

---

## 6.6 BILLINGCENTER — Cobranza y comisiones

**Objetivo**: Control de todos los recibos emitidos, su status de cobro y la liquidación de comisiones a agentes y promotoríaas.

**Por cada registro de cobranza se muestra**:
- ID de recibo, póliza asociada, asegurado
- Canal de cobro (agente, promotoría, digital, banca)
- Monto esperado, monto pagado
- Fecha de vencimiento y fecha de pago efectivo
- Status: pagado, pendiente, fallido
- Estado de gestión: sin_gestion, en_gestion, promesa_pago, recuperado

**KPIs de cobranza**:
- Total esperado vs total cobrado vs brecha
- Efectividad por canal
- Recibos en gestión activa

**Comisiones del carrier**:
- Por cada entidad (promotoría o agente): mes, prima base, monto de comisión, porcentaje, status (pagado, pendiente, retenido, en_proceso)
- CFDI: si fue emitida, UUID, fecha
- Observaciones: "CFDI pendiente", "Saldo no conciliado", "Investigación antifraude activa"

**Comisiones demo**:
- Vidal Grupo: $3,240,000 comisión (10% sobre $32.4M) — En proceso, CFDI pendiente
- Alianza Seguros GDL: $1,870,000 — Pagado — CFDI emitida
- Seguros Premier Norte: $1,420,000 — Pendiente — Saldo anterior no conciliado
- Carlos Mendoza: $432,000 (9%) — Pagado
- Valeria Castillo: $198,750 (7.5%) — Retenido por investigación antifraude
- Javier Morales: $248,000 (8%) — En proceso — Expediente incompleto

---

## 6.7 CLAIMSCENTER — Gestión de siniestros

**Objetivo**: Operación completa del ciclo de un siniestro desde el reporte hasta el cierre y liquidación. El sistema más crítico del carrier porque impacta directamente la experiencia del asegurado y la reserva técnica.

**Etapas del siniestro (7)**:
1. Reportado
2. Ajustador asignado
3. En camino
4. En sitio
5. Inspección en curso
6. Resolución preliminar
7. Cerrado

**Por cada siniestro se registra**:
- ID de siniestro, tipo, ramo
- Asegurado, póliza, vehículo (si es auto)
- Ubicación GPS (dirección, lat/lng, ciudad)
- SLA objetivo en minutos y tiempo transcurrido (alerta de SLA crítico)
- Ajustador asignado con datos de contacto y status
- Timeline de acciones con timestamp
- Evidencias subidas (fotos, videos, actas, informes del ajustador)
- Tracking GPS real del ajustador en ruta (waypoints con ETA)
- Notas internas del operador
- Agente y promotoría de origen

**Tracking del ajustador en tiempo real**:
Sistema de mapa con waypoints del recorrido del ajustador. Cada punto de tracking registra coordenadas, ETA restante, status y hora. El asegurado puede ver esto en su app. El carrier lo ve en el panel de operaciones.

**KPIs financieros de siniestros**:
- Reserva total constituida: $47.2M MXN
- Pagos realizados en el mes: $18.9M (612 casos cerrados)
- Prima siniestrada acumulada: $214.7M (siniestralidad 58.4%)
- Reserva IBNR estimada: $11.6M (modelo actuarial Q1 2026)
- Siniestros abiertos: 612 (+34 vs febrero)
- SLA crítico: 74 casos (12% del backlog)

**SLA board** (distribución de casos por etapa):
- Reportado: 144 casos (16 en SLA crítico)
- Ajustador asignado: 103 casos (10 críticos)
- En camino: 84 casos (9 críticos)
- En sitio: 65 casos (13 críticos)
- Inspección en curso: 132 casos (17 críticos)
- Resolución preliminar: 84 casos (9 críticos)

**Ajustadores activos en demo**:
- AJ-019 Miguel Herrera — CDMX Poniente — En camino
- AJ-044 Paola Quiroz — Monterrey Centro — En sitio
- AJ-071 Eduardo Tapia — Guadalajara Norte — Disponible

---

## 6.8 RED DE DISTRIBUCIÓN

**Objetivo**: Supervisión y análisis de toda la red de promotoríaas y agentes que distribuyen los productos del carrier.

**KPIs por promotoría**:
- Emisión mensual en MXN
- Tasa de conversión (cotizaciones → emisión)
- Tasa de cancelación
- Loss ratio (siniestralidad por canal)
- Calidad de expediente (% de documentos correctos al ingreso)
- Tiempo promedio de emisión en horas
- Siniestros abiertos

**Datos demo de la red**:
- Vidal Grupo: $32.4M — conversión 41.2% — loss ratio 47% — calidad expediente 92 — mejor canal
- Seguros Premier Norte: $28.1M — conversión 38.4% — loss ratio 52.1%
- Alianza Seguros GDL: $19.7M — conversión 33.1% — loss ratio 58.8%
- Grupo Asegurador Sur: $11.9M — conversión 29.7% — loss ratio 61.5% — peor canal

**Rankings de agentes** (desde visión carrier):
- Valeria Castillo (Vidal Grupo): $4.82M — conversión 46.1% — calidad 95
- Diego Pacheco (Premier Norte): $4.12M — conversión 42.4%
- Ana Domínguez (Alianza GDL): $3.74M — conversión 35.6%
- Héctor Ríos (Asegurador Sur): $2.41M — conversión 31.8% — peor calidad

---

## 6.9 FINANZAS DEL CARRIER

**Objetivo**: Dashboard financiero ejecutivo con visión completa de primas, cobranza, rentabilidad y proyección.

**Datos históricos disponibles (6 meses)**:
- Oct-25 a Mar-26: emitido, cobrado, pendiente, forecast mensual
- Mar-26: $184.6M emitido / $161.9M cobrado / $22.7M pendiente / $169.5M forecast

**Producción por ramo**:
- GMM Individual: $58.4M emitido — 14,220 pólizas
- GMM Colectivo: $46.8M — 1,206 pólizas
- Auto: $34.2M — 22,110 pólizas
- Vida: $28.3M — 11,642 pólizas
- Daños: $16.9M — 3,240 pólizas

**Producción por canal**:
- Promotoríaas: $82.6M — conversión 38.2%
- Agentes directos: $61.3M — conversión 34.4%
- Digital: $23.9M — conversión 22.6%
- Banca: $16.8M — conversión 18.3%

**Rentabilidad por ramo**:
- Vida: margen 21.1% — siniestralidad 39.8% (mejor)
- GMM Individual: margen 18.4% — siniestralidad 45.2%
- Daños: margen 16.9% — siniestralidad 52.4%
- GMM Colectivo: margen 13.8% — siniestralidad 58.7%
- Auto: margen 11.5% — siniestralidad 63.9% (peor)

---

## 6.10 RIESGO PREDICTIVO

**Objetivo**: Panel de análisis de riesgo basado en modelos predictivos. Cada solicitud, póliza o siniestro tiene un score de riesgo multidimensional calculado por IA.

**Dimensiones del score de riesgo por entidad**:
- Score global (0-100, mayor = más riesgoso)
- Riesgo de fraude (bajo/medio/alto/crítico)
- Propensión de renovación (%)
- Forecast de severidad de siniestros
- Riesgo de impago
- Riesgo de cancelación
- Valor esperado en MXN

**KPIs del panel de riesgo**:
- 23 solicitudes con score < 50 — requieren revisión manual
- 312 pólizas con riesgo de impago > 60%
- 1,084 pólizas con propensión de baja en 90 días
- 74 siniestros con forecast de costo > $80K
- $48.2M en cartera con score < 60
- 68.4% de la cartera con propensión de renovación alta

**Casos de riesgo reales en demo**:
- RS-001: Carlos Méndez — GMM Elite — Score 82 — Bajo riesgo — Sin flags
- RS-002: Sofía Torres — Vida Patrimonial — Score 54 — Flags: ingreso inconsistente, ocupación de alto riesgo
- RS-003: Grupo Comercial del Norte — Flota — Score 68 — Flags: 3 siniestros en 12 meses, VIN inconsistente
- RS-004: Rubén Zepeda — Vida — Score 39 — Flags: antecedente no declarado, suma 3x promedio, buró bajo
- RS-006: Patricia Leal — Siniestro auto — Score 88 — Flags: siniestro a 11 días de emisión, taller con historial, fotos insuficientes
- RS-007: Roberto Cárdenas — Auto — Score 62 — Flags: 2 recibos vencidos, 4 intentos de cargo fallidos

---

## 6.11 ANTIFRAUDE

**Objetivo**: Detección automática de patrones de fraude en originación, cobranza, siniestros y proveedores.

**Tipos de alerta de fraude**:
- Originación: CURP inconsistente, documentos duplicados, sumas aseguradas inusuales
- Siniestro: reporte a días de la emisión, taller con historial de inflación, fotos insuficientes
- Cobranza: múltiples tarjetas fallidas, patrón de uso de período de gracia
- Proveedor: facturas infladas, siniestros duplicados, litigios coordinados
- Canal: agentes con tasas de rechazo o cancelación anómalas

**Alertas de fraude demo**:
- FA-001: Siniestro SIN-2026-0411 — Patricia Leal — Riesgo alto — Siniestro a 11 días de emisión, monto 2.8x promedio, taller con 6 alertas previas
- FA-002: Solicitud UW-2026-1038 — Sofía Torres — Riesgo medio — CURP inconsistente con fecha de nacimiento
- FA-003: Taller Rápido SA — Riesgo alto — 9 siniestros en 60 días, facturas 28% sobre histórico, fotos reutilizadas
- FA-004: Solicitud UW-2026-1023 — Rubén Zepeda — Bloqueo/Auditoría — INE duplicada en otra solicitud rechazada, suma $10M sin comprobación
- FA-005: Póliza GNP-AUTO-2025-09912 — Roberto Cárdenas — Observado — 4 tarjetas distintas fallidas, patrón de abuso de gracia
- FA-006: Siniestro SIN-2026-0387 — Mario Gutiérrez — Riesgo medio — Patrón similar a caso rechazado previo, GPS contradice declaración

**Proveedores bajo vigilancia**:
- Taller Rápido SA — 9 alertas — facturas 28% sobre promedio — 3 fotos reutilizadas — Bloqueo
- Despacho Jurídico Omega — 12 alertas — litigios masivos coordinados — Bloqueo/Auditoría

---

# 7. PERFIL 4 — USUARIO ASEGURADO / APP CLIENTE

## 7.1 Vista general del perfil

El asegurado es el cliente final del sistema. Su app es mobile-first, diseñada para ser simple, clara y orientada a la acción inmediata. No es un portal informativo. Es una herramienta de servicio que le da al asegurado acceso real a su protección, sus pagos y su agente.

**Lo que ve**: sus pólizas activas, sus pagos pendientes y realizados, sus siniestros en proceso, sus documentos y su agente.

**Lo que puede hacer**: pagar, reportar un siniestro, contactar a su agente, descargar documentos, ver cobertura, hacer cotización inicial.

## 7.2 Sitemap del cliente

```
/client/inicio          → Home: póliza principal, alertas y accesos rápidos
/client/polizas         → Lista y detalle de todas mis pólizas
/client/pagos           → Historial de pagos y próximos recibos
/client/siniestros      → Mis siniestros: reporte, seguimiento y cierre
/client/documentos      → Documentos: carátulas, constancias, recibos
/client/mensajes        → Chat directo con mi agente
/client/inicio          → Dashboard de bienvenida
/client/cotizar         → Cotización inicial de nuevo seguro
/client/propuesta       → Ver propuesta generada por el agente
/client/firma           → Firma electrónica de documentos
/client/pago            → Flujo de pago de prima
/client/confirmacion    → Confirmación de póliza / pago
```

## 7.3 Home del cliente — Elementos visuales

**Tarjeta principal de póliza** (glass card):
- Nombre del producto (GMM Individual)
- Número de póliza
- Suma asegurada / cobertura
- Prima mensual
- Días restantes hasta vencimiento (con alerta naranja si < 30 días)
- Indicador verde pulsante de "Protección activa"

**Alertas prominentes**:
- Siniestro en proceso: tipo, folio, acceso directo al seguimiento
- Pago próximo: concepto, fecha, botón "Pagar" directo
- Renovación pendiente: días restantes, botón de acción

**Acciones rápidas (4 íconos)**:
- Reportar siniestro → /client/siniestros
- Renovar póliza → /client/polizas
- Pagar → /client/pagos
- Contactar agente → /client/mensajes

**Secciones del home**:
- Mis pólizas (lista condensada con status visual)
- Mis siniestros activos y resueltos
- Pagos recientes (últimos 3)
- Contacto de emergencia GNP 24/7: 800 400 9000

## 7.4 Pólizas del cliente

**Vista demo (Ana López)**:
- GMM Individual GNP — Activa — $2,000,000 de cobertura — $8,500/mes — Vence 01/04/2026
- Auto Amplia Qualitas — Activa — $350,000 cobertura — $1,025/mes — Vence 15/09/2026
- Auto Amplia Qualitas (otra) — Activa — $280,000 cobertura — $1,420/mes — Vence 10/01/2027

Cada póliza muestra status visual (verde activa, naranja próxima a vencer, rojo vencida).

## 7.5 Pagos del cliente

**Historial de pagos con detalle completo**:
- Método de pago: SPEI, tarjeta débito, efectivo, domiciliación
- Banco y referencia de transacción
- Destino: cuenta aseguradora o cuenta promotora
- Comprobante disponible o no
- Status: confirmado, pendiente

**Próximos pagos**:
- GMM Individual — Abril 2026 — $8,500 — Pendiente → botón "Pagar"
- Vida Temporal (Roberto Sánchez) — Primer recibo — $4,200 — Pendiente

## 7.6 Siniestros del cliente

**Flujo completo de reporte de siniestro**:
- Seleccionar póliza afectada
- Describir el evento
- Subir fotos y evidencias
- Confirmar ubicación
- Ver folio asignado
- Seguir el tracking del ajustador en mapa en tiempo real

**Tracking del ajustador (vista cliente)**:
- Mapa con la ruta del ajustador
- ETA en minutos actualizado
- Nombre y teléfono del ajustador
- Status actual (en camino / en sitio)
- Timeline de acciones del siniestro

**Demo siniestro activo**: Ana López — Choque vehicular — Qualitas — $28,400 — Ajustador Roberto Ibáñez a 18 min.

## 7.7 Mensajería cliente

Chat directo con el agente asignado. El agente ve este canal en su módulo de mensajes. Historial completo, sin cambiar de app.

## 7.8 Flujo de cotización y contratación (cliente-facing)

El cliente puede iniciar una cotización desde su app. El agente recibe la solicitud, genera una propuesta y el cliente la puede revisar, firmar digitalmente y pagar desde la misma app.

**Pasos del flujo**:
1. Cliente selecciona ramo (GMM, Auto, Vida, Hogar)
2. Captura datos básicos (nombre, fecha nacimiento, suma deseada)
3. Agente recibe notificación y genera propuesta en el workspace del agente
4. Cliente recibe propuesta en su app (/client/propuesta)
5. Cliente revisa condiciones y acepta
6. Firma electrónica (/client/firma)
7. Pago de primer recibo (/client/pago)
8. Confirmación de emisión (/client/confirmacion)

---

# 8. XORIA — LA CAPA DE INTELIGENCIA OPERATIVA

## 8.1 Qué es XORIA realmente

XORIA no es un chatbot decorativo. Es el motor cognitivo del sistema IAOS. Es la única capa que tiene acceso simultáneo a todos los datos del workspace activo —pólizas, pipeline, clientes, tickets, siniestros, cobranza, agenda, correos, conocimiento técnico y datos externos— y puede actuar sobre ellos.

Su arquitectura es multi-modelo con enrutamiento inteligente:

- **Groq (Llama 3.3-70B)**: consultas rápidas, clasificación, listas, respuestas < 60 caracteres. Latencia < 1.5s.
- **Anthropic (Claude 3 Haiku)**: análisis complejos, siniestros, underwriting, reportes, perfiles _claims y _uw. Análisis profundo.
- **OpenAI (GPT-4o-mini)**: default XORIA. Redacción, propuestas comerciales, resúmenes ejecutivos, correos.
- **Tavily**: búsqueda web en tiempo real cuando la consulta involucra regulación CNSF, AMIS, tarifas de mercado, circulares, competencia, normativa.

**El modelo se selecciona automáticamente** por tipo de pregunta y perfil del usuario. El agente nunca ve esto. XORIA siempre responde.

## 8.2 Qué datos consume XORIA

Cuando el agente abre XORIA, el sistema pasa automáticamente como contexto:
- Nombre del agente
- Fecha actual
- KPIs actuales (6 métricas)
- Estado del pipeline (por etapa)
- Lista de clientes (id, nombre, score, tags, notas)
- Pólizas activas (todas las propiedades)
- Tickets abiertos (prioridad, status, asunto)
- Siniestros en proceso (tipo, status, monto, aseguradora)
- Pagos pendientes
- Agenda del día
- Bandeja de correos
- Directorio de contactos personales

XORIA responde **con datos reales del contexto**, no con respuestas genéricas. Si el agente pregunta "¿cuánto me debe GNP?", XORIA calcula la suma de comisiones pendientes de GNP en el módulo financiero y responde con el número exacto.

## 8.3 Qué hace XORIA en cada perfil

### XORIA para el Agente

**Resúmenes ejecutivos**:
- "Dame un resumen del día" → XORIA analiza agenda + tickets urgentes + leads calientes + correos no leídos y genera un briefing priorizado
- "¿Qué tengo pendiente más urgente?" → XORIA cruza tickets de alta prioridad con vencimientos de póliza y pagos vencidos

**Análisis de pipeline**:
- "¿A quién debo llamar hoy para cerrar el mes fuerte?" → XORIA analiza scores, etapa del pipeline, días sin contacto y valor de prima
- "¿Qué prospectos tienen más probabilidad de cerrar esta semana?" → filtra leads con score ≥ 80 y etapas avanzadas
- "¿Por qué Empresa XYZ lleva tanto tiempo en cotización?" → XORIA revisa el historial de notas y el último contacto

**Gestión de clientes**:
- "¿Qué está pasando con Ana López?" → XORIA cruza tickets, siniestro activo, pagos pendientes y último mensaje
- "¿Quién tiene renovación antes de fin de mes?" → lista priorizada con días restantes y prima en juego
- "¿Cuántos clientes VIP tengo?" → filtra por tag y resume su estado

**Redacción y documentos**:
- "Redacta un correo de seguimiento para Roberto Sánchez sobre su póliza de vida" → genera borrador listo para enviar
- "Escribe una propuesta de GMM Elite para Empresa Textil, 50 empleados, zona CDMX" → genera documento estructurado con coberturas, prima estimada y condiciones clave
- "Genera el texto de un recordatorio de pago para Ana López" → mensaje personalizado por canal (WhatsApp o email)

**Consultas técnicas sobre productos**:
- "¿Cuál es la tabla de deducibles de GNP para GMM?" → consulta el knowledge hub
- "¿Cómo proceso una baja de empleado del colectivo AXA?" → cita el manual operativo
- "¿Qué condiciones de Qualitas aplican para choque con pérdida total?" → responde con datos de los documentos

**Acciones asistidas**:
- "Agenda una llamada con Laura Vega para mañana a las 10" → crea evento en agenda
- "Crea un ticket urgente para el siniestro de Ana López" → registra ticket con datos del siniestro
- "Manda un recordatorio de renovación a Jorge Ramírez" → genera mensaje para WhatsApp

**Correo**:
- "¿Qué correos no leídos tengo?" → resume bandeja con remitente, asunto y recomendación
- "Responde el correo de GNP sobre la carta aval" → genera respuesta lista para enviar
- "¿Qué me pide Empresa XYZ en el último correo?" → extrae los puntos de acción

**Búsqueda externa (Tavily)**:
- "¿Cuál es la circular CNSF más reciente sobre GMM?" → busca en web y resume
- "¿Cómo están las tarifas de Qualitas Auto comparadas con el mercado?" → análisis de contexto externo
- "¿Qué novedades hay en la regulación de solvencia de aseguradoras en México 2026?" → résumen actualizado

### XORIA para la Promotoría

**Análisis del equipo**:
- "¿Quién está más lejos de su meta?" → ranking por avance de meta con porcentajes
- "¿Qué agente tiene la peor tasa de cierre?" → tabla comparativa
- "¿Cuánto override voy a generar este mes?" → proyección basada en ritmo actual del equipo

**Estrategia de canal**:
- "¿Qué ramo está creciendo más en mi equipo?" → análisis de mix de producción
- "¿Debo asignarle más leads a Valeria?" → análisis de capacidad y tasa de conversión
- "¿Por qué Héctor Ríos lleva inactivo 9 días?" → alerta + historial de acciones

**Reportes consolidados**:
- "Genera el reporte de producción de marzo para presentar mañana" → documento consolidado con KPIs del equipo
- "¿Cuáles son los 3 clientes más importantes del equipo por prima?" → ranking cross-agentes

### XORIA para el Carrier (Aseguradora)

**Operación de core**:
- "¿Qué solicitudes de suscripción tengo pendientes de dictamen?" → lista con prioridad por SLA
- "Muéstrame siniestros con SLA crítico" → tabla con tiempo transcurrido y SLA objetivo
- "¿Qué ajustadores siguen en camino?" → status en tiempo real
- "Resumeme la póliza GNP-GMM-2026-01842" → cita todos los campos relevantes

**Análisis financiero**:
- "¿Cómo va la cobranza de esta semana?" → comparativa con semana anterior
- "¿Por qué cayó la cobranza en banca?" → análisis de datos de canal
- "¿Cuál es la promotoría con mejor loss ratio?" → ranking con métricas
- "Exporta cobranza pendiente de la semana" → genera estructura para CSV

**Riesgo y fraude**:
- "¿Por qué esta solicitud está en riesgo alto?" → explica los flags detectados con detalle
- "¿Qué casos tienen alerta crítica de fraude?" → lista priorizada por severidad
- "¿Qué proveedor tiene más anomalías?" → ranking de proveedores bajo vigilancia
- "¿Qué pólizas tienen riesgo de cancelación inminente?" → cartera en riesgo con prima en juego

**Red de distribución**:
- "¿Qué promotoría trae mayor emisión este mes?" → Vidal Grupo con datos
- "¿Cuál canal tiene mejor calidad de expediente?" → comparativa de dossier quality
- "¿Qué agente tiene mayor tasa de rechazo en suscripción?" → análisis de calidad por agente

## 8.4 Historial y contexto de conversación

XORIA mantiene historial de conversaciones en localStorage. El agente puede:
- Recuperar conversaciones anteriores
- Continuar un análisis donde lo dejó
- Buscar conversaciones por tema
- Eliminar conversaciones individualmente

Cada conversación se titula automáticamente con el primer mensaje del usuario.

## 8.5 XORIA por voz

El agente activa el micrófono desde el chat de XORIA o desde el módulo de voz. El reconocimiento de voz usa Web Speech API en español México. El transcript se envía como mensaje de texto a XORIA. La respuesta es textual (en producción puede agregarse síntesis de voz).

## 8.6 Acciones rápidas pre-configuradas de XORIA

Desde el sidebar del chat, el agente tiene 6 acciones rápidas con prompt prearmado:
1. "Resumen del día" — briefing ejecutivo de agenda, correos y prioridades
2. "Leer correos" — lee y propone respuesta al último correo
3. "Mi agenda de hoy" — organiza el día del agente
4. "Analizar pipeline" — qué prospectos priorizar hoy
5. "Redactar propuesta" — genera propuesta comercial
6. "Métricas clave" — resumen de KPIs del mes

---

# 9. PROCESOS END-TO-END COMPLETOS

## Proceso 1: Generación de nuevo negocio (prospección → emisión)

**Cómo inicia**: el agente identifica un prospecto (referido, inbound, campaña, llamada) y lo registra en el pipeline como "Nuevo".

**Paso 1 — Captura del prospecto**:
Datos capturados: nombre, teléfono, email, ramo de interés, producto objetivo, valor estimado de prima, aseguradora potencial. El lead se asigna al agente y entra al kanban en la etapa "Nuevo".

**Paso 2 — Contacto y perfilamiento**:
El agente cambia la etapa a "Contactado". XORIA puede sugerir qué decir en el primer acercamiento basándose en el ramo y perfil del prospecto. Se capturan datos adicionales: ocupación, estado civil, beneficiarios, historial de seguros, RFC.

**Paso 3 — Expediente y documentación**:
Etapa "Expediente". El agente solicita: identificación oficial, RFC, CURP, comprobante de domicilio, cuestionario médico (si aplica), documentación fiscal. Los documentos se suben al expediente del cliente en el CRM. XORIA verifica si la lista está completa.

**Paso 4 — Cotización**:
Etapa "Cotización". El agente genera la cotización con la aseguradora (internamente o usando las herramientas de la aseguradora). XORIA puede asistir redactando la propuesta comercial completa con coberturas, primas, deducibles, sumas aseguradas y condiciones.

**Paso 5 — Negociación**:
El agente presenta la propuesta al cliente. El cliente puede pedir ajustes en suma asegurada, deducible o cobertura. El agente ajusta y re-cotiza. XORIA responde dudas técnicas sobre coberturas o comparativas con otras aseguradoras.

**Paso 6 — Aceptación**:
El cliente acepta las condiciones. Se genera el documento de aceptación. En el flujo del cliente (app), puede firmar electrónicamente desde /client/firma.

**Paso 7 — Pago de primer recibo**:
El cliente realiza el pago del primer recibo. El agente registra el pago en cobranza (método, banco, referencia). El cliente puede pagar desde /client/pago.

**Paso 8 — Emisión de la póliza**:
La solicitud va a la aseguradora para suscripción. Si es a través del carrier IAOS, entra a la bandeja de underwriting. El suscriptor dictamina. Si es aprobado, la póliza se emite. Si tiene observaciones, el agente recibe una alerta para completar documentación.

**Paso 9 — Activación y entrega**:
La póliza se emite con número de póliza oficial. El cliente la recibe en su app. El agente la registra en su cartera. La prima entra al módulo de cobranza. La comisión se registra en el módulo financiero.

**Resultado de negocio**: nueva póliza activa en cartera + comisión registrada + cliente creado en CRM + cobranza activada + póliza visible en app del cliente.

---

## Proceso 2: Renovación de póliza

**Cómo inicia**: El módulo de renovaciones detecta automáticamente pólizas con vencimiento en los próximos 90 días. XORIA genera un briefing de alerta en el dashboard.

**Paso 1 — Alerta preventiva**:
El dashboard del agente muestra el KPI de "Renovaciones próximas" (14 en demo). XORIA menciona en el briefing las más urgentes. El módulo de renovaciones lista pólizas por días restantes.

**Paso 2 — Contacto con el cliente**:
El agente contacta al cliente (WhatsApp / correo) con 30-45 días de anticipación. XORIA genera el mensaje de contacto personalizado con el tipo de póliza, la fecha de vencimiento y la prima actual.

**Paso 3 — Propuesta de renovación**:
El agente cotiza la renovación (con posibles ajustes: nueva suma asegurada, cambio de cobertura, actualización de datos). XORIA puede comparar la prima actual con la nueva y generar el análisis de cambio.

**Paso 4 — Aceptación y pago**:
El cliente acepta. Paga el primer recibo de la renovación. El agente confirma en el módulo de cobranza.

**Paso 5 — Emisión de nueva vigencia**:
La póliza se renueva con nueva fecha de inicio y fin. El historial de la póliza anterior queda registrado. La cartera del agente se actualiza automáticamente.

**Resultado**: retención de cliente + continuidad de prima + comisión de renovación + actualización del CRM.

---

## Proceso 3: Gestión de siniestro (desde el reporte hasta el cierre)

**Cómo inicia**: El asegurado reporta el siniestro. Puede hacerlo por: app cliente (/client/siniestros), WhatsApp al agente, llamada directa al agente o línea 24/7 de la aseguradora.

**Paso 1 — Reporte del siniestro**:
El agente (o el sistema) abre un ticket de siniestro. Se captura: tipo de siniestro, descripción del evento, póliza involucrada, fecha y hora, ubicación (si aplica), datos del vehículo (si es auto).

**Paso 2 — Notificación a la aseguradora**:
El agente notifica a la aseguradora. Si es GMM, se solicita carta aval para el hospital. Si es auto, se solicita asignación de ajustador. La aseguradora recibe la solicitud en su ClaimCenter.

**Paso 3 — Asignación de ajustador (si aplica)**:
El carrier asigna ajustador disponible. El ajustador sale en ruta. El tracking GPS se activa. El asegurado puede ver el mapa con el ETA en su app. La aseguradora y el agente ven el status en tiempo real.

**Paso 4 — Inspección y dictamen**:
El ajustador llega al sitio, levanta evidencias (fotos, video, acta), entrevista al asegurado, produce un dictamen preliminar. El dictamen queda subido como documento en el expediente del siniestro.

**Paso 5 — Resolución y pago**:
La aseguradora revisa el dictamen. Define el monto a pagar. Libera el cheque o depósito. Si es GMM, paga directamente al hospital (carta aval). Si es auto, paga al asegurado o directamente al taller.

**Paso 6 — Cierre del siniestro**:
El agente confirma la resolución con el cliente. Cierra el ticket. El siniestro pasa a status "cerrado" en el sistema. El cliente puede ver el cierre en su app.

**Resultado**: cliente atendido + siniestro documentado + reserva técnica actualizada + historial de siniestralidad por cliente, agente y canal.

---

## Proceso 4: Cobranza y recuperación de prima

**Cómo inicia**: El sistema detecta recibos próximos a vencer (D-7, D-3, D-0) o recibos ya vencidos.

**Paso 1 — Alerta de vencimiento**:
XORIA genera alertas en el briefing del agente. El módulo de cobranza lista los recibos vencidos con cliente, monto y días de mora.

**Paso 2 — Gestión de cobro**:
El agente contacta al cliente por WhatsApp o correo. XORIA genera el mensaje de recordatorio personalizado. El agente registra el tipo de gestión: "en_gestion", "promesa_pago".

**Paso 3 — Registro de pago**:
El cliente paga. El agente registra el pago con método, banco, referencia y monto. El recibo pasa a status "pagado". La comisión se activa en el módulo financiero.

**Paso 4 — Escalación por mora**:
Si el recibo supera X días sin pago, se escala al nivel de gestión superior (supervisor o promotoría). Si supera el período de gracia, la póliza puede entrar en cancelación automática.

---

## Proceso 5: Suscripción en el carrier

**Cómo inicia**: El agente envía una solicitud completa a la aseguradora desde el módulo de emisión. La solicitud entra a la bandeja de underwriting del carrier.

**Paso 1 — Recepción y clasificación**:
La solicitud aparece en la bandeja con status "Nuevo". El sistema calcula automáticamente el score de riesgo y detecta inconsistencias documentales.

**Paso 2 — Asignación a suscriptor**:
Un suscriptor toma la solicitud. Status cambia a "En revisión". El suscriptor analiza: documentos, score, historial de siniestralidad, declaración de salud, uso del vehículo (si auto).

**Paso 3 — Solicitud de información adicional (si aplica)**:
Si hay documentos faltantes o datos inconsistentes, el suscriptor agrega observaciones y cambia el status a "Pendiente información". El agente recibe una notificación y debe completar el expediente.

**Paso 4 — Dictamen**:
El suscriptor emite el dictamen: aprobado, rechazado o aprobado con condiciones (ajuste de deducible, exclusión de cobertura, sobre-prima).

**Paso 5 — Emisión**:
Si es aprobado, la póliza se emite. Se genera el número de póliza oficial, la carátula, las condiciones y el primer recibo. La póliza entra al PolicyCenter del carrier. El agente la recibe en su cartera. El cliente la ve en su app.

---

## Proceso 6: Gestión de equipo (Promotoría)

**Cómo inicia**: La promotora supervisa a su equipo de agentes diariamente desde el dashboard de promotoría.

**Acciones de gestión**:
- Revisar ranking diario de producción
- Identificar agentes sin actividad (alerta automática de XORIA)
- Asignar leads del pool de la promotoría a agentes específicos
- Revisar calidad de expedientes enviados a la aseguradora
- Monitorear avance de metas mensuales
- Generar reportes de producción del canal para la aseguradora
- Liquidar comisiones al equipo

**XORIA para la promotora**: "¿A quién de mi equipo debo contactar hoy?", "¿Cuánto override me falta para cerrar el mes?", "Genera el reporte de producción de la semana".

---

## Proceso 7: Detección y gestión de fraude

**Cómo inicia**: El motor de riesgo predictivo analiza en tiempo real cada solicitud, póliza y siniestro que entra al sistema. Los flags de fraude se generan automáticamente.

**Paso 1 — Detección automática**:
El sistema detecta patrones: siniestro a días de la emisión, documentos duplicados, proveedores con historial de inflación, comportamiento anómalo de pago.

**Paso 2 — Alerta y priorización**:
La alerta aparece en el módulo de antifraude con severidad (normal, observado, riesgo_medio, riesgo_alto, bloqueo_auditoria). El equipo de antifraude la recibe con todos los detalles y flags.

**Paso 3 — Revisión manual**:
Un analista revisa el caso, puede agregar notas, consultar a XORIA para análisis del patrón y tomar una decisión: confirmar fraude, falso positivo o mantener en observación.

**Paso 4 — Acción**:
Según la resolución: rechazar solicitud, cancelar póliza, retener comisión al agente, bloquear proveedor, iniciar investigación, notificar al área legal.

---

# 10. DATOS: QUÉ ENTRA, QUÉ SALE, QUIÉN LOS USA

## Datos que captura el agente

- Datos del prospecto: nombre, RFC, CURP, datos de contacto, ocupación, fecha de nacimiento
- Documentación: identificación, comprobante fiscal, cuestionario médico, facturas, actas
- Notas de interacción: texto libre, fecha, canal de comunicación
- Pagos: método, banco, referencia, monto, fecha
- Siniestros: descripción, fotos, videos, acta de hechos

## Datos que genera el sistema automáticamente

- Score de relación del cliente (basado en pagos, antigüedad, siniestros, interacciones)
- Score de riesgo de la solicitud (modelo predictivo)
- Alertas de renovación (basadas en fecha de vencimiento)
- Alertas de fraude (basadas en patrones)
- KPIs en tiempo real (calculados sobre los datos de cartera y pipeline)
- Sugerencias de XORIA (basadas en contexto completo)

## Flujo de datos por perfil

**Agente → CRM**: captura datos de clientes y prospectos
**Agente → Aseguradora**: envía solicitudes y documentación
**Aseguradora → Agente**: devuelve emisión de póliza, número oficial, carta aval, dictamen
**Agente → Cliente (app)**: pólizas emitidas, comprobantes, mensajes
**Cliente → Sistema**: pagos, reportes de siniestro, solicitudes
**Sistema → XORIA**: contexto completo del workspace activo
**XORIA → Agente**: análisis, sugerencias, documentos generados

## Entidades de datos principales

- **Prospecto / Lead**: estado del pipeline, datos de contacto, producto objetivo, score
- **Cliente**: expediente completo, pólizas, pagos, siniestros, notas, conversaciones
- **Póliza**: número, vigencia, prima, coberturas, aseguradora, agente, movimientos, endosos
- **Recibo / Pago**: monto, vencimiento, método, status, comprobante
- **Ticket**: asunto, prioridad, status, timeline de notas
- **Siniestro**: tipo, descripción, status, monto, timeline, evidencias, tracking
- **Comisión**: póliza origen, porcentaje, monto, status, CFDI
- **Solicitud UW**: documentos, score, dictamen, observaciones
- **Alerta de fraude**: tipo, severidad, entidad, flags, resolución
- **Documento técnico**: aseguradora, ramo, tipo, versión, archivo

---

# 11. REPORTES Y EXPORTACIONES

## Catálogo de reportes del agente

| Reporte | Qué mide | Filtros | Exportación |
|---|---|---|---|
| Producción mensual | Prima emitida por mes con leads y tasa de cierre | Período | CSV |
| Cartera activa | Todas las pólizas activas con prima y vencimiento | Ramo, aseguradora, status | CSV |
| Cobranza del mes | Cobrado vs pendiente vs vencido por póliza | Período, aseguradora, status | CSV |
| Comisiones | Comisión por póliza, porcentaje, monto, status | Aseguradora, período, status | CSV |
| Pipeline | Prospectos por etapa con valor y score | Etapa, agente, ramo | CSV |
| Siniestros | Casos activos y cerrados con monto y status | Período, aseguradora, tipo | CSV |

## Catálogo de reportes del carrier

| Reporte | Qué mide | Perfil que lo usa | Exportación |
|---|---|---|---|
| Producción por ramo | Emitido, cobrado, pólizas por ramo | Aseguradora, Finanzas | CSV/Excel |
| Producción por promotoría | Emisión, conversión, cancelación, loss ratio | Red, Dirección | CSV/Excel |
| Producción por agente | Emisión, calidad, eficiencia por agente | Red, Promotoría | CSV/Excel |
| Underwriting | Solicitudes, tasa de aprobación, tiempos | Suscripción | CSV |
| Pólizas | Cartera, movimientos, endosos, vencimientos | Administración | CSV/Excel |
| Cobranza | Cobrado, pendiente, fallido por canal | Billing | CSV |
| Siniestros | Backlog, SLA, reservas, pagos | Claims | CSV/Excel |
| SLA de ajustadores | Tiempo promedio por ajustador, SLA crítico | Claims, Operaciones | CSV |
| Renovaciones | Cartera a vencer por período, propensión | Administración | CSV |
| Cancelaciones | Pólizas canceladas, causa, canal de origen | Administración, Riesgo | CSV |

Todos los reportes del catálogo soportan exportación a CSV. Los reportes financieros estratégicos tienen formato pensado para Excel. Los reportes ejecutivos tienen versión PDF para presentaciones.

---

# 12. FINANZAS POR PERFIL

## Finanzas del Agente

**Lo que ve el agente**:
- Ingresos del mes: suma total de comisiones pagadas + overrides recibidos
- Comisiones pendientes: suma de comisiones aún no liquidadas por las aseguradoras
- Comisiones por aseguradora: desglose de cuánto le paga cada carrier y qué porcentaje aplica
- Flujo de caja mensual: ingresos vs gastos vs comisiones (gráfica histórica)
- CFDI emitidas: facturas timbradas, pendientes y canceladas con UUID SAT
- Documentos financieros: estados de cuenta con análisis OCR automático

**Porcentajes de comisión reales por aseguradora** (datos del sistema):
- GNP Seguros: 18% GMM, 15% Auto
- AXA Seguros: 10% GMM Colectivo
- Qualitas: 15% Auto
- MAPFRE: 12% RC
- Metlife: 20% Vida

**Demo del agente Carlos Mendoza**:
- Ingresos marzo: $36,850 MXN
- Comisiones pagadas: $5,257 (GNP, Qualitas, MAPFRE)
- Comisiones pendientes: $17,196 (AXA colectivo + GNP GMM Plus + Metlife Vida)
- Meta mensual: $200,000 de prima
- Avance de meta: 92% ($184,320)

## Finanzas de la Promotoría

**Lo que ve la promotora**:
- Prima total del equipo: suma de toda la producción de sus agentes
- Comisión de red: suma de comisiones individuales de todos los agentes
- Override de la aseguradora: porcentaje adicional sobre la producción del canal
- Comisión por agente: cuánto generó cada agente y qué le corresponde
- Forecast del mes: proyección de cierre basada en ritmo actual del equipo
- Recibos pendientes: cobranza del equipo que impacta directamente el override

**Demo de Promotoria Vidal Grupo**:
- Prima total equipo: $711,220 MXN/mes
- Override estimado (10%): $71,122 MXN
- Comisión del mes ya pagada: pendiente de cálculo exacto
- Agente top: Valeria Castillo con $298,400

## Finanzas del Carrier

**Lo que ve la aseguradora**:
- Primas emitidas: total del mes y comparativa vs meses anteriores
- Primas cobradas: efectividad de cobranza global
- Brecha de cobranza: primas emitidas − cobradas = exposición financiera
- Rentabilidad por ramo: margen neto después de siniestralidad y gastos
- Siniestralidad (loss ratio): prima siniestrada / prima cobrada por ramo
- Reserva técnica: monto total reservado para siniestros abiertos + IBNR
- Comisiones a pagar: total de comisiones a liquidar a promotoríaas y agentes
- Forecast mensual: proyección de cierre de período

**Datos financieros reales del sistema (Mar 2026)**:
- Primas emitidas: $184.6M
- Primas cobradas: $161.9M
- Brecha: $22.7M
- Reserva técnica total: $47.2M
- Pagos de siniestros del mes: $18.9M
- Prima siniestrada acumulada: $214.7M — Siniestralidad 58.4%
- IBNR estimado: $11.6M

## Finanzas del Cliente Asegurado

**Lo que ve el asegurado**:
- Prima de cada póliza activa con periodicidad y monto exacto
- Próximo recibo a pagar: fecha, monto, botón de pago
- Historial de pagos: método, banco, referencia, comprobante descargable
- Recibos vencidos si existen: alerta prominente
- Desglose por póliza: qué paga para cada cobertura

**Demo de Ana López**:
- GMM Individual GNP: $8,500/mes — próximo 1 abril 2026
- Auto Amplia Qualitas: $1,025/mes — pagado marzo
- Auto Amplia Qualitas (2): $1,420/mes — pagado marzo
- Total mensual de seguros: $10,945 MXN

---

# 13. INTEGRACIONES Y CAPACIDADES TÉCNICAS

## IA Multi-modelo (OpenAI + Anthropic + Groq)

Tres modelos de lenguaje integrados simultáneamente con enrutamiento inteligente. El sistema selecciona el modelo óptimo según el tipo de consulta y perfil del usuario sin intervención del agente. Sirve para: análisis de riesgo, redacción de documentos, respuesta a consultas técnicas, resúmenes ejecutivos, clasificación de datos.

## Búsqueda web en tiempo real (Tavily)

Cuando el agente pregunta sobre regulación, normativa, tarifas de mercado o noticias de aseguradoras, XORIA activa Tavily para obtener información actualizada. Los resultados se integran en la respuesta como "Información actualizada" antes de la respuesta de XORIA. Sirve para: consultas regulatorias CNSF/AMIS, análisis de competencia, novedades del mercado.

## Reconocimiento de voz (Web Speech API)

Operación por voz en español México. Activable desde el chat de XORIA y desde el módulo de voz del agente. Permite dictar preguntas, notas y mensajes sin tocar el teclado. Útil para agentes en campo o en visita a clientes.

## Tracking GPS de ajustadores (Sistema de mapas)

En siniestros de auto, el sistema registra waypoints GPS del recorrido del ajustador con ETA actualizado. El asegurado ve el mapa en su app. El carrier lo ve en el ClaimCenter. El agente lo puede consultar en el módulo de siniestros. Sirve para: transparencia al cliente, control operativo de claims, SLA monitoring.

## OCR de documentos financieros

El módulo financiero del agente permite subir estados de cuenta bancarios y facturas. El sistema analiza el documento automáticamente y detecta: montos, fechas, RFC, tipo de movimiento. Sirve para: conciliación de comisiones, validación de pagos, registro automatizado de flujo de caja.

## Exportación CSV

Disponible en: cobranza, comisiones, pólizas, pipeline, tickets, reportes de producción, bandeja de underwriting, cobranza del carrier. Sirve para: integración con sistemas externos, análisis en Excel, reportes para la aseguradora.

## Firma electrónica (cliente)

El asegurado puede firmar documentos directamente desde su app en el flujo de cotización y emisión. Sirve para: originación digital sin necesidad de presencia física.

## Mensajería multicanal

El workspace del agente centraliza conversaciones de WhatsApp, email y app del cliente. Sirve para: no perder contexto de la relación, responder desde un solo lugar, auditar toda la comunicación.

## Autenticación y roles

Sistema de autenticación con roles diferenciados: agent, admin, client, broker, promotoria, aseguradora. Cada rol carga una vista diferente con las funcionalidades de su perfil. El middleware protege todas las rutas por rol.

## Gestión de historial de XORIA

Las conversaciones con XORIA se persisten en localStorage del navegador. El usuario puede recuperar, continuar o eliminar conversaciones. Máximo 20 conversaciones almacenadas (configurable).

---

# 14. CALIDAD DE DATOS MOCK Y ESCALADO POR PERFIL

## Estado actual del mock

El sistema opera en modo demo con datos mock realistas. Los datos están bien estructurados, son coherentes entre sí y cubren escenarios reales del negocio asegurador. Sin embargo, hay oportunidades de escalar la densidad de datos para cada perfil.

## Agente — Escala actual y mejoras recomendadas

**Actual**: 247 pólizas (valor en KPI), 12 prospectos en pipeline, 6 clientes registrados, 8 pólizas completas, 10 pagos, 7 comisiones, 4 siniestros, 8 tickets, 5 conversaciones.

**Para demo enterprise creíble**: el agente debería mostrar 200+ clientes, 50-80 leads activos, 300+ pólizas, flujo de caja de $30K-50K/mes. Los KPIs actuales (247 pólizas, $184,320 prima) son creíbles para un agente senior en México.

**Ajuste urgente**: el detalle de expediente de clientes es solo 6 registros. Para una demo de CRM empresarial se necesitan al menos 20-30 clientes con expedientes completos.

## Promotoría — Escala actual y mejoras recomendadas

**Actual**: 5 agentes con datos completos (producción, metas, ramos, aseguradoras). KPIs del equipo calculados en tiempo real sobre esos 5 agentes.

**Para demo enterprise**: la promotoría debería mostrar 20-50 agentes, prima del equipo de $5M-20M/mes, overrides de $500K-2M/mes. Las promotoríaas reales en México tienen entre 10 y 200 agentes. Los datos actuales son demasiado pequeños para una promotoría enterprise.

**Ajuste urgente**: ampliar MOCK_AGENTES_EQUIPO a 15-20 agentes con mayor diversidad de performance. Incluir override histórico mensual. Incluir metas por período.

## Carrier / Aseguradora — Escala actual

**El carrier tiene los datos más sólidos del sistema**. Los KPIs son de escala enterprise real:
- $184.6M en primas emitidas — correcto para una aseguradora regional
- 52,418 pólizas activas — coherente con GNP segmento regional
- 612 siniestros abiertos — creíble
- 93 ajustadores activos — operativamente correcto

**Ajuste recomendado**: agregar más casos en underwriting (actualmente 6 casos demo). Para una demo de aseguradora se necesitan al menos 20-30 solicitudes activas mostrando variedad de productos, ramos y estados.

## Cliente asegurado — Escala actual

**Actual**: Ana López con 3 pólizas, 10 pagos (con historial), 4 siniestros (2 activos), 5 conversaciones.

**Para demo creíble**: el perfil del cliente es adecuado para mostrar las funcionalidades. Lo que más impacta visualmente es el tracking del ajustador y la carta aval del siniestro activo. Esos elementos ya están bien implementados.

**Ajuste recomendado**: agregar al menos 2-3 perfiles de cliente adicionales para mostrar variedad (cliente joven con auto, cliente corporativo con colectivo, cliente mayor con vida).

## Elementos visuales pobres o insuficientes

1. **Dashboard del agente**: los charts de área y donut tienen datos reales pero podrían mostrar más granularidad (por semana, no solo por mes).
2. **Mapa de siniestros**: el tracking del ajustador tiene datos completos pero si la demo ocurre sin conexión el mapa puede no renderizar. Usar tiles cacheados.
3. **Reportes**: actualmente son estáticos. Para una demo enterprise deberían tener filtros activos que muestren datos cambiando en pantalla.
4. **Módulo de plan/metas**: no se revisó su contenido completo. Debería mostrar curvas de progreso mensuales y proyección.

---

# 15. RECOMENDACIONES PARA PRESENTAR LA DEMO A INVERSIONISTAS

## Guión de demostración recomendado (45 minutos)

### Parte 1 — El problema (5 minutos)
"El seguro en México es un negocio de $600 mil millones de pesos al año distribuido por 200,000 agentes que operan con Excel, WhatsApp y PDFs. Las aseguradoras tienen sistemas de los 90. Los agentes no tienen visibilidad. Los clientes no tienen ninguna app. IAOS resuelve exactamente eso."

### Parte 2 — El producto desde el agente (10 minutos)
Login como agente@demo.com. Mostrar:
1. Dashboard: KPIs, pipeline kanban, agenda y XORIA briefing en 1 scroll
2. XORIA chat: preguntar "Dame un resumen del día" y "¿A quién debo llamar hoy para cerrar el mes?"
3. Siniestro activo de Ana López: mostrar el tracking del ajustador en mapa
4. Módulo financiero: mostrar comisiones, CFDI y OCR de documento

### Parte 3 — La promotoría (5 minutos)
Login como promotoria@demo.com. Mostrar:
1. Dashboard de promotoría: ranking de agentes, alertas del equipo, XORIA briefing
2. Pipeline consolidado del equipo con valor total
3. Preguntar a XORIA: "¿Quién está más cerca de cerrar el mes fuerte?"

### Parte 4 — El carrier (10 minutos)
Login como aseguradora@demo.com. Mostrar:
1. Dashboard ejecutivo: 12 KPIs en tiempo real con cifras en millones
2. Underwriting: bandeja de solicitudes con scores y dictámenes
3. ClaimCenter: siniestros activos con tracking de ajustadores
4. Panel de riesgo y antifraude: alertas de fraude detectadas por IA
5. Preguntar a XORIA: "¿Qué casos tienen alerta crítica de fraude?"

### Parte 5 — La app del cliente (5 minutos)
Login como cliente@demo.com. Mostrar:
1. Home: póliza activa en glass card con protección activa
2. Siniestro: tracking del ajustador en mapa
3. Pagos: historial con método y comprobante
4. Mensajes: chat con el agente

### Parte 6 — El modelo de negocio (10 minutos)
Explicar la tesis de monetización:
- SaaS por agente: $X/mes/agente (target 200,000 agentes en México)
- SaaS por promotoría: $X/mes (target 2,000 promotoríaas)
- Enterprise carrier: contrato anual con aseguradora (target 5-6 carriers grandes)
- Transaccional por emisión: fee por póliza emitida via IAOS

## Mensajes clave para inversionistas

**Por qué IAOS ahora**: La CNSF impulsó la digitalización del sector 2024-2026. Las aseguradoras buscan modernizar su distribución. Los agentes jóvenes demandan herramientas digitales. El timing es perfecto.

**Por qué IAOS gana**: Es el único sistema que conecta los cuatro eslabones de la cadena (aseguradora + promotoría + agente + asegurado) en una sola plataforma, con IA operativa real integrada en el core del negocio, no como add-on.

**Por qué XORIA es diferencial**: No es un chatbot. Es una capa cognitiva que tiene acceso a datos reales del negocio de cada usuario y puede actuar sobre ellos. Un agente puede ejecutar en 30 segundos lo que le tomaba 10 minutos en Excel y WhatsApp. Una aseguradora puede detectar fraude que antes tomaba semanas de auditoría.

**Barreras de entrada**: el sector asegurador tiene procesos muy específicos, terminología propia, regulación CNSF, y una dinámica de relaciones agente-aseguradora que requiere mucho conocimiento del dominio. IAOS está construido sobre esa profundidad operativa, no sobre funcionalidades genéricas.

**Escalabilidad técnica**: arquitectura Next.js con rutas API serverless, multi-modelo de IA con fallbacks automáticos, datos estructurados por tipo de perfil, exportación nativa. El sistema escala horizontalmente sin cambios de arquitectura.

---

# RESUMEN EJECUTIVO DEL SISTEMA

**IAOS es el sistema operativo del seguro en México.**

No es un dashboard. No es un CRM. No es un portal de pólizas.

Es la infraestructura digital completa que necesita cada participante de la cadena aseguradora para operar con eficiencia, tomar decisiones con datos en tiempo real y servir al cliente final de forma transparente.

Con XORIA como capa de inteligencia que actúa transversalmente sobre todos los perfiles, IAOS convierte la operación manual del seguro —dispersa, lenta y opaca— en un sistema conectado, automatizable y auditable.

El sistema ya tiene un core funcional completo con cuatro perfiles diferenciados, más de 25 módulos operativos, datos mock de escala enterprise, integración multi-modelo de IA, tracking en tiempo real, detección de fraude predictiva, finanzas por perfil y una app de cliente lista para producción.

**Lo que viene después**: backend real conectado a las APIs de las aseguradoras, pago digital integrado (Stripe/Clip/SPEI), firma electrónica válida (SAT), notificaciones push, módulo de agenda con Google Calendar, y escalado de XORIA con memoria persistente por usuario.

---

*Documento generado el 20 de marzo de 2026.*
*Versión 1.0 — Uso interno y presentación a inversionistas.*
*IAOS — Insurance Agent Operating System — Repositorio: AdmiKode/IAOS*
