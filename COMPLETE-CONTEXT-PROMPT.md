# 🚀 **Project Scope - Prompt Completo para Nueva Instancia**

## 📋 **Contexto del Proyecto**

Soy un desarrollador que ha creado una aplicación web completa de gestión de proyectos llamada "Project Scope" con las siguientes características:

### **🎯 Descripción General**
- **Aplicación**: Sistema de gestión de proyectos con metodología Agile
- **Tecnologías**: HTML, CSS (TailwindCSS), JavaScript (Frontend) + Node.js, Express, MySQL (Backend)
- **Arquitectura**: Frontend estático + Backend API + Base de datos MySQL
- **Seguridad**: Autenticación JWT con usuario único
- **Despliegue**: GitHub Pages (Frontend) + Vercel (Backend) + Railway (PostgreSQL)

## 🏗️ **Arquitectura Implementada**

### **Frontend (GitHub Pages)**
```
┌─────────────────┐
│   GitHub Pages  │
│   (Frontend)    │
│   index.html    │
│   CSS/JS        │
└─────────────────┘
```

### **Backend (Vercel)**
```
┌─────────────────┐
│   Vercel        │
│   (Node.js API) │
│   Backend API   │
│   Gratis        │
└─────────────────┘
```

### **Base de Datos (Railway)**
```
┌─────────────────┐
│   Railway       │
│   (PostgreSQL)  │
│   Base de datos │
│   Gratis        │
└─────────────────┘
```

### **Desarrollo Local**
```
┌─────────────────┐
│   Tu Computadora │
│   (Desarrollo)  │
│   Backend API   │
│   Local/Server  │
└─────────────────┘
```

## 📁 **Estructura de Archivos Completa**

### **Directorio Principal**
```
Project_Scope/
├── index.html                    # Página principal
├── app.js                        # Lógica principal de la aplicación
├── app-extensions.js             # Funcionalidades extendidas
├── api-client.js                 # Cliente API para desarrollo
├── api-client-production.js      # Cliente API para producción
├── demo-data.js                  # Datos de demostración
├── package.json                  # Dependencias del backend
├── server.js                     # Servidor principal
├── env.example                   # Variables de entorno
├── env                           # Variables de entorno actuales
├── start.sh                      # Script de inicio rápido
├── test-security.sh              # Script de pruebas de seguridad
├── config/
│   └── database.js              # Conexión a MySQL
├── middleware/
│   └── auth.js                  # Middleware de autenticación JWT
├── routes/
│   ├── auth.js                  # Rutas de autenticación
│   ├── projects.js              # CRUD de proyectos
│   ├── tasks.js                 # CRUD de tareas
│   ├── sprints.js               # CRUD de sprints
│   ├── risks.js                 # CRUD de riesgos
│   ├── minutes.js               # CRUD de actas
│   └── columns.js               # CRUD de columnas Kanban
├── scripts/
│   ├── database-schema.sql       # Esquema de base de datos
│   ├── init-database.js          # Inicialización automática
│   └── generate-password-hash.js # Generador de hash de contraseñas
├── vercel-backend/               # Archivos para Vercel
│   ├── api/
│   │   └── index.js             # API principal para Vercel
│   ├── package.json
│   ├── vercel.json              # Configuración de Vercel
│   ├── database-schema.sql      # Esquema PostgreSQL
│   └── README.md
└── Documentación/
    ├── README-BACKEND.md
    ├── MIGRATION-GUIDE.md
    ├── SECURITY-MODULE.md
    ├── SECURITY-IMPLEMENTATION-SUMMARY.md
    ├── FREE-HOSTING-GUIDE.md
    └── DEPLOYMENT-GUIDE.md
```

## 🎨 **Diseño y UI/UX**

