/**
 * API Client for Project Scope Backend - Production Configuration
 * Handles all communication with the MySQL backend
 */
class ProjectScopeAPI {
    constructor() {
        // Production API URL - Change this to your Vercel API URL
        this.baseURL = 'https://tuproyecto.vercel.app/api'; // ← Cambiar por tu URL de Vercel
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

    // ... resto del código igual que antes ...
}

// Create global API instance
window.api = new ProjectScopeAPI();
