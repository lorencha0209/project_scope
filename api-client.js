/**
 * API Client for Project Scope Backend
 * Handles all communication with the MySQL backend
 */
class ProjectScopeAPI {
    constructor() {
        this.baseURL = 'https://project-scope-backend.vercel.app/api';
        this.currentProject = null;
        this.token = localStorage.getItem('projectScopeToken');
        this.user = null;
    }

    /**
     * Generic API request method
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add authentication header if token exists
        if (this.token && !endpoint.includes('/auth/login') && !endpoint.includes('/health')) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Handle authentication errors
                if (response.status === 401) {
                    this.logout();
                    throw new Error('Session expired. Please login again.');
                }
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    /**
     * Health check
     */
    async healthCheck() {
        return this.request('/health');
    }

    // ==================== AUTHENTICATION ====================

    async login(username, password) {
        try {
            const response = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            this.token = response.token;
            this.user = response.user;
            
            // Store token in localStorage
            localStorage.setItem('projectScopeToken', this.token);
            localStorage.setItem('projectScopeUser', JSON.stringify(this.user));

            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    async logout() {
        try {
            if (this.token) {
                await this.request('/auth/logout', {
                    method: 'POST'
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local data regardless of API response
            this.token = null;
            this.user = null;
            localStorage.removeItem('projectScopeToken');
            localStorage.removeItem('projectScopeUser');
        }
    }

    async verifyToken() {
        try {
            if (!this.token) {
                return false;
            }
            
            const response = await this.request('/auth/verify');
            this.user = response.user;
            return true;
        } catch (error) {
            console.error('Token verification failed:', error);
            this.logout();
            return false;
        }
    }

    async refreshToken() {
        try {
            if (!this.token) {
                throw new Error('No token to refresh');
            }
            
            const response = await this.request('/auth/refresh', {
                method: 'POST'
            });
            
            this.token = response.token;
            localStorage.setItem('projectScopeToken', this.token);
            
            return response;
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.logout();
            throw error;
        }
    }

    isAuthenticated() {
        return !!this.token;
    }

    getCurrentUser() {
        return this.user;
    }

    async getProjects() {
        return this.request('/projects');
    }

    async getProject(id) {
        return this.request(`/projects/${id}`);
    }

    async createProject(project) {
        return this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(project)
        });
    }

    async updateProject(id, project) {
        return this.request(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(project)
        });
    }

    async deleteProject(id) {
        return this.request(`/projects/${id}`, {
            method: 'DELETE'
        });
    }

    // ==================== TASKS ====================

    async getTasks(projectId) {
        return this.request(`/tasks?project_id=${projectId}`);
    }

    async getTask(id) {
        return this.request(`/tasks/${id}`);
    }

    async createTask(task) {
        return this.request('/tasks', {
            method: 'POST',
            body: JSON.stringify(task)
        });
    }

    async updateTask(id, task) {
        return this.request(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(task)
        });
    }

    async deleteTask(id) {
        return this.request(`/tasks/${id}`, {
            method: 'DELETE'
        });
    }

    async addTaskToSprint(taskId, sprintId) {
        return this.request(`/tasks/${taskId}/sprint`, {
            method: 'POST',
            body: JSON.stringify({ sprint_id: sprintId })
        });
    }

    async removeTaskFromSprint(taskId, sprintId) {
        return this.request(`/tasks/${taskId}/sprint/${sprintId}`, {
            method: 'DELETE'
        });
    }

    // ==================== SPRINTS ====================

    async getSprints(projectId) {
        return this.request(`/sprints?project_id=${projectId}`);
    }

    async getSprint(id) {
        return this.request(`/sprints/${id}`);
    }

    async createSprint(sprint) {
        return this.request('/sprints', {
            method: 'POST',
            body: JSON.stringify(sprint)
        });
    }

    async updateSprint(id, sprint) {
        return this.request(`/sprints/${id}`, {
            method: 'PUT',
            body: JSON.stringify(sprint)
        });
    }

    async deleteSprint(id) {
        return this.request(`/sprints/${id}`, {
            method: 'DELETE'
        });
    }

    async addTasksToSprint(sprintId, taskIds) {
        return this.request(`/sprints/${sprintId}/tasks`, {
            method: 'POST',
            body: JSON.stringify({ task_ids: taskIds })
        });
    }

    async removeTaskFromSprint(sprintId, taskId) {
        return this.request(`/sprints/${sprintId}/tasks/${taskId}`, {
            method: 'DELETE'
        });
    }

    // ==================== RISKS ====================

    async getRisks(projectId) {
        return this.request(`/risks?project_id=${projectId}`);
    }

    async getRisk(id) {
        return this.request(`/risks/${id}`);
    }

    async createRisk(risk) {
        return this.request('/risks', {
            method: 'POST',
            body: JSON.stringify(risk)
        });
    }

    async updateRisk(id, risk) {
        return this.request(`/risks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(risk)
        });
    }

    async deleteRisk(id) {
        return this.request(`/risks/${id}`, {
            method: 'DELETE'
        });
    }

    async getRiskStats(projectId) {
        return this.request(`/risks/stats/${projectId}`);
    }

    // ==================== MINUTES ====================

    async getMinutes(projectId) {
        return this.request(`/minutes?project_id=${projectId}`);
    }

    async getMinute(id) {
        return this.request(`/minutes/${id}`);
    }

    async createMinute(minute) {
        return this.request('/minutes', {
            method: 'POST',
            body: JSON.stringify(minute)
        });
    }

    async updateMinute(id, minute) {
        return this.request(`/minutes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(minute)
        });
    }

    async deleteMinute(id) {
        return this.request(`/minutes/${id}`, {
            method: 'DELETE'
        });
    }

    // ==================== COLUMNS ====================

    async getColumns(projectId) {
        return this.request(`/columns?project_id=${projectId}`);
    }

    // ==================== UTILITIES ====================

    async generateId(prefix, projectId = null) {
        const url = projectId ? `/generate-id/${prefix}?project_id=${projectId}` : `/generate-id/${prefix}`;
        const response = await this.request(url);
        return response.id;
    }

    async getColumn(id) {
        return this.request(`/columns/${id}`);
    }

    async createColumn(column) {
        return this.request('/columns', {
            method: 'POST',
            body: JSON.stringify(column)
        });
    }

    async updateColumn(id, column) {
        return this.request(`/columns/${id}`, {
            method: 'PUT',
            body: JSON.stringify(column)
        });
    }

    async deleteColumn(id) {
        return this.request(`/columns/${id}`, {
            method: 'DELETE'
        });
    }

    async reorderColumns(projectId, columnOrders) {
        return this.request('/columns/reorder', {
            method: 'PUT',
            body: JSON.stringify({ 
                project_id: projectId, 
                column_orders: columnOrders 
            })
        });
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Generate consecutive ID with prefix
     */
    async generateId(prefix, existingIds) {
        const numbers = existingIds.map(id => {
            const match = id.match(new RegExp(`^${prefix}(\\d+)$`));
            return match ? parseInt(match[1]) : 0;
        });
        const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
        return `${prefix}${maxNumber + 1}`;
    }

    /**
     * Set current project context
     */
    setCurrentProject(projectId) {
        this.currentProject = projectId;
    }

    /**
     * Get current project context
     */
    getCurrentProject() {
        return this.currentProject;
    }

    /**
     * Check if API is available
     */
    async isAvailable() {
        try {
            await this.healthCheck();
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Create global API instance
window.api = new ProjectScopeAPI();