### **Paleta de Colores**
- **Fondo principal**: Blanco (#EFF0E4)
- **Títulos**: (#335a82)
- **Botones (Crear/Nuevo)**: Azul oscuro (#213754)
- **Botones (Guardar)**: Verde (#228575)
- **Botones (Editar)**: #ffcc99

### **Layout**
- **Diseño**: Dos columnas (sidebar fijo + contenido principal)
- **Sidebar**: Fondo azul pastel, logo circular, menú de navegación
- **Responsive**: Diseño adaptable con TailwindCSS
- **Iconos**: Font Awesome para iconografía

### **Componentes Principales**
- **Modal de login**: Interfaz moderna con validación
- **Modal de creación**: Para proyectos, tareas, sprints, riesgos
- **Kanban board**: Drag & drop con Sortable.js
- **Tablas**: Con funcionalidades CRUD completas
- **Gráficos**: Chart.js para métricas y análisis

## 🔧 **Funcionalidades Implementadas**

### **1. Sistema de Autenticación**
- **Usuario único**: `lorena.alvarez` / `Anto0929**`
- **JWT**: Tokens seguros con expiración de 24 horas
- **Protección**: Todas las rutas requieren autenticación
- **Rate limiting**: Protección contra ataques de fuerza bruta
- **Logout**: Limpieza completa de sesión

### **2. Gestión de Proyectos**
- **CRUD completo**: Crear, leer, actualizar, eliminar proyectos
- **Vista de tarjetas**: Grid responsive con información del proyecto
- **Navegación**: Acceso directo a gestión de proyecto específico
- **Estadísticas**: Contador de sprints y tareas por proyecto

### **3. Gestión de Tareas**
- **IDs consecutivos**: T1, T2, T3... con prefijo "T"
- **Campos completos**: Título, descripción, responsable, prioridad, fechas
- **Estados**: Por Hacer, En Progreso, Impedimento, Terminado
- **Edición**: Modal completo para modificar tareas
- **Asignación a sprints**: Tareas pueden agregarse a sprints existentes

### **4. Gestión de Sprints**
- **IDs consecutivos**: Sprint 1, Sprint 2, Sprint 3...
- **Fechas**: Inicio y fin del sprint
- **Tareas múltiples**: Selección de varias tareas para crear sprint
- **Progreso**: Porcentaje de completado automático
- **Estados**: Planning, Active, Completed

### **5. Kanban Board**
- **Columnas por defecto**: Por Hacer, En Progreso, Impedimento, Terminado
- **Columnas personalizadas**: Crear, editar, eliminar columnas
- **Drag & drop**: Tareas y columnas movibles
- **Información de tareas**: Popup con detalles completos
- **Reordenamiento**: Persistencia del orden de columnas

### **6. Gestión de Riesgos**
- **IDs consecutivos**: R1, R2, R3... con prefijo "R"
- **Matriz de riesgos**: 4x4 con impacto vs probabilidad
- **Cálculos automáticos**: Factor de riesgo y apetito
- **Colores**: Verde, amarillo, naranja, rojo según nivel
- **Campos completos**: Nombre, descripción, plan de mitigación, estrategia
- **Edición**: Modal completo para modificar riesgos

### **7. Actas del Proyecto**
- **Editor de texto enriquecido**: Para contenido de actas
- **Fechas**: Ordenamiento descendente por fecha
- **CRUD completo**: Crear, leer, actualizar, eliminar actas
- **Vista dual**: Lista + panel de lectura/edición
- **Persistencia**: Contenido guardado en base de datos

### **8. Métricas y Análisis**
- **Gráfico de pastel**: Distribución de tareas por estado
- **Gráfico de Venn**: Progreso esperado vs actual
- **Tarjetas de estadísticas**: Totales por estado
- **Chart.js**: Librería para visualizaciones

### **9. Cronograma**
- **Gráfico de Gantt**: Visualización de tareas del sprint
- **Fechas**: Inicio y fin de tareas
- **Progreso**: Barras de progreso visual

## 🗄️ **Base de Datos PostgreSQL**

### **Tablas Principales**
```sql
-- Usuarios (autenticación)
users (id, username, email, password_hash, full_name, is_active, created_at, updated_at)

-- Proyectos
projects (id, name, description, status, created_at, updated_at)

-- Sprints
sprints (id, project_id, name, start_date, end_date, status, created_at, updated_at)

-- Tareas
tasks (id, project_id, title, description, status, priority, responsible, start_date, end_date, comments, created_at, updated_at)

-- Relación Sprint-Tarea
sprint_tasks (id, sprint_id, task_id, created_at)

-- Columnas Kanban
kanban_columns (id, project_id, name, order_index, is_default, created_at, updated_at)

-- Riesgos
risks (id, project_id, name, description, impact, probability, risk_factor, appetite, mitigation_plan, strategy, status, created_at, updated_at)

-- Actas
minutes (id, project_id, title, content, meeting_date, created_at, updated_at)
```

### **Características de la Base de Datos**
- **Foreign keys**: Integridad referencial
- **Índices**: Optimización de consultas
- **Campos calculados**: risk_factor y appetite automáticos
- **Cascade deletes**: Mantenimiento de consistencia
- **Transacciones**: Operaciones complejas

## 🔐 **Sistema de Seguridad**

### **Autenticación JWT**
- **Usuario por defecto**: lorena.alvarez / Anto0929**
- **Hash de contraseña**: bcrypt con salt rounds
- **Tokens JWT**: Firmados con clave secreta
- **Expiración**: 24 horas por defecto
- **Verificación**: En cada request al servidor

### **Protección de Rutas**
- **Middleware**: Verificación automática de tokens
- **Rutas protegidas**: Todas excepto login y health check
- **Redirección**: Automática al login si no está autenticado
- **Rate limiting**: 5 intentos por 15 minutos

### **Seguridad del Cliente**
- **Almacenamiento**: localStorage para tokens
- **Verificación**: Check automático al cargar
- **Logout**: Automático en caso de token inválido
- **CORS**: Configurado para dominios específicos

## 🌐 **API REST Completa**

### **Endpoints de Autenticación**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/verify` - Verificar token
- `GET /api/auth/me` - Información del usuario
- `POST /api/auth/refresh` - Renovar token

### **Endpoints de Proyectos**
- `GET /api/projects` - Listar proyectos
- `GET /api/projects/:id` - Obtener proyecto
- `POST /api/projects` - Crear proyecto
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### **Endpoints de Tareas**
- `GET /api/tasks?project_id=:id` - Listar tareas
- `GET /api/tasks/:id` - Obtener tarea
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- `POST /api/tasks/:id/sprint` - Agregar a sprint
- `DELETE /api/tasks/:id/sprint/:sprint_id` - Remover de sprint

### **Endpoints de Sprints**
- `GET /api/sprints?project_id=:id` - Listar sprints
- `GET /api/sprints/:id` - Obtener sprint
- `POST /api/sprints` - Crear sprint
- `PUT /api/sprints/:id` - Actualizar sprint
- `DELETE /api/sprints/:id` - Eliminar sprint
- `POST /api/sprints/:id/tasks` - Agregar tareas
- `DELETE /api/sprints/:id/tasks/:task_id` - Remover tarea

### **Endpoints de Riesgos**
- `GET /api/risks?project_id=:id` - Listar riesgos
- `GET /api/risks/:id` - Obtener riesgo
- `POST /api/risks` - Crear riesgo
- `PUT /api/risks/:id` - Actualizar riesgo
- `DELETE /api/risks/:id` - Eliminar riesgo
- `GET /api/risks/stats/:project_id` - Estadísticas

### **Endpoints de Actas**
- `GET /api/minutes?project_id=:id` - Listar actas
- `GET /api/minutes/:id` - Obtener acta
- `POST /api/minutes` - Crear acta
- `PUT /api/minutes/:id` - Actualizar acta
- `DELETE /api/minutes/:id` - Eliminar acta

### **Endpoints de Columnas**
- `GET /api/columns?project_id=:id` - Listar columnas
- `GET /api/columns/:id` - Obtener columna
- `POST /api/columns` - Crear columna
- `PUT /api/columns/:id` - Actualizar columna
- `DELETE /api/columns/:id` - Eliminar columna
- `PUT /api/columns/reorder` - Reordenar columnas

## 🚀 **Configuración de Despliegue**

### **Variables de Entorno**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password123
DB_NAME=project_scope

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:8080

# JWT Configuration
JWT_SECRET=project-scope-secret-key-2024-change-in-production
JWT_EXPIRY=24h
```

### **Dependencias del Backend**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "body-parser": "^1.20.2",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "express-rate-limit": "^7.1.5"
  }
}
```

### **Scripts Disponibles**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "init-db": "node scripts/init-database.js"
  }
}
```

## 🔧 **Comandos de Instalación**

### **Instalación Local**
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar base de datos
cp env.example .env
# Editar .env con credenciales MySQL

# 3. Inicializar base de datos
npm run init-db

# 4. Iniciar servidor
npm start

# 5. Probar seguridad
./test-security.sh
```

### **Despliegue en Producción**
```bash
# Frontend (GitHub Pages)
# 1. Crear repositorio en GitHub
# 2. Subir archivos principales directamente a la raíz:
#    - index.html
#    - app.js
#    - app-extensions.js
#    - api-client.js
#    - demo-data.js
# 3. Habilitar GitHub Pages en Settings → Pages

# Backend (Vercel)
cd vercel-backend
npm install
vercel login
vercel

# Base de Datos (Railway)
# 1. Crear proyecto en railway.app
# 2. Provisionar PostgreSQL
# 3. Configurar variables de entorno en Vercel
```

## 📊 **Flujo de Datos**

1. **Usuario accede**: Frontend desde GitHub Pages
2. **Verificación**: Check de autenticación automático
3. **Login**: Si no está autenticado, modal de login
4. **API calls**: Requests a backend en Vercel
5. **Procesamiento**: Backend valida y procesa requests
6. **Base de datos**: Operaciones CRUD en PostgreSQL (Railway)
7. **Respuesta**: Datos vuelven al frontend
8. **Renderizado**: UI se actualiza con nuevos datos

## 🎯 **Funcionalidades Clave**

### **Navegación**
- **Vista Home**: Saludo personalizado, tareas en progreso, proyectos recientes
- **Vista Proyectos**: Grid de tarjetas con estadísticas
- **Vista Proyecto**: Gestión completa con 6 sub-pestañas
- **Vista Análisis**: "Próximamente" para futuras funcionalidades

### **Sub-pestañas del Proyecto**
1. **Tareas**: Lista única con selección múltiple para sprints
2. **Tablero**: Kanban con drag & drop
3. **Métricas**: Gráficos y estadísticas
4. **Cronograma**: Gantt chart
5. **Riesgos**: Matriz de riesgos y gestión
6. **Actas**: Editor de texto enriquecido

### **Modales y Popups**
- **Login**: Autenticación con validación
- **Crear Proyecto**: Nombre y descripción
- **Crear Tarea**: Campos completos + asignación a sprint
- **Crear Sprint**: Fechas + selección de tareas
- **Crear Riesgo**: Todos los campos + matriz
- **Crear Acta**: Título, fecha, contenido
- **Editar**: Modales para tareas y riesgos
- **Detalles**: Popups informativos

## 🔍 **Características Técnicas**

### **Frontend**
- **Vanilla JavaScript**: Sin frameworks, código puro
- **TailwindCSS**: Estilos utilitarios
- **Font Awesome**: Iconografía
- **Chart.js**: Gráficos y visualizaciones
- **Sortable.js**: Drag & drop
- **Responsive**: Diseño adaptable

### **Backend**
- **Node.js**: Runtime de JavaScript
- **Express**: Framework web
- **MySQL2**: Driver de base de datos
- **JWT**: Autenticación
- **bcryptjs**: Hash de contraseñas
- **CORS**: Configuración de orígenes
- **Rate Limiting**: Protección contra ataques

### **Base de Datos**
- **PostgreSQL**: Base de datos relacional avanzada
- **UTF8**: Codificación completa
- **Índices**: Optimización de consultas
- **Constraints**: Integridad referencial
- **Transacciones**: Operaciones atómicas
- **Railway**: Hosting gratuito con backup automático

## 📝 **Notas Importantes**

### **Desarrollo**
- **Fallback**: Si API no está disponible, usa localStorage
- **Detección automática**: Modo API vs localStorage
- **Manejo de errores**: Alertas y logging detallado
- **Validación**: Frontend y backend

### **Producción**
- **HTTPS**: Ambos servicios deben usar HTTPS
- **CORS**: Configurado para dominios específicos
- **Rate limiting**: Protección contra ataques
- **Logging**: Registro de eventos importantes

### **Seguridad**
- **Usuario único**: Solo lorena.alvarez puede acceder
- **Sin registro**: No hay módulo de creación de usuarios
- **Protección total**: Todas las rutas requieren autenticación
- **Logout completo**: Limpia datos y redirige al login

## 🎉 **Estado Actual**

- ✅ **Aplicación completa**: Frontend + Backend + Base de datos
- ✅ **Autenticación**: JWT con usuario único
- ✅ **CRUD completo**: Todas las entidades
- ✅ **UI/UX moderna**: Diseño responsive y intuitivo
- ✅ **Seguridad robusta**: Protección completa
- ✅ **Despliegue preparado**: GitHub Pages + Hostinger
- ✅ **Documentación completa**: Guías detalladas
- ✅ **Scripts de prueba**: Verificación automática

## 🚀 **Próximos Pasos Sugeridos**

1. **Desplegar en producción**: GitHub Pages + Vercel + Railway
2. **Configurar dominio personalizado**: Si es necesario
3. **Implementar backups**: De la base de datos
4. **Monitoreo**: Del rendimiento del backend
5. **Nuevas funcionalidades**: Según necesidades del usuario

## 📞 **Soporte y Mantenimiento**

- **Logs**: Revisar logs del servidor para debugging
- **Base de datos**: Monitorear rendimiento y espacio
- **API**: Verificar endpoints con herramientas como Postman
- **Frontend**: Revisar consola del navegador para errores
- **Seguridad**: Mantener dependencias actualizadas

---

**Este prompt contiene TODO el contexto necesario para continuar el desarrollo de Project Scope en una nueva instancia de Cursor. La aplicación está 100% funcional y lista para producción.**
