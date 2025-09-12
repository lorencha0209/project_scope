# Project Scope - GitHub Pages Configuration

Este archivo contiene la configuración necesaria para desplegar Project Scope en GitHub Pages.

## Archivos incluidos

- `index.html` - Página principal de la aplicación
- `app.js` - Lógica principal de la aplicación
- `app-extensions.js` - Funciones adicionales (Kanban, métricas, riesgos, etc.)
- `demo-data.js` - Datos de demostración y utilidades
- `package.json` - Configuración del proyecto
- `README.md` - Documentación principal
- `DEPLOYMENT.md` - Guía de despliegue
- `.gitignore` - Archivos a ignorar en Git

## Características técnicas

### Tecnologías utilizadas
- **HTML5** - Estructura semántica
- **CSS3 + TailwindCSS** - Estilos modernos y responsivos
- **JavaScript ES6+** - Lógica de la aplicación
- **Chart.js** - Gráficos para métricas
- **SortableJS** - Drag and drop para Kanban
- **Font Awesome** - Iconografía
- **localStorage** - Persistencia de datos

### Funcionalidades implementadas
✅ **Vista de Inicio**
- Saludo personalizado según la hora
- Fecha y hora en tiempo real
- Resumen de tareas en progreso
- Lista de proyectos con enlaces

✅ **Gestión de Proyectos**
- Crear nuevos proyectos
- Eliminar proyectos
- Navegación a gestión específica

✅ **Gestión de Tareas**
- Crear tareas con todos los campos
- Tabla completa con filtros
- Selección múltiple para sprints
- Eliminación de tareas

✅ **Tablero Kanban**
- Drag and drop funcional
- Columnas personalizables
- Progreso de sprint automático
- Agregar nuevas columnas

✅ **Métricas**
- Tarjetas de resumen
- Gráfico de torta (Chart.js)
- Diagrama de progreso
- Cálculos automáticos

✅ **Gestión de Riesgos**
- Matriz de calor 4x4
- Cálculo automático de factor de riesgo
- Clasificación por apetito
- Resúmenes por estado y estrategia

✅ **Cronograma**
- Diagrama de Gantt visual
- Cálculo de duraciones
- Representación temporal

✅ **Actas de Reuniones**
- Editor de texto enriquecido
- Lista ordenada por fecha
- Funciones de editar/eliminar
- Persistencia de contenido

✅ **Persistencia de Datos**
- localStorage para todos los datos
- Recuperación automática al cargar
- Datos de demostración incluidos

✅ **Funcionalidades de Eliminación**
- Eliminar tareas individuales
- Eliminar proyectos (con confirmación)
- Eliminar riesgos
- Eliminar actas
- Limpiar todos los datos

## Instrucciones de uso

1. **Primera vez**: Usa "Cargar Datos Demo" para ver la aplicación con datos de ejemplo
2. **Crear proyecto**: Ve a "Proyectos" > "Crear Nuevo Proyecto"
3. **Gestionar tareas**: Accede al proyecto > pestaña "Tareas"
4. **Usar Kanban**: Pestaña "Tablero" para drag and drop
5. **Ver métricas**: Pestaña "Métricas" para gráficos
6. **Gestionar riesgos**: Pestaña "Gestión de Riesgos"
7. **Cronograma**: Pestaña "Cronograma" para Gantt
8. **Actas**: Pestaña "Actas del Proyecto" para reuniones

## Personalización

La aplicación está diseñada para ser fácilmente personalizable:

- **Colores**: Modifica las variables CSS en el `<style>` del HTML
- **Columnas Kanban**: Agrega desde la interfaz o modifica en el código
- **Estados de tareas**: Personaliza en `getStatusColor()` y `getColumnStatus()`
- **Campos adicionales**: Agrega nuevos campos en los modales

## Compatibilidad

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Dispositivos móviles (responsive)

## Rendimiento

- Carga inicial: ~2MB (incluyendo librerías)
- Tiempo de carga: <3 segundos
- Persistencia: Instantánea en localStorage
- Responsive: Optimizado para móviles

¡La aplicación está lista para ser desplegada en GitHub Pages!
