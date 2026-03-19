# INSURANCE AGENT OS

INSURANCE AGENT OS
Blueprint Maestro Funcional + Operativo + IA
Versión 1.0 para Desarrollo / Producto / UX / Backend / IA

1. Definición del producto
Insurance Agent OS es una plataforma operativa vertical para agentes, despachos y canales comerciales de seguros.
No es un CRM genérico. Es un sistema operativo de seguros orientado a:
	•	capturar datos una sola vez,
	•	reutilizarlos en todo el ciclo de vida,
	•	reducir trabajo manual,
	•	controlar permisos por perfil regulatorio y operativo,
	•	consultar documentación oficial por aseguradora,
	•	habilitar contratación y operación digital con trazabilidad,
	•	y dar al cliente una app con expediente, evidencias, pagos, aclaraciones y siniestros.

2. Objetivo de negocio
2.1 Meta central
Eliminar la fricción del proceso de venta, captura, emisión, cobranza, servicio y renovación de pólizas.
2.2 Promesa operativa
	•	Captura única del cliente y del riesgo
	•	Prellenado masivo de formularios
	•	IA como copiloto operativo
	•	Menos captura manual
	•	Más trazabilidad
	•	Más velocidad de cierre
	•	Mejor postventa
	•	Menos pérdida por documentos, pagos y renovaciones
2.3 Regla madre del producto
Nunca volver a capturar dos veces lo mismo.

3. Principios rectores del sistema
	0.	Source of truth única por cliente, póliza, pago, evidencia y caso.
	0.	IA asistente, no autoridad contractual.
	0.	Todo archivo subido se convierte en dato, historial y siguiente acción.
	0.	Todo texto generado por IA debe ser trazable a fuente o workflow.
	0.	Todo acto sensible debe quedar auditado.
	0.	Los permisos dependen del rol operativo y del rol regulatorio.
	0.	El cliente vive dentro del expediente, no en chats sueltos.
	0.	La plataforma debe soportar individual y colectivo/empresarial.
	0.	La experiencia debe parecer software sectorial premium, no CRM reciclado.
	0.	La IA automatiza la mayoría del trabajo manual, pero el humano valida actos críticos.

4. Tipología de usuarios y perfiles del sistema
4.1 Perfiles regulatorios / de negocio a soportar
P1. Admin del despacho / Agente Persona Moral
Opera la organización, usuarios, reglas, comisiones, catálogos, bibliotecas documentales, dashboards y cumplimiento.
P2. Agente con cédula vigente
Puede asesorar, gestionar cartera, capturar, cotizar, emitir flujo comercial, dar servicio y cerrar dentro de la categoría permitida.
P3. Apoderado de Agente Persona Moral
Opera igual que un agente dentro del marco y permisos delegados por la persona moral.
P4. Ejecutivo comercial / broker referidor con cédula
Puede prospectar, capturar, dar seguimiento comercial y operar según categoría autorizada.
P5. Broker / referidor sin cédula
Puede originar leads, cargar datos preliminares, subir documentos, coordinar al cliente y dar seguimiento comercial básico, pero no debe ejecutar asesoría técnica formal, validación regulatoria final ni cierre contractual autónomo.
P6. Mesa de emisión / backoffice operativo
Valida expediente, controla documentos, formatos, emisión, endosos, pólizas y entregables.
P7. Ejecutivo de cobranza / finanzas
Gestiona recibos, comprobantes, cartera, aclaraciones de pago, conciliación operativa y seguimiento.
P8. Mesa de servicio / siniestros / aclaraciones
Gestiona tickets, evidencias, trámites, siniestros, aclaraciones, escalaciones y comunicación postventa.
P9. Supervisor de cumplimiento / auditoría
Audita expedientes, evidencias, permisos, actos digitales, trazabilidad y uso de IA.
P10. RH / contacto empresarial del cliente colectivo
Sube listados, movimientos, altas/bajas, evidencias y documentación del grupo o colectivo.
P11. Cliente final individual
Consulta pólizas, pagos, documentos, mensajes, siniestros, aclaraciones, evidencias y renovaciones.
P12. Cliente asegurado dentro de colectivo
Accede a sus documentos y trámites personales según permisos definidos por la empresa cliente y la póliza colectiva.

5. Arquitectura de vistas por perfil
5.1 Vista P1 Admin Despacho
Ve:
	•	dashboard general
	•	sucursales / equipos
	•	usuarios / roles
	•	cartera total
	•	pipelines
	•	bibliotecas por aseguradora
	•	reglas IA
	•	reportes financieros
	•	cumplimiento / auditoría
	•	configuración del sistema
5.2 Vista P2/P3 Agente con cédula / apoderado
Ve:
	•	tablero diario
	•	leads y cartera
	•	pipeline
	•	expediente vivo
	•	motor de originación
	•	cotizaciones
	•	tareas
	•	clientes
	•	renovaciones
	•	bandeja de mensajes
	•	bandeja de documentos y evidencias
	•	knowledge hub
5.3 Vista P4 Ejecutivo comercial con cédula
Ve:
	•	leads
	•	pipeline comercial
	•	agenda
	•	clientes asignados
	•	documentos preliminares
	•	cotizaciones
	•	seguimiento
	•	knowledge hub comercial
5.4 Vista P5 Broker / referidor sin cédula
Ve:
	•	leads
	•	clientes referidos
	•	estatus del pipeline
	•	carga de documentos
	•	notas / audios
	•	agenda
	•	seguimiento comercial
	•	mensajería
No ve:
	•	emisión final
	•	cambios sensibles de póliza
	•	decisiones de cumplimiento
	•	autorizaciones finales
	•	respuestas legales finales sin revisión
5.5 Vista P6 Mesa de emisión
Ve:
	•	expedientes listos para emisión
	•	checklist documental
	•	validaciones
	•	plantillas por aseguradora
	•	generación de entregables
	•	control de errores / pendientes
5.6 Vista P7 Cobranza / finanzas
Ve:
	•	recibos
	•	pagos pendientes
	•	comprobantes por validar
	•	cartera por vencer
	•	cartera vencida
	•	comisiones
	•	conciliación operativa
	•	aclaraciones de pago
5.7 Vista P8 Servicio / siniestros
Ve:
	•	tickets
	•	siniestros abiertos
	•	aclaraciones
	•	bandeja de evidencias
	•	mensajes cliente-agente
	•	SLA
	•	historial del caso
