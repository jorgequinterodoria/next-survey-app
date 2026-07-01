## 1) Estado actual (resumen del sistema)

Stack y estructura

- Next.js App Router (React 19), Prisma + Postgres (Neon), generación de PDF (React-PDF + pdf-lib), Word (docx), Excel (ExcelJS), charts (SVG→PNG con sharp). Ver package.json .
- Dominios principales:
  - Encuesta pública : token de campaña, verificación por cédula, wizard de pantallas, persistencia y cálculo psicométrico. Ver app/page.tsx , submit , verify-cedula .
  - Admin : campañas/empresas/resultados/exportaciones/importaciones. Ver src/app/admin .
  - Reporting : PDF por participante, PDF listados, Word por campaña, Excel por campaña. Ver pdf-generators , psicosocial , api/admin/export , api/reports/\[campanaId] .
    Modelo de datos
- Entidades: Admin, Empresa, Campana, Participante, SurveyResponse. Ver schema.prisma .
- Datos sensibles almacenados como strings/JSON (firma, documento, respuestas, resultados): alto impacto para seguridad, cumplimiento y performance.

## 2) Hallazgos críticos (hoy) — lo que impide una “versión premium”

Seguridad (crítico)

- Rutas /api/admin/\* y /api/reports/\* no están protegidas por sesión/roles (el middleware solo cubre /admin/\* ). Ejemplos: middleware.ts , api/admin/export , api/reports .
- JWT\_SECRET tiene fallback inseguro (“your-secret-key”). Ver jwt.ts .
- Endpoints “dev” peligrosos (escritura de archivos y reprocesos masivos). Ver save-coords , reprocess .
  Performance/escalabilidad
- Exportes (Excel/Word/PDF) son operaciones CPU/RAM intensivas “en caliente” por request; en campañas grandes tenderán a timeouts/OOM. Ver api/admin/export , chartGenerator.svgToPng , api/reports .
  Calidad / mantenibilidad
- Hay deuda de tipado/linters (muchos any , warnings/errores). Esto frena evolución premium (CI/CD, seguridad, confiabilidad).

## 3) Backlog premium priorizado (mejoras específicas, medibles y viables)

### P0 — Bloqueadores (seguridad + confiabilidad)

1. Proteger todas las rutas sensibles /api/admin/\* y /api/reports/\* con auth + autorización

- Impacto: evita exfiltración total de datos, acceso no autorizado a exportes/importes.
- Complejidad: Media.
- Valor: Confianza + cumplimiento + habilita monetización B2B.
- Métrica: 100% de rutas admin/report retornan 401/403 sin sesión; pruebas automatizadas de acceso.

1. Eliminar defaults inseguros de JWT y endurecer sesión

- Impacto: evita forja de sesión.
- Complejidad: Baja.
- Valor: seguridad base.
- Métrica: app no inicia si falta JWT\_SECRET ; rotación documentada; cookies con flags correctos.

1. Deshabilitar endpoints /api/dev/\* en producción

- Impacto: elimina vector de corrupción de datos/defacement.
- Complejidad: Baja.
- Valor: seguridad y estabilidad.
- Métrica: /api/dev/\* retorna 404/403 en prod.

1. Reducir fuga de información en errores

- Impacto: evita exponer detalles internos (stack/DB) al cliente.
- Complejidad: Baja.
- Valor: seguridad + UX.
- Métrica: respuestas 5xx siempre “genéricas” + requestId ; logs internos con contexto.

1. Rate limiting + anti-enumeración para verify-cedula

- Impacto: reduce scraping de cédulas y fuga de elegibilidad/prefill.
- Complejidad: Media.
- Valor: cumplimiento y reputación.
- Métrica: límites (p.ej. 10 req/min/IP) + bloqueo progresivo + auditoría.

### P1 — Arquitectura y rendimiento (premium “enterprise-ready”)

1. Separar “generación pesada” (Excel/Word/PDF) a jobs asíncronos

- Impacto: elimina timeouts y mejora experiencia (estado “en proceso”, reintentos).
- Complejidad: Alta (cola + storage + estados).
- Valor: escalabilidad real + experiencia premium.
- Métrica: p95 export < 2s para “solicitud”, generación en background; reintentos; 0 timeouts.

1. Cache por campaña para exportes y charts

- Impacto: export repetido no recalcula PNGs ni re-procesa datos.
- Complejidad: Media.
- Valor: performance + costos.
- Métrica: 80–95% hits en campañas no modificadas; reducción CPU sharp.

