// Project Scope - Main Application JavaScript
class ProjectScopeApp {
    constructor() {
        this.currentView = 'home';
        this.currentProject = null;
        this.currentTab = 'tasks';
        this.data = this.loadData();
        this.tasksChart = null;
        this.progressChart = null;
        this.isRenderingMetrics = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDateTime();
        this.updateGreeting();
        this.showView('home');
        this.loadHomeData();
        
        // Update time every minute
        setInterval(() => {
            this.updateDateTime();
        }, 60000);
    }

    // Data Management
    loadData() {
        const defaultData = {
            projects: [
                {
                    id: "demo-project-1",
                    name: "Proyecto de Ejemplo",
                    description: "Este es un proyecto de demostración para verificar que las tarjetas se muestren correctamente",
                    createdAt: new Date().toISOString()
                }
            ],
            tasks: [],
            sprints: [],
            risks: [],
            meetingMinutes: [],
            columns: [
                { id: 'todo', name: 'Por Hacer', order: 0 },
                { id: 'progress', name: 'En Progreso', order: 1 },
                { id: 'blocked', name: 'Impedimento', order: 2 },
                { id: 'done', name: 'Terminado', order: 3 }
            ]
        };
        
        const saved = localStorage.getItem('projectScopeData');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }

    saveData() {
        localStorage.setItem('projectScopeData', JSON.stringify(this.data));
        localStorage.setItem('projectScopeLastModified', new Date().toISOString());
    }