5.8 Vista P9 Cumplimiento
Ve:
	•	auditoría por expediente
	•	bitácora de IA
	•	uso de firma digital
	•	consentimiento
	•	trazabilidad documental
	•	alertas regulatorias
	•	incidencias de privacidad y seguridad
5.9 Vista P10 Cliente empresa / RH
Ve:
	•	pólizas colectivas / grupos
	•	movimientos de altas y bajas
	•	documentos del colectivo
	•	recibos / estatus
	•	tickets del colectivo
	•	reportes operativos del grupo
5.10 Vista P11 / P12 Cliente app
Ve:
	•	inicio
	•	mis pólizas
	•	mis pagos
	•	mis documentos
	•	subir evidencia
	•	aclaraciones
	•	siniestros
	•	mensajes con agente
	•	renovaciones
	•	historial

6. Mapa total de módulos del sistema
	0.	Login, acceso y seguridad
	0.	Onboarding organizacional
	0.	Usuarios, roles y permisos
	0.	CRM de leads y clientes
	0.	Pipeline operativo de seguros
	0.	Expediente vivo del cliente
	0.	Motor de originación de pólizas
	0.	Biblioteca por aseguradora / knowledge hub
	0.	Cotización y comparativos
	0.	Emisión, endosos y entrega
	0.	Cobranza, recibos y finanzas operativas
	0.	Renovaciones y retención
	0.	Tickets, aclaraciones y postventa
	0.	Siniestros y centro de evidencias
	0.	App del cliente
	0.	Mensajería omnicanal
	0.	Tareas, agenda y productividad
	0.	Reportes y BI
	0.	Compliance, auditoría y trazabilidad
	0.	Centro de control de IA
	0.	Catálogos maestros
	0.	Administración de documentos y storage
	0.	Xoria - Capa de copiloto operativo transversal

7. Flujo maestro end to end
	0.	Entra lead
	0.	Se crea expediente base
	0.	Se identifica perfil del cliente y ramo
	0.	Se activa checklist correspondiente
	0.	Se abre flujo de captura guiada
	0.	Se suben documentos / audios / evidencias
	0.	OCR + transcripción + extracción estructurada
	0.	IA arma expediente y detecta faltantes
	0.	Agente valida / corrige
	0.	Sistema genera solicitud / cotización
	0.	Se responde al cliente y se explica el producto
	0.	Cliente acepta / firma / autoriza
	0.	Se emite / entrega documentación
	0.	Se cobran recibos y se validan pagos
	0.	Se atienden aclaraciones / siniestros / movimientos
	0.	Se monitorean vencimientos y renovaciones
	0.	Se conserva historial completo y expediente auditable

8. Módulos a detalle: funciones totales + participación de IA
8.1 Módulo 01. Login, acceso y seguridad
Funciones
	•	login con email/contraseña
	•	login con OTP
	•	invitación de usuarios
	•	recuperación de acceso
	•	MFA para roles sensibles
	•	alta de dispositivo confiable
	•	control de sesión
	•	caducidad de sesión
	•	verificación de aceptación de aviso de privacidad
	•	verificación de consentimiento digital cuando aplique
	•	registro de último acceso y dispositivo
IA en este módulo
Automatización IA estimada: 10%
La IA solo ayuda en:
	•	detección de accesos anómalos
	•	soporte conversacional al usuario
	•	clasificación de intentos sospechosos
	•	explicación guiada de errores de acceso
No delegar a IA
	•	autenticación primaria
	•	asignación final de privilegios
	•	aprobación de accesos privilegiados
	•	reseteos de seguridad crítica sin validación

8.2 Módulo 02. Onboarding organizacional
Funciones
	•	alta de despacho / organización
	•	alta de sucursales
	•	alta de marcas / razones sociales
	•	configuración de ramos vendidos
	•	alta de aseguradoras con las que trabajan
	•	carga de catálogos internos
	•	parametrización de pipeline
	•	definición de territorios / equipos / carteras
	•	definición de reglas de comisión
	•	definición de reglas de visibilidad
	•	carga inicial de formatos / condiciones / documentos por aseguradora
IA en este módulo
Automatización IA estimada: 35%
La IA puede:
	•	sugerir estructura inicial de pipeline
	•	clasificar documentos cargados por aseguradora
	•	mapear formatos a ramos
	•	detectar duplicados y documentos vencidos
	•	sugerir taxonomía documental
No delegar a IA
	•	estructura legal del despacho
	•	permisos finales por usuario
	•	políticas internas de remuneración

8.3 Módulo 03. Usuarios, roles y permisos
Funciones
	•	alta / baja / edición de usuarios
	•	asignación de perfil operativo
	•	asignación de perfil regulatorio
	•	relación usuario-equipo-cartera-sucursal
	•	matriz granular de permisos
	•	reglas por ramo
	•	reglas por vista
	•	delegación temporal de acceso
	•	sustitución temporal por ausencia
	•	auditoría de cambios de permisos
IA en este módulo
Automatización IA estimada: 20%
La IA puede:
	•	sugerir permisos base por tipo de usuario
	•	detectar incoherencias de acceso
	•	alertar sobre permisos excesivos
	•	recomendar segmentación por riesgo
No delegar a IA
	•	permisos finales de emisión, cumplimiento, finanzas y auditoría
	•	habilitación de acciones regulatoriamente sensibles

8.4 Módulo 04. CRM de leads y clientes
Funciones
	•	captura de lead
	•	importación masiva
	•	deduplicación
	•	scoring de lead
	•	clasificación por origen
	•	asignación automática de agente
	•	ficha del prospecto
	•	ficha del cliente
	•	actividades
	•	notas
	•	historial de interacción
	•	segmentación
	•	campañas
	•	cartera activa / inactiva
IA en este módulo
Automatización IA estimada: 65%
Qué hace la IA
	•	deduplicación inteligente
	•	enriquecimiento de lead desde conversación y documentos
	•	scoring de intención
	•	clasificación de urgencia
	•	resumen automático de historial
	•	sugerencia de siguiente mejor acción
	•	borradores de mensaje / correo / WhatsApp
	•	detección de clientes en riesgo de abandono