1. Precalcular agregados por campaña (analytics) al momento del submit

- Impacto: el dashboard admin no necesita pasar JSON masivo al cliente.
- Complejidad: Media/Alta (tabla de agregados/versionado).
- Valor: panel rápido en campañas grandes.
- Métrica: payload admin results ↓ 90%; INP/LCP mejoran; tiempo de carga ↓.

1. Unificar y versionar el esquema de results

- Impacto: hoy conviven formatos (detallado anidado vs “flattened”); riesgo de inconsistencia.
- Complejidad: Media.
- Valor: mantenibilidad y evolución del motor psicométrico.
- Métrica: results.schemaVersion ; migración/compat; validación runtime.

1. Paginación/virtualización para listados de participantes/resultados

- Impacto: evita UI lenta por listas grandes.
- Complejidad: Media.
- Valor: UX premium.
- Métrica: renders estables con 10k+ filas; memoria y tiempo controlados.

### P1 — Seguridad avanzada (premium “compliance-grade”)

1. RBAC real (roles y permisos por Empresa/Campaña)

- Impacto: multi-empresa segura, delegación (admin, analista, auditor, solo-lectura).
- Complejidad: Alta (modelo + UI + enforcement).
- Valor: vendible a organizaciones.
- Métrica: matriz de permisos; auditoría de acceso; pruebas por rol.

1. Auditoría y trazabilidad

- Impacto: saber quién exportó, importó, cambió observaciones, generó reportes.
- Complejidad: Media.
- Valor: cumplimiento y “enterprise”.
- Métrica: tabla AuditLog; eventos críticos 100% registrados.

1. Protección CSRF para acciones con cookies

- Impacto: reduce ataques cross-site.
- Complejidad: Media.
- Valor: seguridad.
- Métrica: token CSRF en mutaciones + verificación; tests.

1. Políticas de retención y minimización de PII

- Impacto: reduce riesgo legal y de brecha.
- Complejidad: Media.
- Valor: compliance.
- Métrica: configuración por empresa/campaña (retención X meses), borrado/anónimo verificable.

1. Mover firmas/documentos base64 a storage (y guardar solo referencias)

- Impacto: DB más liviana, menos riesgo al replicar/backups, mejor performance.
- Complejidad: Media/Alta.
- Valor: escalabilidad + seguridad.
- Métrica: tamaño DB ↓; tiempos de consulta ↓; políticas de acceso a blobs.

### P2 — UI/UX premium (operación + confianza)

1. Centro de “Exportaciones y Reportes” con historial

- Impacto: UX tipo “premium”: estado, fecha, usuario, descarga, reintento.
- Complejidad: Media.
- Valor: operación diaria.
- Métrica: 100% exportes rastreables; reducción de tickets.

1. Dashboard ejecutivo por campaña

- Impacto: vista rápida (participación, distribución riesgos, focos críticos, comparativos A/B).
- Complejidad: Media.
- Valor: decisión gerencial.
- Métrica: NPS interno ↑; tiempo a insights ↓.

1. Calidad de datos (normalización asistida)

- Impacto: ciudades/departamentos inconsistentes; mejora análisis.
- Complejidad: Media.
- Valor: reportes más confiables.
- Métrica: % de “Sin datos/No marcado” ↓; deduplicación automática.

1. Accesibilidad WCAG y consistencia visual

- Impacto: usable en entornos corporativos.
- Complejidad: Media.
- Valor: profesionalización.
- Métrica: auditoría WCAG AA; navegación teclado completa.

1. Experiencia de encuesta: reanudación segura + guardado parcial

- Impacto: reduce abandono.
- Complejidad: Alta (estado parcial + tokens + expiración).
- Valor: tasa de completitud ↑.
- Métrica: completitud ↑ X%; abandono ↓.

### P2 — Funcionalidades premium (alto valor agregado)

1. Benchmarking (comparar campaña vs histórico empresa vs industria)

- Impacto: valor diferencial.
- Complejidad: Alta (modelo y datasets).
- Valor: “premium” claro.
- Métrica: reportes comparativos; insights accionables.

1. Recomendaciones automáticas basadas en riesgos detectados

- Impacto: convierte resultados en plan de acción.
- Complejidad: Media.
- Valor: clientes pagan por “qué hacer”.
- Métrica: recomendaciones generadas por dimensión/dominio; feedback útil.

