// Project Scope - Demo Data
// Este archivo contiene datos de ejemplo para demostrar la aplicación

const demoData = {
    projects: [
        {
            id: "demo-project-1",
            name: "Desarrollo de E-commerce",
            description: "Plataforma de comercio electrónico con carrito de compras y sistema de pagos",
            createdAt: "2024-12-15T10:00:00.000Z"
        },
        {
            id: "demo-project-2", 
            name: "App Móvil de Delivery",
            description: "Aplicación móvil para pedidos de comida a domicilio",
            createdAt: "2024-12-20T14:30:00.000Z"
        }
    ],
    tasks: [
        {
            id: "T1",
            projectId: "demo-project-1",
            title: "Diseñar interfaz de usuario",
            description: "Crear mockups y prototipos de la interfaz principal",
            assignee: "María García",
            priority: "Alta",
            startDate: "2024-12-16",
            endDate: "2024-12-25",
            comments: "Priorizar experiencia móvil",
            status: "En Progreso",
            createdAt: "2024-12-15T10:30:00.000Z"
        },
        {
            id: "T2",
            projectId: "demo-project-1",
            title: "Implementar carrito de compras",
            description: "Desarrollar funcionalidad de agregar/quitar productos del carrito",
            assignee: "Carlos López",
            priority: "Crítica",
            startDate: "2024-12-20",
            endDate: "2025-01-05",
            comments: "Incluir persistencia en localStorage",
            status: "Por Hacer",
            createdAt: "2024-12-15T11:00:00.000Z"
        },
        {
            id: "T3",
            projectId: "demo-project-1",
            title: "Integrar sistema de pagos",
            description: "Conectar con pasarela de pagos Stripe",
            assignee: "Ana Martínez",
            priority: "Crítica",
            startDate: "2025-01-01",
            endDate: "2025-01-15",
            comments: "Probar en ambiente sandbox primero",
            status: "Por Hacer",
            createdAt: "2024-12-15T11:30:00.000Z"
        },
        {
            id: "T4",
            projectId: "demo-project-2",
            title: "Configurar geolocalización",
            description: "Implementar seguimiento de ubicación para delivery",
            assignee: "Roberto Silva",
            priority: "Alta",
            startDate: "2024-12-22",
            endDate: "2025-01-10",
            comments: "Considerar privacidad del usuario",
            status: "Terminado",
            createdAt: "2024-12-20T15:00:00.000Z"
        },
        {
            id: "T5",
            projectId: "demo-project-2",
            title: "Desarrollar notificaciones push",
            description: "Sistema de notificaciones para actualizaciones de pedidos",
            assignee: "Laura Rodríguez",
            priority: "Media",
            startDate: "2025-01-05",
            endDate: "2025-01-20",
            comments: "Usar Firebase Cloud Messaging",
            status: "Impedimento",
            createdAt: "2024-12-20T15:30:00.000Z"
        }
    ],
    sprints: [
        {
            id: "demo-sprint-1",
            projectId: "demo-project-1",
            name: "Sprint 1",
            startDate: "2024-12-16",
            endDate: "2025-01-05",
            taskIds: ["T1", "T2"],
            createdAt: "2024-12-15T12:00:00.000Z"
        },
        {
            id: "demo-sprint-2",
            projectId: "demo-project-2",
            name: "Sprint 1",
            startDate: "2024-12-22",
            endDate: "2025-01-20",
            taskIds: ["T4", "T5"],
            createdAt: "2024-12-20T16:00:00.000Z"
        }
    ],
    risks: [
        {
            id: "R1",
            projectId: "demo-project-1",
            name: "Retraso en integración de pagos",
            impact: 3,
            probability: 2,
            riskFactor: 6,
            appetite: "Riesgo Alto",
            description: "Posible retraso debido a cambios en la API de Stripe",
            mitigation: "Mantener comunicación constante con el equipo de Stripe y tener plan B",
            strategy: "Mitigar",
            status: "Activo",
            createdAt: "2024-12-15T13:00:00.000Z"
        },
        {
            id: "R2",
            projectId: "demo-project-2",
            name: "Problemas de permisos de ubicación",
            impact: 2,
            probability: 3,
            riskFactor: 6,
            appetite: "Riesgo Alto",
            description: "Los usuarios pueden negar permisos de ubicación",
            mitigation: "Implementar fallback con selección manual de ubicación",
            strategy: "Mitigar",
            status: "Mitigado",
            createdAt: "2024-12-20T16:30:00.000Z"
        }
    ],
    meetingMinutes: [
        {
            id: "demo-minutes-1",
            projectId: "demo-project-1",
            title: "Reunión de Kick-off del Proyecto",
            date: "2024-12-15",
            content: `
                <h2>Reunión de Kick-off - Desarrollo de E-commerce</h2>
                <p><strong>Fecha:</strong> 15 de Diciembre, 2024</p>
                <p><strong>Participantes:</strong> María García, Carlos López, Ana Martínez</p>
                
                <h3>Agenda:</h3>
                <ul>
                    <li>Presentación del proyecto</li>
                    <li>Definición de roles y responsabilidades</li>
                    <li>Revisión de cronograma</li>
                    <li>Identificación de riesgos</li>
                </ul>
                
                <h3>Decisiones tomadas:</h3>
                <ul>
                    <li>María será responsable del diseño UX/UI</li>
                    <li>Carlos desarrollará el carrito de compras</li>
                    <li>Ana se encargará de la integración de pagos</li>
                    <li>Primer sprint iniciará el 16 de diciembre</li>
                </ul>
                
                <h3>Próximos pasos:</h3>
                <ul>
                    <li>Crear mockups de alta fidelidad</li>
                    <li>Configurar entorno de desarrollo</li>
                    <li>Reunión de seguimiento el 22 de diciembre</li>
                </ul>
            `,
            createdAt: "2024-12-15T14:00:00.000Z"
        },
        {
            id: "demo-minutes-2",
            projectId: "demo-project-2",
            title: "Revisión de Arquitectura Técnica",
            date: "2024-12-20",
            content: `
                <h2>Revisión de Arquitectura - App Móvil de Delivery</h2>
                <p><strong>Fecha:</strong> 20 de Diciembre, 2024</p>
                <p><strong>Participantes:</strong> Roberto Silva, Laura Rodríguez</p>
                
                <h3>Arquitectura propuesta:</h3>
                <ul>
                    <li>Frontend: React Native</li>
                    <li>Backend: Node.js con Express</li>
                    <li>Base de datos: MongoDB</li>
                    <li>Notificaciones: Firebase Cloud Messaging</li>
                </ul>
                
                <h3>Decisiones técnicas:</h3>
                <ul>
                    <li>Usar Redux para manejo de estado</li>
                    <li>Implementar autenticación con JWT</li>
                    <li>Geolocalización con React Native Maps</li>
                </ul>
            `,
            createdAt: "2024-12-20T17:00:00.000Z"
        }
    ],
    columns: [
        { id: 'todo', name: 'Por Hacer', order: 0 },
        { id: 'progress', name: 'En Progreso', order: 1 },
        { id: 'blocked', name: 'Impedimento', order: 2 },
        { id: 'done', name: 'Terminado', order: 3 }
    ]
};

// Función para cargar datos de demostración
function loadDemoData() {
    if (confirm('¿Quieres cargar datos de demostración? Esto reemplazará cualquier dato existente.')) {
        localStorage.setItem('projectScopeData', JSON.stringify(demoData));
        location.reload();
    }
}

// Función para limpiar todos los datos
function clearAllData() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('projectScopeData');
        location.reload();
    }
}

// Los botones de demo ahora están integrados en el módulo de Gestión de Datos
// que se accede desde el sidebar principal