Humano indispensable
	•	validación comercial estratégica
	•	asignaciones especiales
	•	negociación fina
	•	decisiones de relación

8.5 Módulo 05. Pipeline operativo de seguros
Etapas sugeridas
	0.	Lead nuevo
	0.	Contactado
	0.	Perfilamiento en curso
	0.	Expediente abierto
	0.	Documentos pendientes
	0.	Expediente parcial
	0.	Solicitud prellenada
	0.	Cotización enviada
	0.	Ajustes / negociación
	0.	Aceptación
	0.	Firma / autorización
	0.	Emisión
	0.	Cobranza inicial
	0.	Póliza entregada
	0.	Postventa activa
	0.	Renovación futura
Funciones
	•	mover casos por etapa
	•	reglas de avance
	•	SLA por etapa
	•	tareas automáticas
	•	alertas por estancamiento
	•	tableros por ejecutivo / equipo / ramo
IA en este módulo
Automatización IA estimada: 70%
Qué hace la IA
	•	propone etapa correcta según evidencia
	•	detecta cuello de botella
	•	genera recordatorios
	•	prioriza casos
	•	resume qué falta para avanzar
	•	marca probabilidad de cierre
	•	identifica clientes fríos / tibios / calientes
Humano indispensable
	•	decisión de negociación
	•	cierre comercial
	•	excepciones no estándar

8.6 Módulo 06. Expediente vivo del cliente
Objeto
Repositorio estructurado y vivo de toda la información del cliente y sus pólizas.
Componentes
	•	datos personales
	•	datos de contacto
	•	datos fiscales
	•	datos de pago
	•	documentos de identidad
	•	pólizas activas e históricas
	•	movimientos
	•	evidencias
	•	comunicaciones
	•	tickets
	•	pagos
	•	consentimientos
	•	firma digital / aceptaciones
	•	siniestros
	•	aclaraciones
IA en este módulo
Automatización IA estimada: 75%
Qué hace la IA
	•	consolida información dispersa
	•	detecta inconsistencias
	•	completa campos con datos ya conocidos
	•	resume expediente en lenguaje ejecutivo
	•	sugiere faltantes y prioridades
	•	extrae entidades desde documentos y audios
	•	detecta datos desactualizados
Humano indispensable
	•	validación final de datos críticos
	•	corrección de homónimos / confusiones sensibles
	•	aprobación de cambios estructurales

8.7 Módulo 07. Motor de originación de pólizas
Este es el corazón del sistema
Funciones
	•	formularios conversacionales
	•	prellenado de solicitudes
	•	carga desde documentos previos
	•	carga desde pólizas anteriores
	•	importación de pólizas vigentes o históricas desde PDF, imagen o archivo estructurado
	•	normalización de datos provenientes de pólizas importadas
	•	audio a campos
	•	captura guiada por ramo
	•	checklist dinámico
	•	detección de faltantes
	•	reutilización de datos del expediente
	•	generación de paquete para cotización / emisión
	•	soporte para individual y colectivo
Subflujos mínimos
	•	auto
	•	vida individual
	•	GMM individual
	•	salud
	•	hogar
	•	pyme / daños
	•	vida grupo
	•	GMM colectivo
	•	flotillas
	•	movimientos de alta / baja de colectivo
IA en este módulo
Automatización IA estimada: 80%
Qué hace la IA
	•	convierte conversación en formulario
	•	divide formularios monstruo en microbloques
	•	detecta qué pedir y qué no repetir
	•	interpreta respuestas ambiguas y pide aclaración
	•	extrae datos de PDFs, INE, comprobantes, pólizas previas
	•	lee pólizas importadas para recuperar datos, coberturas, vigencias, deducibles y datos reutilizables
	•	clasifica documentos y asigna al paso correcto
	•	arma solicitud prellenada
	•	marca semáforo de completitud
	•	redacta resumen del riesgo
Humano indispensable
	•	validación final de información sensible o dudosa
	•	decisión de cierre de expediente listo para emitir
	•	autorización de excepciones

8.8 Módulo 08. Biblioteca por aseguradora / Knowledge Hub
Funciones
	•	alta de aseguradora
	•	alta de productos por ramo
	•	carga de condiciones generales
	•	carga de términos y condiciones por producto
	•	carga de carátulas ejemplo
	•	carga de endosos modelo
	•	carga de pólizas modelo
	•	carga de pólizas históricas/importadas del cliente o de la cartera existente
	•	carga de preguntas frecuentes
	•	carga de manuales internos
	•	carga de políticas operativas del despacho
	•	carga de reglas comerciales por aseguradora
	•	carga de documentos regulatorios y de consulta rápida en seguros y fianzas
	•	carga de glosarios
	•	control de versión documental
	•	vigencia documental
	•	buscador semántico
	•	chat con documentos
IA en este módulo
Automatización IA estimada: 85%
Qué hace la IA
	•	clasifica documentos por aseguradora/ramo/producto
	•	extrae metadatos
	•	genera índice automático
	•	contesta preguntas con base en documentos cargados
	•	cita fuente y versión
	•	compara cambios entre versiones
	•	traduce términos complejos a lenguaje humano
	•	detecta documentos vencidos o duplicados
	•	responde dudas operativas, regulatorias y documentales usando la biblioteca activa
	•	cruza póliza importada contra condiciones generales/endosos/documentación soporte para ubicar diferencias o huecos
Líneas rojas
	•	la IA no modifica el clausulado
	•	la IA no crea coberturas
	•	la IA no responde fuera de fuente cuando la pregunta es contractual
Humano indispensable
	•	validación de biblioteca vigente
	•	aprobación de documentos oficiales
	•	respuesta final en casos complejos o interpretativos

8.9 Módulo 09. Cotización y comparativos
Funciones
	•	generar solicitud de cotización
	•	preparar resumen del cliente / riesgo
	•	guardar cotizaciones recibidas
	•	comparar primas, coberturas, deducibles, exclusiones
	•	generar propuesta al cliente
	•	versionado de propuestas
	•	registrar rechazo / aceptación
IA en este módulo
Automatización IA estimada: 60%
Qué hace la IA
	•	arma paquetes de envío
	•	resume propuestas
	•	hace comparativos legibles
	•	destaca diferencias relevantes
	•	redacta explicación al cliente
	•	sugiere mejor opción según perfil declarado