    // Navigation
    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
        });
        
        // Show selected view
        const view = document.getElementById(`${viewName}-view`);
        if (view) {
            view.classList.remove('hidden');
            this.currentView = viewName;
        }
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('bg-white', 'bg-opacity-20');
        });
        
        if (viewName !== 'project-management') {
            const navItem = document.querySelector(`[onclick="showView('${viewName}')"]`);
            if (navItem) {
                navItem.classList.add('bg-white', 'bg-opacity-20');
            }
        }
        
        // Load specific view data
        switch (viewName) {
            case 'home':
                this.loadHomeData();
                break;
            case 'projects':
                this.loadProjectsView();
                break;
            case 'analytics':
                // Analytics view is static (coming soon)
                break;
        }
    }

    showProject(projectId) {
        this.currentProject = projectId;
        this.showView('project-management');
        this.updateProjectTitle();
        this.showProjectTab('tasks');
    }

    showProjectTab(tabName) {
        this.currentTab = tabName;
        
        // Clean up existing charts when switching tabs
        if (this.tasksChart) {
            this.tasksChart.destroy();
            this.tasksChart = null;
        }
        if (this.progressChart) {
            this.progressChart.destroy();
            this.progressChart = null;
        }
        
        // Reset rendering flags
        this.isRenderingMetrics = false;
        
        // Update tab buttons
        document.querySelectorAll('.project-tab').forEach(tab => {
            tab.classList.remove('border-blue-500', 'text-blue-600');
            tab.classList.add('border-transparent', 'text-gray-500');
        });
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.remove('border-transparent', 'text-gray-500');
            activeTab.classList.add('border-blue-500', 'text-blue-600');
        }
        
        // Load tab content
        this.loadProjectTabContent(tabName);
    }

    // UI Updates
    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.getElementById('datetime').textContent = now.toLocaleDateString('es-ES', options);
    }

    updateGreeting() {
        const hour = new Date().getHours();
        let greeting = 'Buenos días';
        
        if (hour >= 12 && hour < 18) {
            greeting = 'Buenas tardes';
        } else if (hour >= 18) {
            greeting = 'Buenas noches';
        }
        
        document.getElementById('greeting').textContent = `${greeting}, Lorena`;
    }

    updateProjectTitle() {
        const project = this.data.projects.find(p => p.id === this.currentProject);
        if (project) {
            document.getElementById('project-title').textContent = project.name;
        }
    }

    // Home View
    loadHomeData() {
        this.loadHomeTasks();
        this.loadHomeProjects();
    }

    loadHomeTasks() {
        const container = document.getElementById('home-tasks-list');
        const inProgressTasks = this.data.tasks.filter(task => 
            task.status === 'En Progreso' && task.projectId === this.currentProject
        );
        
        container.innerHTML = '';
        
        if (inProgressTasks.length === 0) {
            container.innerHTML = '<tr><td colspan="3" class="text-center text-gray-500 py-4">No hay tareas en progreso</td></tr>';
            return;
        }
        
        inProgressTasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2">${task.title}</td>
                <td class="py-2">
                    <span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">${task.status}</span>
                </td>
                <td class="py-2">${task.endDate || 'Sin fecha'}</td>
            `;
            container.appendChild(row);
        });
    }

    loadHomeProjects() {
        const container = document.getElementById('home-projects-list');
        container.innerHTML = '';
        
        // Add new project button
        const addButton = document.createElement('div');
        addButton.className = 'bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-200 transition-colors';
        addButton.innerHTML = `
            <i class="fas fa-plus text-3xl text-gray-400 mb-2"></i>
            <p class="text-gray-600">Agregar Nuevo Proyecto</p>
        `;
        addButton.onclick = () => this.openCreateProjectModal();
        container.appendChild(addButton);
        
        // Add existing projects
        this.data.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer';
            projectCard.innerHTML = `
                <h4 class="font-semibold text-gray-800 mb-2">${project.name}</h4>
                <p class="text-sm text-gray-600 mb-3">${project.description || 'Sin descripción'}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-500">${this.getProjectTaskCount(project.id)} tareas</span>
                    <button onclick="app.showProject('${project.id}')" class="text-blue-600 hover:text-blue-800 text-sm">
                        Ver proyecto <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>
            `;
            container.appendChild(projectCard);
        });
    }

    getProjectTaskCount(projectId) {
        return this.data.tasks.filter(task => task.projectId === projectId).length;
    }

    // Project Management
    loadProjectTabContent(tabName) {
        const container = document.getElementById('project-tab-content');
        
        switch (tabName) {
            case 'tasks':
                this.loadTasksTab();
                break;
            case 'board':
                this.loadBoardTab();
                break;
            case 'metrics':
                this.loadMetricsTab();
                break;
            case 'schedule':
                this.loadScheduleTab();
                break;
            case 'risks':
                this.loadRisksTab();
                break;
            case 'minutes':
                this.loadMinutesTab();
                break;
        }
    }

    loadTasksTab() {
        const container = document.getElementById('project-tab-content');
        const projectTasks = this.data.tasks.filter(task => task.projectId === this.currentProject);
        
        // Separate tasks that are already in sprints
        const tasksInSprints = new Set();
        this.data.sprints.forEach(sprint => {
            if (sprint.projectId === this.currentProject) {
                sprint.taskIds.forEach(taskId => tasksInSprints.add(taskId));
            }
        });
        
        const availableTasks = projectTasks.filter(task => !tasksInSprints.has(task.id));
        const sprintTasks = projectTasks.filter(task => tasksInSprints.has(task.id));
        
        container.innerHTML = `
            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold title-color">Tareas del Proyecto</h3>
                    <div class="flex space-x-3">
                        <button onclick="app.openCreateTaskModal()" class="btn-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                            <i class="fas fa-plus mr-2"></i>Crear Tarea
                        </button>
                        <button onclick="app.openCreateSprintModal()" class="btn-save text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                            <i class="fas fa-play mr-2"></i>Crear Sprint
                        </button>
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Seleccionar tareas para Sprint:</label>
                </div>
                
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input type="checkbox" id="select-all-tasks" class="rounded">
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Fin</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${availableTasks.map(task => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <input type="checkbox" value="${task.id}" class="task-checkbox rounded">
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.id}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${task.title}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs rounded-full ${this.getStatusColor(task.status)}">${task.status}</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.assignee || 'Sin asignar'}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs rounded-full ${this.getPriorityColor(task.priority)}">${task.priority}</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.startDate || 'Sin fecha'}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.endDate || 'Sin fecha'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div class="flex space-x-2">
                                <button onclick="app.editTask('${task.id}')" class="text-blue-600 hover:text-blue-900" title="Editar tarea">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="app.deleteTask('${task.id}')" class="text-red-600 hover:text-red-900" title="Eliminar tarea">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                                </tr>
                            `).join('')}
                            
                            ${sprintTasks.length > 0 ? `
                                <tr class="bg-gray-100">
                                    <td colspan="9" class="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-200">
                                        <i class="fas fa-info-circle mr-2"></i>Tareas ya asignadas a sprints
                                    </td>
                                </tr>
                                ${sprintTasks.map(task => `
                                    <tr class="bg-gray-50 opacity-75">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" disabled class="rounded opacity-50">
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.id}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${task.title}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 py-1 text-xs rounded-full ${this.getStatusColor(task.status)}">${task.status}</span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.assignee || 'Sin asignar'}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 py-1 text-xs rounded-full ${this.getPriorityColor(task.priority)}">${task.priority}</span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.startDate || 'Sin fecha'}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.endDate || 'Sin fecha'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div class="flex space-x-2">
                                <button onclick="app.editTask('${task.id}')" class="text-blue-600 hover:text-blue-900" title="Editar tarea">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="app.deleteTask('${task.id}')" class="text-red-600 hover:text-red-900" title="Eliminar tarea">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                                    </tr>
                                `).join('')}
                            ` : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getStatusColor(status) {
        const colors = {
            'Por Hacer': 'bg-gray-100 text-gray-800',
            'En Progreso': 'bg-yellow-100 text-yellow-800',
            'Impedimento': 'bg-red-100 text-red-800',
            'Terminado': 'bg-green-100 text-green-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    getPriorityColor(priority) {
        const colors = {
            'Baja': 'bg-green-100 text-green-800',
            'Media': 'bg-yellow-100 text-yellow-800',
            'Alta': 'bg-orange-100 text-orange-800',
            'Crítica': 'bg-red-100 text-red-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    }

    // Modal Functions
    openCreateProjectModal() {
        document.getElementById('create-project-modal').classList.remove('hidden');
    }

    closeCreateProjectModal() {
        document.getElementById('create-project-modal').classList.add('hidden');
        document.getElementById('create-project-form').reset();
    }

    openCreateTaskModal() {
        document.getElementById('create-task-modal').classList.remove('hidden');
        
        // Load available sprints
        const sprintSelect = document.getElementById('task-sprint');
        const currentSprints = this.data.sprints.filter(sprint => sprint.projectId === this.currentProject);
        
        // Clear existing options except the first one
        sprintSelect.innerHTML = '<option value="">No agregar a sprint</option>';
        
        currentSprints.forEach(sprint => {
            const option = document.createElement('option');
            option.value = sprint.id;
            option.textContent = `${sprint.name} (${sprint.startDate} - ${sprint.endDate})`;
            sprintSelect.appendChild(option);
        });
    }

    closeCreateTaskModal() {
        document.getElementById('create-task-modal').classList.add('hidden');
        document.getElementById('create-task-form').reset();
    }

    openCreateSprintModal() {
        document.getElementById('create-sprint-modal').classList.remove('hidden');
    }

    closeCreateSprintModal() {
        document.getElementById('create-sprint-modal').classList.add('hidden');
        document.getElementById('create-sprint-form').reset();
    }

    openAddColumnModal() {
        document.getElementById('add-column-modal').classList.remove('hidden');
    }

    closeAddColumnModal() {
        document.getElementById('add-column-modal').classList.add('hidden');
        document.getElementById('add-column-form').reset();
    }

    openCreateRiskModal() {
        document.getElementById('create-risk-modal').classList.remove('hidden');
    }

    closeCreateRiskModal() {
        document.getElementById('create-risk-modal').classList.add('hidden');
        document.getElementById('create-risk-form').reset();
    }

    openCreateMinutesModal() {
        document.getElementById('create-minutes-modal').classList.remove('hidden');
    }

    closeCreateMinutesModal() {
        document.getElementById('create-minutes-modal').classList.add('hidden');
        document.getElementById('create-minutes-form').reset();
    }

    showTaskDetails(taskId) {
        const task = this.data.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const container = document.getElementById('task-details-content');
        container.innerHTML = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <p class="text-gray-900 font-medium">${task.title}</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <p class="text-gray-900">${task.description || 'Sin descripción'}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <span class="px-2 py-1 text-xs rounded-full ${this.getStatusColor(task.status)}">${task.status}</span>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                        <span class="px-2 py-1 text-xs rounded-full ${this.getPriorityColor(task.priority)}">${task.priority}</span>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                    <p class="text-gray-900">${task.assignee || 'Sin asignar'}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                        <p class="text-gray-900">${task.startDate || 'Sin fecha'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                        <p class="text-gray-900">${task.endDate || 'Sin fecha'}</p>
                    </div>
                </div>
                
                ${task.comments ? `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Comentarios</label>
                        <p class="text-gray-900">${task.comments}</p>
                    </div>
                ` : ''}
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Creación</label>
                    <p class="text-gray-900">${new Date(task.createdAt).toLocaleDateString('es-ES')}</p>
                </div>
                
                <div class="flex justify-end space-x-3 mt-6">
                    <button onclick="app.editTask('${task.id}')" class="btn-edit text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                        <i class="fas fa-edit mr-2"></i>Editar Tarea
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('task-details-modal').classList.remove('hidden');
    }

    closeTaskDetailsModal() {
        document.getElementById('task-details-modal').classList.add('hidden');
    }

    editTask(taskId) {
        const task = this.data.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        // Fill the edit form with current task data
        document.getElementById('edit-task-title').value = task.title;
        document.getElementById('edit-task-description').value = task.description || '';
        document.getElementById('edit-task-assignee').value = task.assignee || '';
        document.getElementById('edit-task-priority').value = task.priority;
        document.getElementById('edit-task-status').value = task.status;
        document.getElementById('edit-task-start-date').value = task.startDate || '';
        document.getElementById('edit-task-end-date').value = task.endDate || '';
        document.getElementById('edit-task-comments').value = task.comments || '';
        
        // Store the task ID for updating
        document.getElementById('edit-task-form').dataset.taskId = taskId;
        
        // Show the modal
        document.getElementById('edit-task-modal').classList.remove('hidden');
    }

    closeEditTaskModal() {
        document.getElementById('edit-task-modal').classList.add('hidden');
        document.getElementById('edit-task-form').reset();
        delete document.getElementById('edit-task-form').dataset.taskId;
    }

    updateTask() {
        const taskId = document.getElementById('edit-task-form').dataset.taskId;
        if (!taskId) return;
        
        const task = this.data.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        // Update task data
        task.title = document.getElementById('edit-task-title').value;
        task.description = document.getElementById('edit-task-description').value;
        task.assignee = document.getElementById('edit-task-assignee').value;
        task.priority = document.getElementById('edit-task-priority').value;
        task.status = document.getElementById('edit-task-status').value;
        task.startDate = document.getElementById('edit-task-start-date').value;
        task.endDate = document.getElementById('edit-task-end-date').value;
        task.comments = document.getElementById('edit-task-comments').value;
        
        this.saveData();
        this.closeEditTaskModal();
        
        // Refresh the current view
        if (this.currentView === 'project-management') {
            if (this.currentProjectTab === 'tasks') {
                this.loadTasksTab();
            } else if (this.currentProjectTab === 'board') {
                this.loadBoardTab();
            }
        }
        
        alert('Tarea actualizada exitosamente');
    }

    // Data Management Functions
    openDataManagement() {
        document.getElementById('data-management-modal').classList.remove('hidden');
        this.updateDataInfo();
    }

    closeDataManagementModal() {
        document.getElementById('data-management-modal').classList.add('hidden');
    }

    updateDataInfo() {
        const container = document.getElementById('data-info');
        const projectsCount = this.data.projects.length;
        const tasksCount = this.data.tasks.length;
        const sprintsCount = this.data.sprints.length;
        const risksCount = this.data.risks.length;
        const minutesCount = this.data.meetingMinutes.length;
        const columnsCount = this.data.columns.length;

        const lastModified = localStorage.getItem('projectScopeLastModified');
        const lastModifiedDate = lastModified ? new Date(lastModified).toLocaleString('es-ES') : 'Nunca';

        container.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <strong>Proyectos:</strong> ${projectsCount}
                </div>
                <div>
                    <strong>Tareas:</strong> ${tasksCount}
                </div>
                <div>
                    <strong>Sprints:</strong> ${sprintsCount}
                </div>
                <div>
                    <strong>Riesgos:</strong> ${risksCount}
                </div>
                <div>
                    <strong>Actas:</strong> ${minutesCount}
                </div>
                <div>
                    <strong>Columnas:</strong> ${columnsCount}
                </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-300">
                <div class="text-xs text-gray-500">
                    <strong>Última modificación:</strong> ${lastModifiedDate}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                    <strong>Tamaño aproximado:</strong> ${Math.round(JSON.stringify(this.data).length / 1024)} KB
                </div>
            </div>
        `;
    }

    exportData() {
        try {
            const dataToExport = {
                ...this.data,
                exportDate: new Date().toISOString(),
                version: '1.0',
                appName: 'Project Scope'
            };

            const dataStr = JSON.stringify(dataToExport, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `project-scope-backup-${new Date().toISOString().split('T')[0]}.json`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            
            alert('Datos exportados exitosamente');
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Error al exportar los datos');
        }
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            alert('Por favor selecciona un archivo JSON válido');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate the imported data structure
                if (!this.validateImportedData(importedData)) {
                    alert('El archivo no contiene datos válidos de Project Scope');
                    return;
                }

                if (confirm('¿Estás seguro de que quieres importar estos datos? Esto reemplazará todos los datos actuales.')) {
                    this.data = {
                        projects: importedData.projects || [],
                        tasks: importedData.tasks || [],
                        sprints: importedData.sprints || [],
                        risks: importedData.risks || [],
                        meetingMinutes: importedData.meetingMinutes || [],
                        columns: importedData.columns || [
                            { id: 'todo', name: 'Por Hacer', order: 0 },
                            { id: 'progress', name: 'En Progreso', order: 1 },
                            { id: 'blocked', name: 'Impedimento', order: 2 },
                            { id: 'done', name: 'Terminado', order: 3 }
                        ]
                    };

                    this.saveData();
                    this.closeDataManagementModal();
                    location.reload();
                }
            } catch (error) {
                console.error('Error importing data:', error);
                alert('Error al importar el archivo. Verifica que sea un archivo JSON válido.');
            }
        };

        reader.readAsText(file);
    }

    validateImportedData(data) {
        // Basic validation to ensure the data structure is correct
        return data && 
               typeof data === 'object' && 
               Array.isArray(data.projects) && 
               Array.isArray(data.tasks) && 
               Array.isArray(data.sprints) && 
               Array.isArray(data.risks) && 
               Array.isArray(data.meetingMinutes) && 
               Array.isArray(data.columns);
    }

    loadDemoData() {
        if (confirm('¿Quieres cargar datos de demostración? Esto reemplazará cualquier dato existente.')) {
            // Import demo data from demo-data.js
            if (typeof demoData !== 'undefined') {
                this.data = {
                    projects: [...demoData.projects],
                    tasks: [...demoData.tasks],
                    sprints: [...demoData.sprints],
                    risks: [...demoData.risks],
                    meetingMinutes: [...demoData.meetingMinutes],
                    columns: [...demoData.columns]
                };
                
                this.saveData();
                this.closeDataManagementModal();
                location.reload();
            } else {
                alert('Error: No se pudieron cargar los datos de demostración');
            }
        }
    }

    clearAllData() {
        if (confirm('¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
            if (confirm('Esta es tu última oportunidad. ¿Realmente quieres eliminar todos los datos?')) {
                localStorage.removeItem('projectScopeData');
                localStorage.removeItem('projectScopeLastModified');
                this.closeDataManagementModal();
                location.reload();
            }
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Create Project Form
        document.getElementById('create-project-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createProject();
        });

        // Create Task Form
        document.getElementById('create-task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTask();
        });

        // Create Sprint Form
        document.getElementById('create-sprint-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createSprint();
        });

        // Add Column Form
        document.getElementById('add-column-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addColumn();
        });

        // Create Risk Form
        document.getElementById('create-risk-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createRisk();
        });

        // Create Minutes Form
        document.getElementById('create-minutes-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createMinutes();
        });
    }

    // CRUD Operations
    createProject() {
        const name = document.getElementById('project-name').value;
        const description = document.getElementById('project-description').value;
        
        const project = {
            id: Date.now().toString(),
            name,
            description,
            createdAt: new Date().toISOString()
        };
        
        this.data.projects.push(project);
        this.saveData();
        this.closeCreateProjectModal();
        this.loadProjectsView();
        this.loadHomeProjects();
    }

    createTask() {
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const assignee = document.getElementById('task-assignee').value;
        const priority = document.getElementById('task-priority').value;
        const startDate = document.getElementById('task-start-date').value;
        const endDate = document.getElementById('task-end-date').value;
        const comments = document.getElementById('task-comments').value;
        const sprintId = document.getElementById('task-sprint').value;
        
        // Generate consecutive task ID with T prefix
        const existingTaskIds = this.data.tasks.map(task => {
            const match = task.id.match(/^T(\d+)$/);
            return match ? parseInt(match[1]) : 0;
        });
        const maxTaskNumber = existingTaskIds.length > 0 ? Math.max(...existingTaskIds) : 0;
        const taskNumber = maxTaskNumber + 1;
        const taskId = `T${taskNumber}`;
        
        const task = {
            id: taskId,
            projectId: this.currentProject,
            title,
            description,
            assignee,
            priority,
            startDate,
            endDate,
            comments,
            status: 'Por Hacer',
            createdAt: new Date().toISOString()
        };
        
        this.data.tasks.push(task);
        
        // Add to sprint if selected
        if (sprintId) {
            const sprint = this.data.sprints.find(s => s.id === sprintId);
            if (sprint) {
                sprint.taskIds.push(task.id);
            }
        }
        
        this.saveData();
        this.closeCreateTaskModal();
        this.loadTasksTab();
    }

    createSprint() {
        const startDate = document.getElementById('sprint-start-date').value;
        const endDate = document.getElementById('sprint-end-date').value;
        const selectedTasks = Array.from(document.querySelectorAll('.task-checkbox:checked')).map(cb => cb.value);
        
        if (selectedTasks.length === 0) {
            alert('Por favor selecciona al menos una tarea para el sprint');
            return;
        }
        
        const sprintNumber = this.data.sprints.filter(s => s.projectId === this.currentProject).length + 1;
        
        const sprint = {
            id: Date.now().toString(),
            projectId: this.currentProject,
            name: `Sprint ${sprintNumber}`,
            startDate,
            endDate,
            taskIds: selectedTasks,
            createdAt: new Date().toISOString()
        };
        
        this.data.sprints.push(sprint);
        this.saveData();
        this.closeCreateSprintModal();
        this.loadBoardTab();
    }

    addColumn() {
        const name = document.getElementById('column-name').value;
        const maxOrder = Math.max(...this.data.columns.map(c => c.order));
        
        const column = {
            id: Date.now().toString(),
            name,
            order: maxOrder + 1
        };
        
        this.data.columns.push(column);
        this.saveData();
        this.closeAddColumnModal();
        this.loadBoardTab();
    }

    createRisk() {
        const name = document.getElementById('risk-name').value;
        const impact = parseInt(document.getElementById('risk-impact').value);
        const probability = parseInt(document.getElementById('risk-probability').value);
        const description = document.getElementById('risk-description').value;
        const mitigation = document.getElementById('risk-mitigation').value;
        const strategy = document.getElementById('risk-strategy').value;
        const status = document.getElementById('risk-status').value;
        
        const riskFactor = impact * probability;
        const appetite = this.calculateRiskAppetite(riskFactor);
        
        // Generate consecutive ID with R prefix
        const existingRiskIds = this.data.risks.map(risk => {
            const match = risk.id.match(/^R(\d+)$/);
            return match ? parseInt(match[1]) : 0;
        });
        const maxRiskNumber = existingRiskIds.length > 0 ? Math.max(...existingRiskIds) : 0;
        const riskNumber = maxRiskNumber + 1;
        const riskId = `R${riskNumber}`;
        
        const risk = {
            id: riskId,
            projectId: this.currentProject,
            name,
            impact,
            probability,
            riskFactor,
            appetite,
            description,
            mitigation,
            strategy,
            status,
            createdAt: new Date().toISOString()
        };
        
        this.data.risks.push(risk);
        this.saveData();
        this.closeCreateRiskModal();
        this.loadRisksTab();
    }

    calculateRiskAppetite(factor) {
        if (factor <= 4) return 'Riesgo Bajo';
        if (factor <= 8) return 'Riesgo Moderado';
        if (factor <= 12) return 'Riesgo Alto';
        return 'Riesgo Extremo';
    }

    createMinutes() {
        const title = document.getElementById('minutes-title').value;
        const date = document.getElementById('minutes-date').value;
        
        const minutes = {
            id: Date.now().toString(),
            projectId: this.currentProject,
            title,
            date,
            content: '',
            createdAt: new Date().toISOString()
        };
        
        this.data.meetingMinutes.push(minutes);
        this.saveData();
        this.closeCreateMinutesModal();
        this.loadMinutesTab();
    }

    deleteTask(taskId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            this.data.tasks = this.data.tasks.filter(task => task.id !== taskId);
            this.saveData();
            this.loadTasksTab();
        }
    }

    deleteProject(projectId) {
        if (confirm('¿Estás seguro de que quieres eliminar este proyecto? Esto también eliminará todas las tareas asociadas.')) {
            this.data.projects = this.data.projects.filter(project => project.id !== projectId);
            this.data.tasks = this.data.tasks.filter(task => task.projectId !== projectId);
            this.data.sprints = this.data.sprints.filter(sprint => sprint.projectId !== projectId);
            this.data.risks = this.data.risks.filter(risk => risk.projectId !== projectId);
            this.data.meetingMinutes = this.data.meetingMinutes.filter(minutes => minutes.projectId !== projectId);
            this.saveData();
            this.loadProjectsView();
            this.loadHomeProjects();
        }
    }

    // Load Projects View
    loadProjectsView() {
        const container = document.getElementById('projects-grid');
        if (!container) {
            console.error('Projects grid container not found');
            return;
        }
        container.innerHTML = '';
        
        this.data.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer';
            projectCard.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-semibold title-color">${project.name}</h3>
                    <button onclick="app.deleteProject('${project.id}')" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <p class="text-gray-600 mb-4">${project.description || 'Sin descripción'}</p>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">${this.getProjectTaskCount(project.id)} tareas</span>
                    <button onclick="app.showProject('${project.id}')" class="btn-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                        Gestionar Proyecto
                    </button>
                </div>
            `;
            container.appendChild(projectCard);
        });
    }
}

// Global functions for HTML onclick events
function showView(viewName) {
    app.showView(viewName);
}

function showProject(projectId) {
    app.showProject(projectId);
}

function showProjectTab(tabName) {
    app.showProjectTab(tabName);
}

function openCreateProjectModal() {
    app.openCreateProjectModal();
}

function closeCreateProjectModal() {
    app.closeCreateProjectModal();
}

function openCreateTaskModal() {
    app.openCreateTaskModal();
}

function closeCreateTaskModal() {
    app.closeCreateTaskModal();
}

function openCreateSprintModal() {
    app.openCreateSprintModal();
}

function closeCreateSprintModal() {
    app.closeCreateSprintModal();
}

function openAddColumnModal() {
    app.openAddColumnModal();
}

function closeAddColumnModal() {
    app.closeAddColumnModal();
}

function openCreateRiskModal() {
    app.openCreateRiskModal();
}

function closeCreateRiskModal() {
    app.closeCreateRiskModal();
}

function openCreateMinutesModal() {
    app.openCreateMinutesModal();
}

function     closeCreateMinutesModal() {
        app.closeCreateMinutesModal();
    }

    function showTaskDetails(taskId) {
        app.showTaskDetails(taskId);
    }

    function closeTaskDetailsModal() {
        app.closeTaskDetailsModal();
    }

    function closeEditTaskModal() {
        app.closeEditTaskModal();
    }

    function closeEditRiskModal() {
        app.closeEditRiskModal();
    }

    function closeDataManagementModal() {
        app.closeDataManagementModal();
    }

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ProjectScopeApp();
});
