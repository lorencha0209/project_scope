// Project Scope - Additional Functions
// Extending the ProjectScopeApp class with remaining functionality

// Wait for ProjectScopeApp to be available
function initializeExtensions() {
    console.log('Attempting to initialize extensions...');
    console.log('ProjectScopeApp available:', typeof ProjectScopeApp !== 'undefined');
    console.log('window.ProjectScopeApp available:', typeof window.ProjectScopeApp !== 'undefined');
    
    if (typeof ProjectScopeApp === 'undefined' && typeof window.ProjectScopeApp === 'undefined') {
        console.error('ProjectScopeApp is not defined. Retrying in 100ms...');
        setTimeout(initializeExtensions, 100);
        return;
    }
    
    // Use window.ProjectScopeApp if ProjectScopeApp is not directly available
    const ProjectScopeAppClass = ProjectScopeApp || window.ProjectScopeApp;

    // Add these methods to the ProjectScopeApp class
    Object.assign(ProjectScopeAppClass.prototype, {
    
    // Board Tab Functions
    loadBoardTab() {
        const container = document.getElementById('project-tab-content');
        const currentSprint = this.getCurrentSprint();
        
        if (!currentSprint) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-tasks text-6xl text-gray-400 mb-4"></i>
                    <h3 class="text-xl font-semibold title-color mb-2">No hay Sprint Activo</h3>
                    <p class="text-gray-600 mb-4">Crea un sprint para comenzar a usar el tablero Kanban</p>
                    <button onclick="app.openCreateSprintModal()" class="btn-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90">
                        <i class="fas fa-plus mr-2"></i>Crear Sprint
                    </button>
                </div>
            `;
            return;
        }
        
        const sprintProgress = this.calculateSprintProgress(currentSprint);
        
        container.innerHTML = `
            <div class="mb-6">
                <div class="bg-white rounded-lg shadow p-6 mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-semibold title-color">${currentSprint.name}</h3>
                        <button onclick="app.openAddColumnModal()" class="btn-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                            <i class="fas fa-plus mr-2"></i>Agregar Columna
                        </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span class="text-gray-600">Fecha Inicio:</span>
                            <span class="font-medium">${currentSprint.startDate}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Fecha Fin:</span>
                            <span class="font-medium">${currentSprint.endDate}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Progreso:</span>
                            <span class="font-medium">${sprintProgress}%</span>
                        </div>
                    </div>
                    <div class="mt-4">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: ${sprintProgress}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="flex space-x-4 overflow-x-auto" id="kanban-board">
                    ${this.data.columns.sort((a, b) => (a.order_index || a.order || 0) - (b.order_index || b.order || 0)).map(column => `
                        <div class="flex-shrink-0 w-80 kanban-column-container" data-column-id="${column.id}">
                            <div class="bg-white rounded-lg shadow">
                                <div class="p-4 border-b flex justify-between items-center">
                                    <h4 class="font-semibold title-color">${column.name}</h4>
                            ${column.id !== 'todo' && column.id !== 'progress' && column.id !== 'blocked' && column.id !== 'done' ? `
                                <button onclick="event.stopPropagation(); app.deleteColumn('${column.id}')" class="text-red-500 hover:text-red-700 text-sm">
                                    <i class="fas fa-trash"></i>
                                </button>
                            ` : ''}
                                </div>
                                <div class="p-4 kanban-column" data-column-id="${column.id}">
                                    ${this.getTasksForColumn(column.id, currentSprint.taskIds || []).map(task => `
                                        <div class="task-card bg-white border border-gray-200 rounded-lg p-3 mb-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow" data-task-id="${task.id}" onclick="app.showTaskDetails('${task.id}')">
                                            <h5 class="font-medium text-sm mb-2">${task.title}</h5>
                                            <p class="text-xs text-gray-600 mb-2">${task.description || 'Sin descripción'}</p>
                                            <div class="flex justify-between items-center">
                                                <span class="text-xs px-2 py-1 rounded-full ${this.getPriorityColor(task.priority)}">${task.priority}</span>
                                                <span class="text-xs text-gray-500">${task.assignee || 'Sin asignar'}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.initializeKanbanBoard();
    },
    
    getCurrentSprint() {
        if (!this.data.sprints || !Array.isArray(this.data.sprints)) {
            return null;
        }
        return this.data.sprints
            .filter(sprint => (sprint.projectId || sprint.project_id) === this.currentProject)
            .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at))[0];
    },
    
    calculateSprintProgress(sprint) {
        const startDate = new Date(sprint.start_date || sprint.startDate);
        const endDate = new Date(sprint.end_date || sprint.endDate);
        const currentDate = new Date();
        
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const elapsedDays = Math.ceil((currentDate - startDate) / (1000 * 60 * 60 * 24));
        
        if (elapsedDays <= 0) return 0;
        if (elapsedDays >= totalDays) return 100;
        
        return Math.round((elapsedDays / totalDays) * 100);
    },
    
    getTasksForColumn(columnId, sprintTaskIds) {
        if (!this.data.tasks || !Array.isArray(this.data.tasks)) {
            return [];
        }
        
        // Map column IDs to both Spanish and English status values
        const statusMap = {
            'todo': ['Por Hacer', 'todo'],
            'progress': ['En Progreso', 'in_progress'],
            'blocked': ['Impedimento', 'blocked'],
            'done': ['Terminado', 'done']
        };
        
        const allowedStatuses = statusMap[columnId] || [this.data.columns.find(c => c.id === columnId)?.name || 'Por Hacer'];
        
        const columnTasks = this.data.tasks.filter(task => 
            sprintTaskIds.includes(task.id) && allowedStatuses.includes(task.status)
        );
        
        return columnTasks;
    },
    
    getColumnStatus(columnId) {
        const statusMap = {
            'todo': 'Por Hacer',
            'progress': 'En Progreso',
            'blocked': 'Impedimento',
            'done': 'Terminado'
        };
        return statusMap[columnId] || this.data.columns.find(c => c.id === columnId)?.name || 'Por Hacer';
    },
    
    initializeKanbanBoard() {
        const columns = document.querySelectorAll('.kanban-column');
        
        columns.forEach(column => {
            new Sortable(column, {
                group: 'kanban',
                animation: 150,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                onEnd: (evt) => {
                    this.moveTask(evt.item.dataset.taskId, evt.to.dataset.columnId);
                }
            });
        });
        
        // Initialize column drag and drop
        const board = document.getElementById('kanban-board');
        new Sortable(board, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            onEnd: (evt) => {
                this.reorderColumns();
            }
        });
    },
    
    async moveTask(taskId, columnId) {
        if (!this.data.tasks || !Array.isArray(this.data.tasks)) {
            return;
        }
        const task = this.data.tasks.find(t => t.id === taskId);
        if (task) {
            // Map column ID to English status for backend compatibility
            const statusMap = {
                'todo': 'todo',
                'progress': 'in_progress',
                'blocked': 'blocked',
                'done': 'done'
            };
            const newStatus = statusMap[columnId] || this.getColumnStatus(columnId);
            task.status = newStatus;
            
            // Update in database if using API
            if (this.useAPI && window.api) {
                try {
                    await window.api.updateTask(taskId, { status: newStatus });
                    console.log(`Task ${taskId} status updated to ${newStatus} in database`);
                } catch (error) {
                    console.error('Failed to update task status in database:', error);
                    // Revert the change if API call failed
                    task.status = task.status; // Keep original status
                    this.showNotification('Error al actualizar el estado de la tarea', 'error');
                    return;
                }
            }
            
            this.saveData();
            console.log(`Task ${taskId} moved to column ${columnId} with status ${newStatus}`);
        }
    },
    
    reorderColumns() {
        const containers = document.querySelectorAll('.kanban-column-container');
        containers.forEach((container, index) => {
            const columnId = container.dataset.columnId;
            const column = this.data.columns.find(c => c.id === columnId);
            if (column) {
                column.order = index;
            }
        });
        this.saveData();
    },
    
    deleteColumn(columnId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta columna? Las tareas se moverán a "Por Hacer".')) {
            // Move tasks from deleted column to "Por Hacer"
            this.data.tasks.forEach(task => {
                if (task.status === this.getColumnStatus(columnId)) {
                    task.status = 'Por Hacer';
                }
            });
            
            // Remove column
            this.data.columns = this.data.columns.filter(c => c.id !== columnId);
            this.saveData();
            this.loadBoardTab();
        }
    },
    
    // Metrics Tab Functions
    loadMetricsTab() {
        const container = document.getElementById('project-tab-content');
        const currentSprint = this.getCurrentSprint();
        
        // Prevent multiple simultaneous renders
        if (this.isRenderingMetrics) {
            return;
        }
        this.isRenderingMetrics = true;
        
        if (!currentSprint) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-chart-pie text-6xl text-gray-400 mb-4"></i>
                    <h3 class="text-xl font-semibold title-color mb-2">No hay Sprint Activo</h3>
                    <p class="text-gray-600">Crea un sprint para ver las métricas</p>
                </div>
            `;
            this.isRenderingMetrics = false;
            return;
        }
        
        const metrics = this.calculateSprintMetrics(currentSprint);
        
        container.innerHTML = `
            <div class="space-y-6">
                <!-- Metrics Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full bg-green-100 text-green-600">
                                <i class="fas fa-check-circle text-xl"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Tareas Finalizadas</p>
                                <p class="text-2xl font-semibold text-gray-900">${metrics.completed}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                <i class="fas fa-clock text-xl"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Tareas Pendientes</p>
                                <p class="text-2xl font-semibold text-gray-900">${metrics.pending}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full bg-red-100 text-red-600">
                                <i class="fas fa-exclamation-triangle text-xl"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Tareas en Impedimento</p>
                                <p class="text-2xl font-semibold text-gray-900">${metrics.blocked}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                                <i class="fas fa-tasks text-xl"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Total de Tareas</p>
                                <p class="text-2xl font-semibold text-gray-900">${metrics.total}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Charts -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-semibold title-color mb-4">Distribución de Tareas por Estado</h3>
                        <div style="position: relative; height: 300px;">
                            <canvas id="tasksChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-semibold title-color mb-4">Progreso del Sprint</h3>
                        <div style="position: relative; height: 300px;">
                            <canvas id="progressChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Use setTimeout to ensure DOM is ready and avoid rendering conflicts
        setTimeout(() => {
            this.renderCharts(metrics);
            this.isRenderingMetrics = false;
        }, 100);
    },
    
    calculateSprintMetrics(sprint) {
        if (!this.data.tasks || !Array.isArray(this.data.tasks) || !sprint.taskIds) {
            return { total: 0, completed: 0, inProgress: 0, blocked: 0 };
        }
        const sprintTasks = this.data.tasks.filter(task => sprint.taskIds.includes(task.id));
        
        return {
            total: sprintTasks.length,
            completed: sprintTasks.filter(task => task.status === 'done' || task.status === 'Terminado').length,
            pending: sprintTasks.filter(task => task.status === 'todo' || task.status === 'Por Hacer').length,
            inProgress: sprintTasks.filter(task => task.status === 'in_progress' || task.status === 'En Progreso').length,
            blocked: sprintTasks.filter(task => task.status === 'blocked' || task.status === 'Impedimento').length
        };
    },
    
    renderCharts(metrics) {
        // Destroy existing charts if they exist
        if (this.tasksChart) {
            this.tasksChart.destroy();
            this.tasksChart = null;
        }
        if (this.progressChart) {
            this.progressChart.destroy();
            this.progressChart = null;
        }
        
        // Check if canvas elements exist
        const tasksCanvas = document.getElementById('tasksChart');
        const progressCanvas = document.getElementById('progressChart');
        
        if (!tasksCanvas || !progressCanvas) {
            console.warn('Canvas elements not found, skipping chart rendering');
            return;
        }
        
        // Tasks Distribution Chart
        const tasksCtx = tasksCanvas.getContext('2d');
        this.tasksChart = new Chart(tasksCtx, {
            type: 'doughnut',
            data: {
                labels: ['Terminadas', 'Pendientes', 'En Progreso', 'Impedimento'],
                datasets: [{
                    data: [metrics.completed, metrics.pending, metrics.inProgress, metrics.blocked],
                    backgroundColor: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0 // Disable animations to prevent rendering loops
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        
        // Progress Chart (Venn-like visualization)
        const progressCtx = progressCanvas.getContext('2d');
        const expectedProgress = this.calculateSprintProgress(this.getCurrentSprint());
        const actualProgress = metrics.total > 0 ? (metrics.completed / metrics.total) * 100 : 0;
        
        this.progressChart = new Chart(progressCtx, {
            type: 'doughnut',
            data: {
                labels: ['Progreso Esperado', 'Progreso Real'],
                datasets: [{
                    data: [expectedProgress, actualProgress],
                    backgroundColor: ['#E5E7EB', '#3B82F6'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0 // Disable animations to prevent rendering loops
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    },
    
    // Schedule Tab Functions
    loadScheduleTab() {
        const container = document.getElementById('project-tab-content');
        const currentSprint = this.getCurrentSprint();
        
        if (!currentSprint) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-calendar-alt text-6xl text-gray-400 mb-4"></i>
                    <h3 class="text-xl font-semibold title-color mb-2">No hay Sprint Activo</h3>
                    <p class="text-gray-600">Crea un sprint para ver el cronograma</p>
                </div>
            `;
            return;
        }
        
        const sprintTasks = this.data.tasks.filter(task => currentSprint.taskIds.includes(task.id));
        
        container.innerHTML = `
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold title-color mb-6">Cronograma del Sprint</h3>
                <div class="overflow-x-auto">
                    <div class="min-w-full">
                        ${sprintTasks.map(task => {
                            const startDate = task.startDate ? new Date(task.startDate) : new Date(currentSprint.startDate);
                            const endDate = task.endDate ? new Date(task.endDate) : new Date(currentSprint.endDate);
                            const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                            
                            return `
                                <div class="flex items-center py-3 border-b border-gray-200">
                                    <div class="w-1/4 pr-4">
                                        <h4 class="font-medium text-gray-900">${task.title}</h4>
                                        <p class="text-sm text-gray-600">${task.assignee || 'Sin asignar'}</p>
                                    </div>
                                    <div class="w-3/4">
                                        <div class="relative">
                                            <div class="gantt-bar bg-blue-500" style="width: ${Math.max(duration * 20, 100)}px; margin-left: ${this.calculateGanttOffset(startDate, currentSprint.startDate)}px;">
                                                <span class="text-white text-xs px-2 py-1">${task.startDate || 'Sin fecha'} - ${task.endDate || 'Sin fecha'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    },
    
    calculateGanttOffset(taskStartDate, sprintStartDate) {
        const taskDate = new Date(taskStartDate);
        const sprintDate = new Date(sprintStartDate);
        const diffDays = Math.ceil((taskDate - sprintDate) / (1000 * 60 * 60 * 24));
        return Math.max(diffDays * 20, 0);
    },
    
    // Risks Tab Functions
    loadRisksTab() {
        const container = document.getElementById('project-tab-content');
        const projectRisks = this.data.risks.filter(risk => risk.projectId === this.currentProject);
        
        container.innerHTML = `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-semibold title-color">Gestión de Riesgos</h3>
                    <button onclick="app.openCreateRiskModal()" class="btn-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                        <i class="fas fa-plus mr-2"></i>Registrar Nuevo Riesgo
                    </button>
                </div>
                
                <!-- Risks Table -->
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Riesgo</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factor de Riesgo</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apetito del Riesgo</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${projectRisks.map(risk => `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${risk.id}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${risk.name}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${risk.riskFactor}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs rounded-full ${this.getRiskAppetiteClass(risk.appetite)}">${risk.appetite}</span>
                                    </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div class="flex space-x-2">
                                <button onclick="app.editRisk('${risk.id}')" class="text-blue-600 hover:text-blue-900" title="Editar riesgo">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="app.deleteRisk('${risk.id}')" class="text-red-600 hover:text-red-900" title="Eliminar riesgo">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Risk Matrix and Summary -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg shadow p-6">
                        <h4 class="text-lg font-semibold title-color mb-4">Matriz de Riesgos</h4>
                        <div class="risk-matrix">
                            <div class="risk-matrix-header"></div>
                            <div class="risk-matrix-header">1</div>
                            <div class="risk-matrix-header">2</div>
                            <div class="risk-matrix-header">3</div>
                            <div class="risk-matrix-header">4</div>
                            
                            <div class="risk-matrix-label">4</div>
                            <div class="risk-cell risk-extreme" data-impact="4" data-probability="1"></div>
                            <div class="risk-cell risk-extreme" data-impact="4" data-probability="2"></div>
                            <div class="risk-cell risk-extreme" data-impact="4" data-probability="3"></div>
                            <div class="risk-cell risk-extreme" data-impact="4" data-probability="4"></div>
                            
                            <div class="risk-matrix-label">3</div>
                            <div class="risk-cell risk-high" data-impact="3" data-probability="1"></div>
                            <div class="risk-cell risk-high" data-impact="3" data-probability="2"></div>
                            <div class="risk-cell risk-extreme" data-impact="3" data-probability="3"></div>
                            <div class="risk-cell risk-extreme" data-impact="3" data-probability="4"></div>
                            
                            <div class="risk-matrix-label">2</div>
                            <div class="risk-cell risk-moderate" data-impact="2" data-probability="1"></div>
                            <div class="risk-cell risk-moderate" data-impact="2" data-probability="2"></div>
                            <div class="risk-cell risk-high" data-impact="2" data-probability="3"></div>
                            <div class="risk-cell risk-high" data-impact="2" data-probability="4"></div>
                            
                            <div class="risk-matrix-label">1</div>
                            <div class="risk-cell risk-low" data-impact="1" data-probability="1"></div>
                            <div class="risk-cell risk-low" data-impact="1" data-probability="2"></div>
                            <div class="risk-cell risk-moderate" data-impact="1" data-probability="3"></div>
                            <div class="risk-cell risk-moderate" data-impact="1" data-probability="4"></div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-lg shadow p-6">
                        <h4 class="text-lg font-semibold title-color mb-4">Resumen de Riesgos</h4>
                        <div class="space-y-4">
                            <div>
                                <h5 class="font-medium text-gray-700 mb-2">Por Estado:</h5>
                                <div class="space-y-2">
                                    ${this.getRiskSummaryByStatus(projectRisks).map(item => `
                                        <div class="flex justify-between">
                                            <span>${item.status}:</span>
                                            <span class="font-medium">${item.count}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div>
                                <h5 class="font-medium text-gray-700 mb-2">Por Estrategia:</h5>
                                <div class="space-y-2">
                                    ${this.getRiskSummaryByStrategy(projectRisks).map(item => `
                                        <div class="flex justify-between">
                                            <span>${item.strategy}:</span>
                                            <span class="font-medium">${item.count}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.populateRiskMatrix(projectRisks);
    },
    
    getRiskAppetiteClass(appetite) {
        const classes = {
            'Riesgo Bajo': 'bg-green-100 text-green-800',
            'Riesgo Moderado': 'bg-yellow-100 text-yellow-800',
            'Riesgo Alto': 'bg-orange-100 text-orange-800',
            'Riesgo Extremo': 'bg-red-100 text-red-800'
        };
        return classes[appetite] || 'bg-gray-100 text-gray-800';
    },
    
    populateRiskMatrix(risks) {
        risks.forEach(risk => {
            const cell = document.querySelector(`[data-impact="${risk.impact}"][data-probability="${risk.probability}"]`);
            if (cell) {
                cell.textContent = risk.id;
                cell.classList.add('text-white', 'font-bold');
            }
        });
    },
    
    getRiskSummaryByStatus(risks) {
        const statusCount = {};
        risks.forEach(risk => {
            statusCount[risk.status] = (statusCount[risk.status] || 0) + 1;
        });
        return Object.entries(statusCount).map(([status, count]) => ({ status, count }));
    },
    
    getRiskSummaryByStrategy(risks) {
        const strategyCount = {};
        risks.forEach(risk => {
            strategyCount[risk.strategy] = (strategyCount[risk.strategy] || 0) + 1;
        });
        return Object.entries(strategyCount).map(([strategy, count]) => ({ strategy, count }));
    },
    
    deleteRisk(riskId) {
        if (confirm('¿Estás seguro de que quieres eliminar este riesgo?')) {
            this.data.risks = this.data.risks.filter(risk => risk.id !== riskId);
            this.saveData();
            this.loadRisksTab();
        }
    },

    editRisk(riskId) {
        const risk = this.data.risks.find(r => r.id === riskId);
        if (!risk) return;
        
        // Fill the edit form with current risk data
        document.getElementById('edit-risk-name').value = risk.name;
        document.getElementById('edit-risk-impact').value = risk.impact;
        document.getElementById('edit-risk-probability').value = risk.probability;
        document.getElementById('edit-risk-description').value = risk.description || '';
        document.getElementById('edit-risk-mitigation').value = risk.mitigation || '';
        document.getElementById('edit-risk-strategy').value = risk.strategy;
        document.getElementById('edit-risk-status').value = risk.status;
        
        // Store the risk ID for updating
        document.getElementById('edit-risk-form').dataset.riskId = riskId;
        
        // Show the modal
        document.getElementById('edit-risk-modal').classList.remove('hidden');
    },

    closeEditRiskModal() {
        document.getElementById('edit-risk-modal').classList.add('hidden');
        document.getElementById('edit-risk-form').reset();
        delete document.getElementById('edit-risk-form').dataset.riskId;
    },

    updateRisk() {
        const riskId = document.getElementById('edit-risk-form').dataset.riskId;
        if (!riskId) return;
        
        const risk = this.data.risks.find(r => r.id === riskId);
        if (!risk) return;
        
        // Update risk data
        risk.name = document.getElementById('edit-risk-name').value;
        risk.impact = parseInt(document.getElementById('edit-risk-impact').value);
        risk.probability = parseInt(document.getElementById('edit-risk-probability').value);
        risk.description = document.getElementById('edit-risk-description').value;
        risk.mitigation = document.getElementById('edit-risk-mitigation').value;
        risk.strategy = document.getElementById('edit-risk-strategy').value;
        risk.status = document.getElementById('edit-risk-status').value;
        
        // Recalculate risk factor and appetite
        risk.riskFactor = risk.impact * risk.probability;
        risk.appetite = this.getRiskAppetite(risk.riskFactor);
        
        this.saveData();
        this.closeEditRiskModal();
        this.loadRisksTab();
        
        alert('Riesgo actualizado exitosamente');
    },

    // Sprints Tab Functions
    loadSprintsTab() {
        const container = document.getElementById('project-tab-content');
        const projectSprints = this.data.sprints.filter(sprint => (sprint.projectId || sprint.project_id) === this.currentProject);
        
        container.innerHTML = `
            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold title-color">Sprints del Proyecto</h3>
                    <button onclick="app.openCreateSprintModal()" class="btn-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                        <i class="fas fa-plus mr-2"></i>Crear Sprint
                    </button>
                </div>
                
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Fin</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tareas</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${projectSprints.length === 0 ? 
                                '<tr><td colspan="7" class="text-center text-gray-500 py-4">No hay sprints creados</td></tr>' :
                                projectSprints.map(sprint => `
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${sprint.id}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sprint.name}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sprint.start_date || sprint.startDate}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sprint.end_date || sprint.endDate}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sprint.status === 'active' ? 'bg-green-100 text-green-800' : sprint.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}">
                                                ${sprint.status === 'active' ? 'Activo' : sprint.status === 'completed' ? 'Completado' : 'Planificación'}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sprint.taskIds ? sprint.taskIds.length : 0}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onclick="app.editSprint('${sprint.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                                            <button onclick="app.deleteSprint('${sprint.id}')" class="text-red-600 hover:text-red-900">Eliminar</button>
                                        </td>
                                    </tr>
                                `).join('')
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // Minutes Tab Functions
    loadMinutesTab() {
        const container = document.getElementById('project-tab-content');
        const projectMinutes = this.data.meetingMinutes.filter(minutes => (minutes.projectId || minutes.project_id) === this.currentProject);
        
        container.innerHTML = `
            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold title-color">Actas del Proyecto</h3>
                    <button onclick="app.openCreateMinutesModal()" class="btn-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                        <i class="fas fa-plus mr-2"></i>Crear Acta
                    </button>
                </div>
                
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${projectMinutes.length === 0 ? 
                                '<tr><td colspan="5" class="text-center text-gray-500 py-4">No hay actas creadas</td></tr>' :
                                projectMinutes.map(minutes => `
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${minutes.id}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${minutes.title}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${minutes.date || minutes.meeting_date}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${new Date(minutes.createdAt).toLocaleDateString()}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onclick="app.editMinutes('${minutes.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                                            <button onclick="app.deleteMinutes('${minutes.id}')" class="text-red-600 hover:text-red-900">Eliminar</button>
                                        </td>
                                    </tr>
                                `).join('')
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },
    
    loadMinutesContent(minutesId) {
        const minutes = this.data.meetingMinutes.find(m => m.id === minutesId);
        if (!minutes) return;
        
        const container = document.getElementById('minutes-content');
        container.innerHTML = `
            <div class="flex justify-between items-start mb-6">
                <div class="flex-1">
                    <div id="minutes-title-display" class="text-xl font-semibold title-color mb-2">${minutes.title}</div>
                    <div id="minutes-date-display" class="text-gray-600">${new Date(minutes.date).toLocaleDateString('es-ES')}</div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="app.editMinutes('${minutes.id}')" class="btn-edit text-gray-800 px-4 py-2 rounded-lg hover:bg-opacity-90">
                        <i class="fas fa-edit mr-2"></i>Editar
                    </button>
                    <button onclick="app.deleteMinutes('${minutes.id}')" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                        <i class="fas fa-trash mr-2"></i>Eliminar
                    </button>
                </div>
            </div>
            
            <div id="minutes-content-display" class="prose max-w-none">
                ${minutes.content || '<p class="text-gray-500 italic">No hay contenido disponible</p>'}
            </div>
        `;
    },
    
    initializeRichTextEditor(editorId) {
        const editor = document.getElementById(editorId);
        
        // Add formatting buttons
        const toolbar = document.createElement('div');
        toolbar.className = 'mb-4 flex space-x-2 border-b pb-2';
        toolbar.innerHTML = `
            <button type="button" onclick="document.execCommand('bold')" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">
                <i class="fas fa-bold"></i>
            </button>
            <button type="button" onclick="document.execCommand('italic')" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">
                <i class="fas fa-italic"></i>
            </button>
            <button type="button" onclick="document.execCommand('underline')" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">
                <i class="fas fa-underline"></i>
            </button>
            <button type="button" onclick="document.execCommand('insertUnorderedList')" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">
                <i class="fas fa-list-ul"></i>
            </button>
            <button type="button" onclick="document.execCommand('insertOrderedList')" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">
                <i class="fas fa-list-ol"></i>
            </button>
        `;
        
        editor.parentNode.insertBefore(toolbar, editor);
    },
    
    saveMinutesContent(minutesId) {
        const minutes = this.data.meetingMinutes.find(m => m.id === minutesId);
        if (minutes) {
            const titleInput = document.getElementById('minutes-title-edit');
            const dateInput = document.getElementById('minutes-date-edit');
            const editor = document.getElementById(`minutes-editor-${minutesId}`);
            
            if (titleInput) {
                minutes.title = titleInput.value;
            }
            if (dateInput) {
                minutes.date = dateInput.value;
            }
            if (editor) {
                minutes.content = editor.innerHTML;
            }
            
            this.saveData();
            alert('Acta guardada exitosamente');
            
            // Return to read mode
            this.loadMinutesContent(minutesId);
        }
    },
    
    editMinutes(minutesId) {
        const minutes = this.data.meetingMinutes.find(m => m.id === minutesId);
        if (!minutes) return;
        
        const container = document.getElementById('minutes-content');
        container.innerHTML = `
            <div class="flex justify-between items-start mb-6">
                <div class="flex-1">
                    <input type="text" id="minutes-title-edit" value="${minutes.title}" class="text-xl font-semibold title-color mb-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <input type="date" id="minutes-date-edit" value="${minutes.date}" class="text-gray-600 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="flex space-x-2">
                    <button onclick="app.saveMinutesContent('${minutes.id}')" class="btn-save text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                        <i class="fas fa-save mr-2"></i>Guardar
                    </button>
                    <button onclick="app.cancelEditMinutes('${minutes.id}')" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                        <i class="fas fa-times mr-2"></i>Cancelar
                    </button>
                </div>
            </div>
            
            <div class="rich-text-editor" id="minutes-editor-${minutes.id}" contenteditable="true">
                ${minutes.content || '<p>Escribe el contenido del acta aquí...</p>'}
            </div>
        `;
        
        // Initialize rich text editor
        this.initializeRichTextEditor(`minutes-editor-${minutes.id}`);
    },
    
    cancelEditMinutes(minutesId) {
        // Return to read mode without saving
        this.loadMinutesContent(minutesId);
    },
    
    deleteMinutes(minutesId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta acta?')) {
            this.data.meetingMinutes = this.data.meetingMinutes.filter(m => m.id !== minutesId);
            this.saveData();
            this.loadMinutesTab();
        }
    }
});

// Add CSS for risk matrix
const style = document.createElement('style');
style.textContent = `
    .risk-matrix {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 2px;
        max-width: 300px;
        margin: 0 auto;
    }
    
    .risk-cell {
        width: 100%;
        height: 50px;
        border: 1px solid #333;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        min-height: 50px;
    }
    
    .risk-matrix-header {
        font-size: 11px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        background-color: #f8f9fa;
        border: 1px solid #333;
        height: 50px;
        min-height: 50px;
    }
    
    .risk-matrix-label {
        font-size: 11px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        background-color: #f8f9fa;
        border: 1px solid #333;
        writing-mode: vertical-rl;
        text-orientation: mixed;
        height: 50px;
        min-height: 50px;
    }
`;

    // Add CSS styles to the page
    document.head.appendChild(style);

    console.log('Project Scope Extensions loaded successfully');
}

// Initialize extensions when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtensions);
} else {
    initializeExtensions();
}