Humano indispensable
	•	criterio comercial
	•	recomendación final
	•	validación de exactitud antes de enviar

8.10 Módulo 10. Emisión, endosos y entrega
Funciones
	•	checklist de emisión
	•	validación documental
	•	control de errores de captura
	•	generación de entregables
	•	registro de emisión
	•	control de endosos
	•	actualizaciones de póliza
	•	entrega contractual al cliente
	•	acuse de recibo / confirmación
IA en este módulo
Automatización IA estimada: 45%
Qué hace la IA
	•	revisa consistencia expediente-documentos
	•	detecta faltantes o incongruencias
	•	resume diferencias entre solicitud y póliza emitida
	•	genera mensajes de entrega y explicación
Humano indispensable
	•	validación final de emisión
	•	cambios sensibles de cobertura
	•	entrega formal / confirmación final

8.11 Módulo 11. Cobranza, recibos y finanzas operativas
Funciones
	•	recibos de prima
	•	calendario de cobro
	•	pagos pendientes
	•	carga de comprobantes
	•	validación de comprobantes
	•	conciliación operativa
	•	cartera por vencer
	•	cartera vencida
	•	alertas de cancelación por falta de pago
	•	notas de crédito / aclaraciones
	•	comisiones por agente/canal
	•	tablero financiero operativo
IA en este módulo
Automatización IA estimada: 70%
Qué hace la IA
	•	OCR de comprobantes
	•	extracción de monto / fecha / referencia
	•	matching probable con póliza / recibo
	•	detección de anomalías
	•	recordatorios automáticos
	•	clasificación de aclaraciones de cobro
	•	proyección básica de cartera en riesgo
Humano indispensable
	•	conciliación final
	•	ajustes contables formales
	•	resolución de controversias de pago

8.12 Módulo 12. Renovaciones y retención
Funciones
	•	cronograma de renovación
	•	alertas 90/60/30/7 días
	•	recolección de cambios
	•	renovación automática guiada
	•	comparativo contra vigencia anterior
	•	score de riesgo de cancelación
	•	campañas de retención
IA en este módulo
Automatización IA estimada: 75%
Qué hace la IA
	•	activa campañas por fecha
	•	identifica clientes con alta probabilidad de fuga
	•	resume cambios en prima/cobertura
	•	prepara propuesta de renovación
	•	redacta mensajes y scripts de llamada
	•	prioriza cartera a trabajar
Humano indispensable
	•	negociación final
	•	concesiones comerciales
	•	cierre de retención

8.13 Módulo 13. Tickets, aclaraciones y postventa
Funciones
	•	crear ticket
	•	clasificar ticket
	•	priorizar
	•	asignar responsable
	•	SLA
	•	conversación interna
	•	conversación con cliente
	•	cierre con evidencia
	•	encuesta de satisfacción
IA en este módulo
Automatización IA estimada: 75%
Qué hace la IA
	•	clasifica ticket por intención
	•	estima urgencia
	•	resume caso
	•	propone respuesta
	•	detecta tono / enojo / riesgo reputacional
	•	sugiere siguiente acción
Humano indispensable
	•	respuesta final en casos delicados
	•	autorizaciones fuera de política
	•	cierre de conflicto complejo

8.14 Módulo 14. Siniestros y centro de evidencias
Funciones
	•	apertura de caso
	•	carga de fotos
	•	carga de audios
	•	carga de videos cortos
	•	carga de PDFs
	•	carga de ubicación
	•	carga de terceros / placas / datos relacionados
	•	timeline del caso
	•	checklist de faltantes
	•	clasificación del caso
	•	enlace con póliza
	•	seguimiento interno
Categorías de evidencia
	•	pagos
	•	aclaraciones
	•	siniestros
	•	documentos generales
	•	identidad
	•	comprobantes
	•	audios descriptivos
	•	evidencias de terceros
	•	documentos de atención / resolución
IA en este módulo
Automatización IA estimada: 85%
Qué hace la IA
	•	OCR
	•	transcripción
	•	clasificación de evidencia
	•	resumen del incidente
	•	extracción de fecha, hora, lugar, montos, personas, placas, referencias
	•	generación de cronología
	•	detección de faltantes
	•	agrupación por caso
	•	búsqueda semántica de evidencias previas
Humano indispensable
	•	atención especializada
	•	decisiones de cobertura / procedencia
	•	resolución formal del caso

8.15 Módulo 15. App del cliente
Secciones mínimas
	•	inicio
	•	mis pólizas
	•	mis pagos
	•	mis documentos
	•	subir evidencia
	•	aclaraciones
	•	siniestros
	•	mensajes
	•	seguimiento de trámites
	•	renovaciones
	•	perfil
Funciones
	•	ver pólizas activas e históricas
	•	descargar documentos
	•	subir fotos / PDFs / audios / videos
	•	reportar siniestro
	•	abrir aclaración
	•	chatear con agente
	•	ver estatus de tickets
	•	subir comprobantes de pago
	•	recibir notificaciones push
	•	ver renovaciones próximas
	•	aceptar / firmar digitalmente cuando aplique
IA en este módulo
Automatización IA estimada: 70%
Qué hace la IA
	•	guía al cliente paso a paso
	•	transforma mensajes en trámites estructurados
	•	explica términos simples
	•	resume estatus del caso
	•	clasifica lo que sube el cliente
	•	completa formularios a partir de respuestas cortas o audio
Humano indispensable
	•	atención empática en casos complejos
	•	validación contractual sensible

8.16 Módulo 16. Mensajería omnicanal
Canales
	•	WhatsApp
	•	email
	•	notificaciones push
	•	in-app chat
	•	SMS opcional
Funciones
	•	plantillas
	•	conversación por cliente
	•	conversación por póliza o caso
	•	recordatorios automáticos
	•	envío de documentos
	•	recepción de evidencias
	•	bandeja unificada
IA en este módulo
Automatización IA estimada: 80%
Qué hace la IA
	•	redacta borradores
	•	resume conversaciones largas
	•	clasifica intención entrante
	•	propone respuesta
	•	detecta cambios de humor / urgencia
	•	convierte conversación en tarea o ticket
Humano indispensable
	•	revisión de mensajes delicados
	•	aprobaciones en mensajes jurídicos o de conflicto

