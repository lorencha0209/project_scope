const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const projectsRoutes = require('./routes/projects');
const sprintsRoutes = require('./routes/sprints');
const tasksRoutes = require('./routes/tasks');
const risksRoutes = require('./routes/risks');
const minutesRoutes = require('./routes/minutes');
const columnsRoutes = require('./routes/columns');

// Import authentication middleware
const auth = require('./middleware/auth');

// Public routes (no authentication required)
app.use('/api/auth', authRoutes);

// Health check endpoint (public)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Project Scope API is running',
        timestamp: new Date().toISOString()
    });
});

// Protected routes (authentication required)
app.use('/api/projects', auth.authenticate, projectsRoutes);
app.use('/api/sprints', auth.authenticate, sprintsRoutes);
app.use('/api/tasks', auth.authenticate, tasksRoutes);
app.use('/api/risks', auth.authenticate, risksRoutes);
app.use('/api/minutes', auth.authenticate, minutesRoutes);
app.use('/api/columns', auth.authenticate, columnsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Project Scope API server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Authentication: http://localhost:${PORT}/api/auth/login`);
});
