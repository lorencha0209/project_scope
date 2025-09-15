const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/tasks - Get all tasks for a project
router.get('/', async (req, res) => {
    try {
        const { project_id } = req.query;
        
        if (!project_id) {
            return res.status(400).json({ error: 'project_id parameter is required' });
        }

        const tasks = await db.query(`
            SELECT t.*, 
                   GROUP_CONCAT(st.sprint_id) as sprint_ids
            FROM tasks t
            LEFT JOIN sprint_tasks st ON t.id = st.task_id
            WHERE t.project_id = ?
            GROUP BY t.id
            ORDER BY t.created_at DESC
        `, [project_id]);

        // Parse sprint_ids for each task
        tasks.forEach(task => {
            task.sprint_ids = task.sprint_ids ? task.sprint_ids.split(',') : [];
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
    }
});

// GET /api/tasks/:id - Get task by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const tasks = await db.query(`
            SELECT t.*, 
                   GROUP_CONCAT(st.sprint_id) as sprint_ids
            FROM tasks t
            LEFT JOIN sprint_tasks st ON t.id = st.task_id
            WHERE t.id = ?
            GROUP BY t.id
        `, [id]);
        
        if (tasks.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        const task = tasks[0];
        task.sprint_ids = task.sprint_ids ? task.sprint_ids.split(',') : [];
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch task', details: error.message });
    }
});

// POST /api/tasks - Create new task
router.post('/', async (req, res) => {
    try {
        const { 
            id, 
            project_id, 
            title, 
            description, 
            status = 'todo', 
            priority = 'medium', 
            responsible, 
            start_date, 
            end_date, 
            comments,
            sprint_id 
        } = req.body;
        
        if (!id || !project_id || !title) {
            return res.status(400).json({ error: 'Task ID, project ID and title are required' });
        }

        await db.transaction(async (db) => {
            // Insert task
            await db.query(
                `INSERT INTO tasks (id, project_id, title, description, status, priority, responsible, start_date, end_date, comments) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, project_id, title, description, status, priority, responsible, start_date, end_date, comments]
            );

            // Add to sprint if specified
            if (sprint_id) {
                await db.query(
                    'INSERT INTO sprint_tasks (sprint_id, task_id) VALUES (?, ?)',
                    [sprint_id, id]
                );
            }
        });

        res.status(201).json({ message: 'Task created successfully', id });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Task with this ID already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create task', details: error.message });
        }
    }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, 
            description, 
            status, 
            priority, 
            responsible, 
            start_date, 
            end_date, 
            comments 
        } = req.body;
        
        const result = await db.query(
            `UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, responsible = ?, 
             start_date = ?, end_date = ?, comments = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [title, description, status, priority, responsible, start_date, end_date, comments, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task', details: error.message });
    }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.query('DELETE FROM tasks WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task', details: error.message });
    }
});

// POST /api/tasks/:id/sprint - Add task to sprint
router.post('/:id/sprint', async (req, res) => {
    try {
        const { id } = req.params;
        const { sprint_id } = req.body;
        
        if (!sprint_id) {
            return res.status(400).json({ error: 'sprint_id is required' });
        }

        await db.query(
            'INSERT INTO sprint_tasks (sprint_id, task_id) VALUES (?, ?)',
            [sprint_id, id]
        );

        res.json({ message: 'Task added to sprint successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Task is already in this sprint' });
        } else {
            res.status(500).json({ error: 'Failed to add task to sprint', details: error.message });
        }
    }
});

// DELETE /api/tasks/:id/sprint/:sprint_id - Remove task from sprint
router.delete('/:id/sprint/:sprint_id', async (req, res) => {
    try {
        const { id, sprint_id } = req.params;
        
        const result = await db.query(
            'DELETE FROM sprint_tasks WHERE task_id = ? AND sprint_id = ?',
            [id, sprint_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found in sprint' });
        }

        res.json({ message: 'Task removed from sprint successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove task from sprint', details: error.message });
    }
});

module.exports = router;