8.17 Módulo 17. Tareas, agenda y productividad
Funciones
	•	tareas
	•	recordatorios
	•	agenda
	•	llamadas pendientes
	•	seguimiento por día
	•	KPI por ejecutivo
	•	bandeja de pendientes
IA en este módulo
Automatización IA estimada: 65%
Qué hace la IA
	•	prioriza tareas
	•	detecta overdue críticos
	•	propone agenda del día
	•	resume pendientes por cliente
	•	sugiere follow-ups
Humano indispensable
	•	gestión personal y reordenamiento estratégico

8.18 Módulo 18. Reportes y BI
Funciones
	•	primas emitidas
	•	cartera por ramo
	•	cartera por agente
	•	tasa de cierre
	•	tiempo de ciclo por etapa
	•	renovación ganada/perdida
	•	tickets y SLA
	•	pagos y cartera vencida
	•	comisiones
	•	productividad
	•	uso de IA
IA en este módulo
Automatización IA estimada: 55%
Qué hace la IA
	•	genera resúmenes ejecutivos
	•	detecta tendencias anómalas
	•	identifica cuellos de botella
	•	crea narrativas de negocio automáticas
Humano indispensable
	•	interpretación estratégica y toma de decisiones

8.19 Módulo 19. Compliance, auditoría y trazabilidad
Funciones
	•	bitácora de acciones
	•	bitácora de IA
	•	bitácora de documentos
	•	bitácora de consentimientos
	•	bitácora de firma / aceptación
	•	control de versiones
	•	reportes de cumplimiento
	•	revisión de expedientes incompletos
	•	trazabilidad de respuesta basada en documentos
	•	revisión de accesos y permisos
IA en este módulo
Automatización IA estimada: 50%
Qué hace la IA
	•	detecta expedientes con riesgo de incumplimiento
	•	alerta respuestas sin fuente suficiente
	•	identifica patrones de error humano
	•	resume hallazgos por expediente
Humano indispensable
	•	auditoría formal
	•	sanción / escalación / corrección institucional

8.20 Módulo 20. Centro de control de IA
Funciones
	•	catálogo de agentes IA
	•	reglas de uso por módulo
	•	prompts por flujo
	•	policies de seguridad
	•	políticas de citación de fuente
	•	fallback entre modelos
	•	monitoreo de costo
	•	monitoreo de latencia
	•	monitoreo de calidad
	•	logs de intervención IA
	•	revisión humana de respuestas críticas
IA en este módulo
Automatización IA estimada: 60%
Qué hace la IA
	•	autoenrutamiento por tipo de tarea
	•	self-check básico
	•	evaluación de confianza
	•	sugerencia de escalar a humano
	•	detección de alucinación probable por falta de fuente
Humano indispensable
	•	definir políticas de uso
	•	aprobar cambios de prompt críticos
	•	revisar incidentes

8.21 Módulo 21. Catálogos maestros
Catálogos mínimos
	•	aseguradoras
	•	ramos
	•	productos
	•	plantillas documentales
	•	causales de ticket
	•	tipos de evidencia
	•	canales de venta
	•	etapas de pipeline
	•	tipos de cliente
	•	territorios / sucursales
	•	tablas de comisiones
	•	estatus operativos
IA en este módulo
Automatización IA estimada: 25%
La IA ayuda a clasificar y sugerir normalización, pero no debe gobernar sola los catálogos maestros.

8.22 Módulo 22. Administración de documentos y storage
Funciones
	•	almacenamiento por bucket lógico
	•	versionado
	•	etiquetado
	•	firma hash
	•	conservación y archivado
	•	permisos de lectura/escritura
	•	vínculos a expediente/póliza/caso
	•	vista previa
	•	OCR pipeline
IA en este módulo
Automatización IA estimada: 70%
Qué hace la IA
	•	etiquetado automático
	•	clasificación
	•	detección de duplicado
	•	resumen documental
	•	extracción estructurada
Humano indispensable
	•	decisión de borrado / retención excepcional
	•	resolución de colisiones documentales

9. Matriz maestra de automatización IA por módulo
Módulo
% IA estimado
Nivel de automatización
Observación
Login y seguridad
10%
Bajo
seguridad y autenticación deben ser deterministas
Onboarding organizacional
35%
Bajo-Medio
IA ayuda a estructurar, no gobierna
Roles y permisos
20%
Bajo
humano define privilegios críticos
CRM leads/clientes
65%
Medio-Alto
excelente terreno para IA
Pipeline operativo
70%
Alto
IA prioriza y empuja operación
Expediente vivo
75%
Alto
consolidación y completitud
Originación de pólizas
80%
Muy alto
el gran motor de eficiencia
Knowledge hub
85%
Muy alto
IA responde sobre fuentes cargadas
Cotización comparativa
60%
Medio-Alto
criterio final humano
Emisión / endosos
45%
Medio
control humano necesario
Cobranza / finanzas
70%
Alto
matching y recordatorios muy automatizables
Renovaciones
75%
Alto
automatización rentable
Tickets / aclaraciones
75%
Alto
clasificación, resumen y borradores
Siniestros / evidencias
85%
Muy alto
OCR + transcripción + timeline
App cliente
70%
Alto
autoservicio guiado
Mensajería omnicanal
80%
Muy alto
fuerte apalancamiento IA
Tareas / agenda
65%
Medio-Alto
copiloto operativo
Reportes / BI
55%
Medio
narrativas y alertas
Compliance / auditoría
50%
Medio
IA detecta, humano sanciona
Centro de IA
60%
Medio-Alto
IA se gobierna con reglas
Catálogos maestros
25%
Bajo
control humano
Storage documental
70%
Alto
clasificación y extracción
10. Matriz de permisos por perfil
Leyenda
	•	V = Ver
	•	C = Crear
	•	E = Editar
	•	A = Aprobar / Autorizar
	•	X = No permitido