1. Plan de intervención y seguimiento (tickets/acciones/owners)

- Impacto: pasa de diagnóstico a gestión.
- Complejidad: Alta.
- Valor: retención y upsell.
- Métrica: acciones creadas/cerradas; SLAs.

1. Alertas inteligentes

- Impacto: notifica umbrales (p.ej. alto+muy alto ≥ 30%).
- Complejidad: Media.
- Valor: operación proactiva.
- Métrica: alertas configurables; entrega por email/Slack.

1. White-labeling

- Impacto: marca del cliente (logo, colores, textos, pie de página).
- Complejidad: Media.
- Valor: monetizable como add-on.
- Métrica: temas por Empresa; exportes con branding.

### P2 — Integraciones avanzadas

1. SSO (SAML/OIDC) para admin

- Impacto: seguridad y adopción enterprise.
- Complejidad: Alta.
- Valor: ventas corporativas.
- Métrica: login SSO + SCIM opcional.

1. Integración HRIS / nómina (import automático de participantes)

- Impacto: reduce fricción (adiós excel manual).
- Complejidad: Alta.
- Valor: premium claro.
- Métrica: conectores o API; sincronización incremental.

1. API externa (read-only) para BI

- Impacto: clientes consumen métricas en PowerBI/Tableau.
- Complejidad: Media.
- Valor: enterprise.
- Métrica: endpoints versionados + scopes + rate limit.

### P1/P2 — Analítica y métricas (producto y operación)

1. Observabilidad end-to-end

- Impacto: detectar cuellos (exportes), errores, p95/p99.
- Complejidad: Media.
- Valor: estabilidad premium.
- Métrica: trazas + dashboards (latencia por endpoint, memory, error rate).

1. Métricas de negocio

- Impacto: monetización: funnels, activación, churn.
- Complejidad: Media.
- Valor: gestión del producto.
- Métrica: funnel encuesta (inicio→fin), tiempos, drop-off por pantalla.

### P1/P2 — Escalabilidad/operación (DevOps)

1. CI/CD con gates reales (typecheck + tests + security scans)

- Impacto: evita regresiones.
- Complejidad: Media.
- Valor: confiabilidad.
- Métrica: pipeline obligatorio; despliegues reproducibles.

1. Entornos (dev/stage/prod) y gestión de secretos

- Impacto: reduce incidentes por config.
- Complejidad: Media.
- Valor: enterprise readiness.
- Métrica: secretos solo en vault; rotación; checklist.

1. Backups, DR y pruebas de restore

- Impacto: continuidad del negocio.
- Complejidad: Media/Alta.
- Valor: vende confianza.
- Métrica: RPO/RTO definidos y probados.

### P2 — Documentación técnica mejorada

1. Documento de arquitectura (C4) + ADRs

- Impacto: acelera onboarding y cambios.
- Complejidad: Baja/Media.
- Valor: equipo y calidad.
- Métrica: diagramas + decisiones; actualizado por release.

1. Data dictionary + políticas de retención/PII

- Impacto: compliance y claridad.
- Complejidad: Media.
- Valor: enterprise.
- Métrica: inventario PII, base legal, retención, borrado.

1. Playbooks operativos

- Impacto: menos downtime.
- Complejidad: Media.
- Valor: operación premium.
- Métrica: runbook de incidentes, exportes lentos, colas, DB.

## 4) Estrategias de monetización (alineadas a mejoras)

- Planes por volumen : Nº de participantes/campañas/empresas + almacenamiento de evidencias (PDF/Excel/Word).
- Add-ons premium :
  - Benchmarking (industria/histórico).
  - White-labeling.
  - SSO/SAML.
  - Exportes asíncronos con historial + auditoría.
  - API para BI + conectores HRIS.
  - Módulo de plan de intervención y seguimiento.
- Modelo “por campaña” : precio por campaña cerrada + paquete de reportes.
- Modelo “por reporte ejecutivo” : informes comparativos y recomendaciones avanzadas con tarifa.

## 5) Priorización recomendada (ruta a “premium”)

- Semana 0 (P0 seguridad) : cerrar accesos a APIs admin/report/dev, secreto JWT obligatorio, rate limit, errores.
- Fase 1 (P1 estabilidad) : jobs asíncronos + storage + auditoría + agregados.
- Fase 2 (P2 premium) : benchmarking, recomendaciones, plan de intervención, SSO, integraciones, white-label.

