const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await db.query(`
            SELECT p.*, 
                   COUNT(DISTINCT s.id) as sprint_count,
                   COUNT(DISTINCT t.id) as task_count,
                   COUNT(DISTINCT r.id) as risk_count
            FROM projects p
            LEFT JOIN sprints s ON p.id = s.project_id
            LEFT JOIN tasks t ON p.id = t.project_id
            LEFT JOIN risks r ON p.id = r.project_id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects', details: error.message });
    }
});

// GET /api/projects/:id - Get project by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const projects = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
        
        if (projects.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        res.json(projects[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project', details: error.message });
    }
});

// POST /api/projects - Create new project
router.post('/', async (req, res) => {
    try {
        const { id, name, description, status = 'active' } = req.body;
        
        if (!id || !name) {
            return res.status(400).json({ error: 'Project ID and name are required' });
        }

        await db.query(
            'INSERT INTO projects (id, name, description, status) VALUES (?, ?, ?, ?)',
            [id, name, description, status]
        );

        // Create default kanban columns for the project
        const defaultColumns = [
            { id: `${id}_todo`, project_id: id, name: 'Por Hacer', order_index: 0, is_default: true },
            { id: `${id}_progress`, project_id: id, name: 'En Progreso', order_index: 1, is_default: true },
            { id: `${id}_blocked`, project_id: id, name: 'Impedimento', order_index: 2, is_default: true },
            { id: `${id}_done`, project_id: id, name: 'Terminado', order_index: 3, is_default: true }
        ];

        for (const column of defaultColumns) {
            await db.query(
                'INSERT INTO kanban_columns (id, project_id, name, order_index, is_default) VALUES (?, ?, ?, ?, ?)',
                [column.id, column.project_id, column.name, column.order_index, column.is_default]
            );
        }

        res.status(201).json({ message: 'Project created successfully', id });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Project with this ID already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create project', details: error.message });
        }
    }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;
        
        const result = await db.query(
            'UPDATE projects SET name = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [name, description, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update project', details: error.message });
    }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.query('DELETE FROM projects WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project', details: error.message });
    }
});

module.exports = router;