Función / Perfil
P1 Admin PM
P2 Agente cédula
P3 Apoderado
P4 Broker cédula
P5 Broker sin cédula
P6 Emisión
P7 Finanzas
P8 Servicio
P9 Cumplimiento
P10 RH colectivo
P11/P12 Cliente
Ver leads
V
V
V
V
V
V
X
V
V
X
X
Crear lead
C
C
C
C
C
X
X
X
X
X
C
Editar lead
E
E
E
E
E limitado
X
X
X
X
X
E limitado
Abrir expediente
C/E/A
C/E
C/E
C/E
C preliminar
V
X
V
V
C colectivo
C datos propios
Validar expediente final
A
A
A
E/A según permiso
X
A
X
X
V/A auditoría
X
X
Consultar knowledge hub
V/A
V
V
V
V restringido
V
V básico
V
V
V básico
V resumido
Responder con base documental al cliente
A
C/E
C/E
C/E
C borrador
X
X
C/E
V
X
chatbot guiado
Cotizar
A
C/E
C/E
C/E según ramo
X
X
X
X
V
X
solicitar cotización
Emitir flujo interno
A
E/A según permiso
E/A según permiso
X o limitado
X
C/E/A
X
X
V
X
X
Autorizar emisión final
A
A según política
A según política
X
X
A
X
X
V
X
X
Cargar documentos
V/C/E/A
C/E
C/E
C/E
C/E
C/E
C/E pagos
C/E
V
C/E colectivo
C/E propios
Subir evidencias de pago
V
V
V
V
V
X
C/E/A
V
V
C/E grupo
C/E propio
Validar comprobante de pago
A
V
V
X
X
X
A
X
V
X
X
Gestionar tickets
A
C/E
C/E
C/E comercial
C básico
X
C pagos
A/C/E
V
C/E grupo
C/E propios
Gestionar siniestros
A
C/E
C/E
C/E básico
C preliminar
X
X
A/C/E
V
C/E colectivo
C/E propios
Ver cartera / pipeline
V/A
V
V
V propia
V propia
V emisión
X
V servicio
V
V grupo
V propios
Ver finanzas / comisiones
A
V propia
V propia
V limitada
X
X
V/A
X
V auditoría
V colectiva limitada
X
Administrar usuarios
A
X
X
X
X
X
X
X
V
X
X
Cambiar permisos
A
X
X
X
X
X
X
X
V
X
X
Ver auditoría IA
A
V parcial
V parcial
X
X
X
X
X
A
X
X
Aprobar excepciones
A
A según política
A según política
X
X
A emisión
A pagos
A servicio
A auditoría
X
X
Firma / aceptación digital cliente
V
V
V
V
V
V
V
V
V
V
C/A propia
Regla operativa recomendada
Todo P5 Broker sin cédula debe quedar técnicamente impedido para:
	•	emitir o aprobar emisión,
	•	alterar condiciones sensibles,
	•	validar cumplimiento,
	•	dar respuesta contractual final sin revisión,
	•	cerrar un flujo que requiera asesoría formal certificada.

11. Lógica de IA: qué motor usar para qué
11.1 Capa de IA recomendada (arquitectura híbrida)
A. Orquestación principal y razonamiento operativo
Proveedor recomendado: OpenAI Modelo sugerido: GPT-5.4
Usar para:
	•	copiloto principal del agente
	•	clasificación de tickets
	•	generación de borradores
	•	resumen de expedientes
	•	extracción estructurada desde texto + imagen
	•	siguientes acciones sugeridas
	•	reasoning de workflow
	•	QA operativo
Razón
	•	muy fuerte en razonamiento profesional y workflows complejos
	•	entrada texto + imagen
	•	buen fit como cerebro central de orquestación
B. Voz, transcripción y tiempo real
Proveedor recomendado: OpenAI Modelos sugeridos:
	•	gpt-4o-transcribe
	•	gpt-4o-transcribe-diarize
	•	gpt-realtime para experiencias de voz en tiempo real
Usar para:
	•	transcripción de notas de voz
	•	llamadas resumidas
	•	diarización de reuniones
	•	captura guiada por voz
	•	asistentes de voz futuros
C. Lectura de documentos muy largos y análisis de bibliotecas extensas
Proveedor recomendado: Anthropic Modelo sugerido: Claude Sonnet 4.6
Usar para:
	•	comparar condiciones generales largas
	•	analizar varias versiones de documentos
	•	QA legal-operativo sobre paquetes documentales extensos
	•	consultas pesadas sobre bibliotecas documentales internas
Razón
	•	ventana de contexto muy amplia
	•	muy buen desempeño en lectura y síntesis de grandes paquetes documentales
D. OCR estructurado de documentos reales del negocio
Proveedor recomendado: Google Cloud Document AI Procesadores sugeridos:
	•	Form Parser
	•	Enterprise Document OCR
Usar para:
	•	formularios
	•	documentos con tablas
	•	checkboxes
	•	formularios escaneados
	•	expedientes estandarizados
E. OCR alterno / respaldo / ciertos documentos complejos
Proveedor recomendado: AWS Textract
Usar para:
	•	documentos escaneados complejos
	•	handwriting cuando el caso lo amerite
	•	tablas complejas
	•	firmas detectadas
	•	fallback multi-engine
F. OCR semántico complementario
Proveedor recomendado: Mistral OCR
Usar para:
	•	PDFs con layout complicado
	•	documentos difíciles como backup semántico
	•	validación secundaria de OCR cuando el confidence score sea bajo
G. Capa de velocidad opcional para lotes de audio o tareas no críticas
Proveedor opcional: Groq
Usar para:
	•	transcripción rápida masiva de audios no críticos
	•	procesos batch donde la velocidad importe más que el control central
H. Mensajería y notificaciones
Proveedor recomendado: Twilio + canales nativos
Usar para:
	•	WhatsApp oficial
	•	recordatorios
	•	follow-ups
	•	mensajes transaccionales
I. Mobile stack cliente
Tecnología recomendada: React + Capacitor
Plugins base
	•	Camera
	•	Filesystem
	•	Push Notifications
	•	HTTP / network
	•	Share / file opener

12. Diseño de agentes IA internos
12.1 Agente Capturista
Toma conversación, documentos y audios y arma campos estructurados.
12.2 Agente Documental
Clasifica, extrae, indexa y resume documentos.
12.3 Agente de Conocimiento
Responde preguntas usando la biblioteca oficial cargada.
12.4 Agente de Seguimiento
Genera recordatorios, próximos pasos y mensajes.
12.5 Agente de Cobranza
Hace matching de comprobantes, seguimiento de pagos y alertas.
12.6 Agente de Renovación
Identifica cartera próxima, riesgos de fuga y campañas.
12.7 Agente de Servicio
Clasifica tickets, redacta respuesta y resume casos.
12.8 Agente de Siniestros y Evidencias
Arma timeline, clasifica evidencias y detecta faltantes.
12.9 Agente de Compliance
Detecta huecos regulatorios, expediente incompleto o acciones fuera de permiso.
12.10 Agente Ejecutivo
Resume KPIs, cartera, equipos y hallazgos de operación.

