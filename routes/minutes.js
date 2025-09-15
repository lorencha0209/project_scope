const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/minutes - Get all minutes for a project
router.get('/', async (req, res) => {
    try {
        const { project_id } = req.query;
        
        if (!project_id) {
            return res.status(400).json({ error: 'project_id parameter is required' });
        }

        const minutes = await db.query(`
            SELECT * FROM minutes 
            WHERE project_id = ? 
            ORDER BY meeting_date DESC, created_at DESC
        `, [project_id]);

        res.json(minutes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch minutes', details: error.message });
    }
});

// GET /api/minutes/:id - Get minutes by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const minutes = await db.query('SELECT * FROM minutes WHERE id = ?', [id]);
        
        if (minutes.length === 0) {
            return res.status(404).json({ error: 'Minutes not found' });
        }
        
        res.json(minutes[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch minutes', details: error.message });
    }
});

// POST /api/minutes - Create new minutes
router.post('/', async (req, res) => {
    try {
        const { id, project_id, title, content, meeting_date } = req.body;
        
        if (!id || !project_id || !title || !meeting_date) {
            return res.status(400).json({ error: 'Minutes ID, project ID, title and meeting date are required' });
        }

        await db.query(
            'INSERT INTO minutes (id, project_id, title, content, meeting_date) VALUES (?, ?, ?, ?, ?)',
            [id, project_id, title, content || '', meeting_date]
        );

        res.status(201).json({ message: 'Minutes created successfully', id });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Minutes with this ID already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create minutes', details: error.message });
        }
    }
});

// PUT /api/minutes/:id - Update minutes
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, meeting_date } = req.body;
        
        const result = await db.query(
            'UPDATE minutes SET title = ?, content = ?, meeting_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [title, content, meeting_date, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Minutes not found' });
        }

        res.json({ message: 'Minutes updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update minutes', details: error.message });
    }
});

// DELETE /api/minutes/:id - Delete minutes
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.query('DELETE FROM minutes WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Minutes not found' });
        }

        res.json({ message: 'Minutes deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete minutes', details: error.message });
    }
});

module.exports = router;
