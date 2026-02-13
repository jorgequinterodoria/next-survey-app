

# Batería de Riesgo Psicosocial - App de Encuestas


## Módulo 1: Base de datos y autenticación de administrador

- Crear tablas en neon: `empresas`, `campañas`, `participantes`, `respuestas`, `admins`
- Login de administrador con email/contraseña vía neon en tabla admins (crear usuario admin con las credenciales: user: admin@neon.com, password: admin)
- Políticas RLS para proteger los datos por empresa/campaña

## Módulo 2: Panel de Administración

- **Dashboard principal:** vista general de campañas activas, total de respuestas por empresa
- **Gestión de empresas:** crear/editar empresas
- **Gestión de campañas:** crear campaña asociada a una empresa, generar enlace público único, activar/desactivar campaña
- **Resultados:** tabla de participantes con estado de completitud, filtros por empresa y campaña
- **Exportar a Excel:** descargar respuestas en formato CSV/Excel

## Módulo 3: Flujo del trabajador (encuesta)

El trabajador accede mediante el enlace público de la campaña e ingresa su **número de cédula** (sin contraseña). El sistema verifica si ya completó la encuesta para evitar duplicados.

### Secciones de la encuesta (paso a paso con stepper visual):
ya implementada

### Validaciones:
ya implementada

## Módulo 4: Diseño Mobile-First

ya implementado

## Módulo 5: Funcionalidades adicionales

- Guardado parcial del progreso (el trabajador puede retomar si cierra el navegador)
- Prevención de envío duplicado por cédula dentro de la misma campaña