13. Reglas de seguridad y gobernanza de IA
	0.	Toda respuesta contractual o regulatoria debe tener fuente documental.
	0.	Toda respuesta de baja confianza debe escalar a humano.
	0.	Todo documento crítico debe almacenar versión, hash y origen.
	0.	Todo campo extraído por OCR debe guardar confidence score.
	0.	Toda acción sensible debe registrar actor humano/IA.
	0.	Toda aceptación digital debe guardar evidencia de consentimiento.
	0.	Toda intervención de IA debe poder auditarse.
	0.	No se permite que IA altere texto contractual oficial.
	0.	No se permite a perfiles restringidos emitir, aprobar o modificar actos críticos.
	0.	Los datos sensibles deben ir con controles de acceso reforzado.

14. Requisitos de datos y entidades base
14.1 Entidades mínimas
	•	organizations
	•	branches
	•	users
	•	user_roles
	•	regulatory_profiles
	•	insurers
	•	insurance_products
	•	lines_of_business
	•	clients
	•	client_contacts
	•	policies
	•	policy_movements
	•	quotes
	•	quote_options
	•	pipelines
	•	pipeline_stages
	•	deals/cases
	•	documents
	•	document_versions
	•	extracted_fields
	•	evidence_items
	•	payments
	•	receipts
	•	commissions
	•	tickets
	•	claims
	•	messages
	•	tasks
	•	knowledge_documents
	•	knowledge_versions
	•	ai_runs
	•	audit_logs
	•	consents
	•	signature_events
	•	notifications
	•	collective_groups
	•	collective_members

14.1A Centro Regulatorio y Documental de Consulta
Objetivo
Dar a agentes, apoderados, backoffice y perfiles autorizados una biblioteca viva de consulta rápida con documentos regulatorios, operativos y contractuales para seguros y fianzas.
Contenido mínimo
	•	condiciones generales por producto
	•	términos y condiciones por seguro
	•	carátulas modelo
	•	endosos modelo
	•	pólizas modelo
	•	pólizas históricas importadas
	•	manuales internos
	•	políticas operativas del despacho
	•	reglas por aseguradora
	•	guías internas de emisión, cobranza, aclaraciones y siniestros
	•	documentos básicos de consulta regulatoria en seguros y fianzas
	•	glosarios operativos y legales
Funciones clave
	•	importar documentos desde PDF, imagen o carga manual
	•	versionar por aseguradora, producto, ramo y vigencia
	•	indexar para búsqueda semántica
	•	consultar por chat con respuesta trazable
	•	comparar documento vigente contra versión anterior
	•	cruzar póliza importada contra la biblioteca activa
	•	sugerir documento de soporte adecuado según pregunta del usuario
Regla de uso
Toda respuesta de soporte documental o regulatorio debe estar anclada a la biblioteca cargada y mostrar fuente/versionado dentro del flujo.
14.2 Integración transversal - Xoria (AL-E Core)
Definición dentro del producto
Xoria no se implementa como un chatbot aislado. Se implementa como una capa transversal de copiloto operativo que vive encima del sistema y se conecta por API al Core independiente.
Regla de arquitectura
	•	Xoria se despliega como servicio independiente.
	•	Insurance Agent OS consume la API de Xoria.
	•	Se reutiliza Supabase Auth/JWT para sesión unificada.
	•	No se mezcla memoria entre usuarios.
	•	La base de conocimiento de seguros se alimenta desde el sistema hacia Xoria.
	•	Recomendación inicial: cualquier envío automático por email/Telegram queda en modo aprobación humana (auto_send_enabled = false).
Dónde se coloca en la experiencia
A. Acceso global permanente
Sí debe existir una burbuja flotante global para agentes y perfiles internos.
Ubicación recomendada:
	•	desktop: esquina inferior derecha
	•	tablet: esquina inferior derecha
	•	mobile interno: botón flotante o tab dedicado según layout
Esta burbuja sirve para:
	•	preguntas rápidas
	•	comandos operativos
	•	resumen del día
	•	acciones inmediatas
	•	consulta de memoria/contexto
B. Dock contextual lateral
Además de la burbuja, Xoria debe vivir como panel lateral contextual dentro de las pantallas críticas. Este es el placement más valioso.
Pantallas donde debe aparecer como panel contextual:
	•	expediente vivo del cliente
	•	motor de originación de pólizas
	•	pipeline operativo
	•	email hub
	•	knowledge hub
	•	reuniones/minutas
	•	tickets/aclaraciones/siniestros
	•	cobranza/recibos
Función del panel contextual:
	•	leer el contexto exacto de la vista
	•	proponer siguiente acción
	•	responder sobre el expediente actual
	•	redactar borradores con contexto
	•	resumir documentos/reuniones/casos
	•	convertir lenguaje natural en acciones
C. Dashboard inicial del agente
En el home del agente, Xoria debe aparecer como tarjeta principal de briefing ejecutivo.
Contenido recomendado:
	•	pendientes críticos del día
	•	clientes que requieren seguimiento
	•	correos urgentes
	•	pólizas por vencer
	•	tickets abiertos
	•	tareas derivadas de reuniones
	•	sugerencias de acción priorizadas
D. Modalidad móvil externa de aprobación
Telegram debe manejarse como canal secundario de productividad móvil para alertas y aprobaciones, no como interfaz principal del producto.
Mapeo de Xoria dentro del sistema
Xoria se incrusta en estos módulos ya existentes
1. CRM + Pipeline operativo
	•	resume leads y oportunidades
	•	sugiere siguiente paso
	•	agenda seguimientos
	•	detecta estancamientos
	•	redacta mensajes
2. Expediente vivo
	•	recuerda historial del cliente
	•	resume acuerdos previos
	•	recupera memoria persistente
	•	contesta dudas sobre ese cliente o póliza
3. Motor de originación
	•	convierte conversación en datos estructurados
	•	ayuda a completar formularios
	•	explica qué falta para cotizar o emitir
