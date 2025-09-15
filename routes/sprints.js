const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/sprints - Get all sprints for a project
router.get('/', async (req, res) => {
    try {
        const { project_id } = req.query;
        
        if (!project_id) {
            return res.status(400).json({ error: 'project_id parameter is required' });
        }

        const sprints = await db.query(`
            SELECT s.*, 
                   COUNT(st.task_id) as task_count,
                   COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed_tasks
            FROM sprints s
            LEFT JOIN sprint_tasks st ON s.id = st.sprint_id
            LEFT JOIN tasks t ON st.task_id = t.id
            WHERE s.project_id = ?
            GROUP BY s.id
            ORDER BY s.start_date DESC
        `, [project_id]);

        res.json(sprints);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sprints', details: error.message });
    }
});

// GET /api/sprints/:id - Get sprint by ID with tasks
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get sprint details
        const sprints = await db.query('SELECT * FROM sprints WHERE id = ?', [id]);
        
        if (sprints.length === 0) {
            return res.status(404).json({ error: 'Sprint not found' });
        }

        const sprint = sprints[0];

        // Get tasks for this sprint
        const tasks = await db.query(`
            SELECT t.*, st.created_at as added_to_sprint_at
            FROM tasks t
            INNER JOIN sprint_tasks st ON t.id = st.task_id
            WHERE st.sprint_id = ?
            ORDER BY st.created_at ASC
        `, [id]);

        sprint.tasks = tasks;
        res.json(sprint);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sprint', details: error.message });
    }
});

// POST /api/sprints - Create new sprint
router.post('/', async (req, res) => {
    try {
        const { id, project_id, name, start_date, end_date, status = 'planning', task_ids = [] } = req.body;
        
        if (!id || !project_id || !name || !start_date || !end_date) {
            return res.status(400).json({ error: 'Sprint ID, project ID, name, start date and end date are required' });
        }

        await db.transaction(async (db) => {
            // Insert sprint
            await db.query(
                'INSERT INTO sprints (id, project_id, name, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?)',
                [id, project_id, name, start_date, end_date, status]
            );

            // Add tasks to sprint if specified
            if (task_ids.length > 0) {
                for (const task_id of task_ids) {
                    await db.query(
                        'INSERT INTO sprint_tasks (sprint_id, task_id) VALUES (?, ?)',
                        [id, task_id]
                    );
                }
            }
        });

        res.status(201).json({ message: 'Sprint created successfully', id });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Sprint with this ID already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create sprint', details: error.message });
        }
    }
});

// PUT /api/sprints/:id - Update sprint
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, start_date, end_date, status } = req.body;
        
        const result = await db.query(
            'UPDATE sprints SET name = ?, start_date = ?, end_date = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [name, start_date, end_date, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sprint not found' });
        }

        res.json({ message: 'Sprint updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update sprint', details: error.message });
    }
});

// DELETE /api/sprints/:id - Delete sprint
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.query('DELETE FROM sprints WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sprint not found' });
        }

        res.json({ message: 'Sprint deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete sprint', details: error.message });
    }
});

// POST /api/sprints/:id/tasks - Add multiple tasks to sprint
router.post('/:id/tasks', async (req, res) => {
    try {
        const { id } = req.params;
        const { task_ids } = req.body;
        
        if (!task_ids || !Array.isArray(task_ids)) {
            return res.status(400).json({ error: 'task_ids array is required' });
        }

        await db.transaction(async (db) => {
            for (const task_id of task_ids) {
                await db.query(
                    'INSERT INTO sprint_tasks (sprint_id, task_id) VALUES (?, ?)',
                    [id, task_id]
                );
            }
        });

        res.json({ message: `${task_ids.length} tasks added to sprint successfully` });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'One or more tasks are already in this sprint' });
        } else {
            res.status(500).json({ error: 'Failed to add tasks to sprint', details: error.message });
        }
    }
});

// DELETE /api/sprints/:id/tasks/:task_id - Remove task from sprint
router.delete('/:id/tasks/:task_id', async (req, res) => {
    try {
        const { id, task_id } = req.params;
        
        const result = await db.query(
            'DELETE FROM sprint_tasks WHERE sprint_id = ? AND task_id = ?',
            [id, task_id]
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