4. Knowledge Hub
	•	responde con base en documentos cargados
	•	consulta condiciones, tarifarios y manuales
	•	cita fuente documental dentro del flujo
5. Email Hub / AI Email
	•	analiza correos entrantes
	•	clasifica urgencia, tema y acción requerida
	•	redacta borradores
	•	sugiere respuestas
	•	programa follow-up
6. Agenda / tareas / reuniones
	•	agenda citas desde lenguaje natural
	•	detecta conflictos
	•	genera recordatorios
	•	graba, transcribe y resume reuniones
	•	extrae acuerdos y pendientes
7. Evidencias / documentos / OCR
	•	ingesta documentos al RAG
	•	extrae texto de PDFs/imágenes
	•	vuelve consultable el material oficial
8. Notificaciones y aprobaciones
	•	dispara recordatorios
	•	avisa eventos críticos
	•	envía alertas a Telegram/email/push
Lo que Xoria sí es dentro del producto
	•	asistente personal del agente
	•	capa operativa de memoria y ejecución
	•	copiloto contextual del expediente
	•	motor de consulta documental
	•	asistente de correo, agenda y reuniones
Lo que Xoria no debe ser
	•	pantalla inicial única del sistema
	•	reemplazo del pipeline o del expediente
	•	chatbot decorativo sin contexto
	•	canal autónomo de envío no supervisado en etapa inicial
Vista recomendada por perfil
Perfiles internos (P1 a P9)
Sí tienen acceso a Xoria, con distinta profundidad según permisos.
Perfiles externos cliente (P10 a P12)
No se recomienda exponer Xoria completa al cliente final en la primera fase. En cliente externo solo conviene un asistente limitado para:
	•	dudas frecuentes
	•	guía de carga documental
	•	estatus de trámite
	•	ayuda básica de app
Entradas UX recomendadas
	0.	Burbuja global - acceso rápido universal.
	0.	Panel lateral contextual - motor real de productividad.
	0.	Briefing en dashboard - valor inmediato al entrar.
	0.	Aprobaciones por Telegram - movilidad ejecutiva.
Módulo técnico propuesto en blueprint
14.3 Módulo 23. Xoria - Copiloto Operativo Transversal
Objetivo
Conectar el Core propio de Xoria como capa operativa viva del sistema, sin duplicar lógica conversacional ni reconstruir memoria, correo, agenda, reuniones o knowledge query dentro del producto principal.
Capacidades integradas desde Xoria
	•	chat orquestador principal
	•	memoria persistente por agente
	•	perfil/configuración del asistente
	•	sesiones conversacionales
	•	gestión de correo conectado
	•	análisis y borradores de email
	•	agenda y calendar actions
	•	voz, STT y TTS
	•	reuniones con transcripción y minuta
	•	ingesta documental a RAG
	•	knowledge query
	•	notificaciones programadas
	•	OCR básico y consulta documental
	•	Telegram para alertas y aprobaciones
	•	runtime capabilities para mostrar al frontend qué funciones están activas
Diseño de interacción recomendado
	•	Home: tarjeta “Xoria hoy”
	•	Global: burbuja persistente
	•	Contexto: panel lateral derecho
	•	Mobile interno: acceso desde tab o FAB
	•	Cliente externo: asistente reducido, no full copilot
Dependencias de integración
	•	mismo Supabase Auth/JWT o proyecto compatible
	•	dominio agregado a ALE_ALLOWED_ORIGINS
	•	consumo de API REST del Core
	•	sincronización de contexto cliente/póliza/caso al invocar
Sí, ya estaba contemplado, pero para que no quedara ambiguo lo reforcé explícitamente en el blueprint.
Ya quedó metido así:
Sí incluye biblioteca de consulta regulatoria y documental
Quedó un bloque formal de:
Centro Regulatorio y Documental de Consulta
Ahí entra:
	•	documentos básicos de consulta de seguros y fianzas
	•	reglas y políticas por aseguradora
	•	manuales internos
	•	glosarios operativos y legales
	•	guías de emisión, cobranza, aclaraciones y siniestros
	•	términos y condiciones por producto
	•	condiciones generales
	•	carátulas modelo
	•	endosos modelo
	•	pólizas modelo
O sea, sí: la IA tendrá soporte “a la mano” para que el agente consulte rápido sin andar escarbando PDFs como topo con corbata.
Sí puse importación de pólizas
También lo dejé más claro en el motor de originación:
	•	importación de pólizas vigentes o históricas
	•	desde PDF, imagen o archivo estructurado
	•	lectura de datos reutilizables
	•	recuperación de:
	•	coberturas
	•	vigencias
	•	deducibles
	•	datos del cliente
	•	datos del riesgo
	•	normalización de esos datos para meterlos al expediente
Eso sirve para:
	•	no volver a capturar desde cero
	•	renovar más rápido
	•	comparar contra nuevas propuestas
	•	detectar huecos o diferencias
Sí puse carga de términos y condiciones de cada seguro
Ya quedó explícito que pueden subir:
	•	términos y condiciones
	•	condiciones generales
	•	endosos
	•	pólizas modelo
	•	reglas comerciales por aseguradora
	•	documentos de soporte
Y la IA podrá:
	•	leerlos
	•	indexarlos
	•	responder sobre ellos
	•	citar fuente y versión
	•	comparar documentos
	•	cruzar una póliza importada contra sus condiciones y endosos
	•	traducir lenguaje técnico a lenguaje humano
La regla importante que dejé
No quise dejar a la IA como adivina de feria. Entonces también quedó esta lógica:
toda respuesta documental, regulatoria o contractual debe estar anclada a la biblioteca cargada y mostrar fuente/versionado.
Eso es lo fino. No solo “que lea PDFs”, sino que responda con trazabilidad.
En resumen
Sí quedó ya reforzado que el sistema debe permitir:
	•	importar pólizas
	•	subir términos y condiciones
	•	subir documentos de soporte
	•	subir reglas/políticas
	•	tener biblioteca de consulta de seguros y fianzas
	•	hacer que la IA lea todo eso y funcione como soporte operativo inmediato
La estructura ya no está en modo “más o menos”. Ya quedó amarrada.


Diseño 

Tipografia Questrial 

Colores  

Acentos 


  Estilos 










Diseño landing 



