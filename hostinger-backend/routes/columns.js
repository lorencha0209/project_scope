const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/columns - Get all columns for a project
router.get('/', async (req, res) => {
    try {
        const { project_id } = req.query;
        
        if (!project_id) {
            return res.status(400).json({ error: 'project_id parameter is required' });
        }

        const columns = await db.query(`
            SELECT * FROM kanban_columns 
            WHERE project_id = ? 
            ORDER BY order_index ASC
        `, [project_id]);

        res.json(columns);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch columns', details: error.message });
    }
});

// GET /api/columns/:id - Get column by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const columns = await db.query('SELECT * FROM kanban_columns WHERE id = ?', [id]);
        
        if (columns.length === 0) {
            return res.status(404).json({ error: 'Column not found' });
        }
        
        res.json(columns[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch column', details: error.message });
    }
});

// POST /api/columns - Create new column
router.post('/', async (req, res) => {
    try {
        const { id, project_id, name, order_index, is_default = false } = req.body;
        
        if (!id || !project_id || !name) {
            return res.status(400).json({ error: 'Column ID, project ID and name are required' });
        }

        // Get the next order index if not provided
        let finalOrderIndex = order_index;
        if (finalOrderIndex === undefined) {
            const maxOrder = await db.query(
                'SELECT MAX(order_index) as max_order FROM kanban_columns WHERE project_id = ?',
                [project_id]
            );
            finalOrderIndex = (maxOrder[0].max_order || -1) + 1;
        }

        await db.query(
            'INSERT INTO kanban_columns (id, project_id, name, order_index, is_default) VALUES (?, ?, ?, ?, ?)',
            [id, project_id, name, finalOrderIndex, is_default]
        );

        res.status(201).json({ message: 'Column created successfully', id });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Column with this ID already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create column', details: error.message });
        }
    }
});

// PUT /api/columns/:id - Update column
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, order_index } = req.body;
        
        const result = await db.query(
            'UPDATE kanban_columns SET name = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [name, order_index, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Column not found' });
        }

        res.json({ message: 'Column updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update column', details: error.message });
    }
});

// DELETE /api/columns/:id - Delete column
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if it's a default column
        const columns = await db.query('SELECT is_default FROM kanban_columns WHERE id = ?', [id]);
        
        if (columns.length === 0) {
            return res.status(404).json({ error: 'Column not found' });
        }
        
        if (columns[0].is_default) {
            return res.status(400).json({ error: 'Cannot delete default columns' });
        }

        const result = await db.query('DELETE FROM kanban_columns WHERE id = ?', [id]);

        res.json({ message: 'Column deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete column', details: error.message });
    }
});

// PUT /api/columns/reorder - Reorder columns
router.put('/reorder', async (req, res) => {
    try {
        const { project_id, column_orders } = req.body;
        
        if (!project_id || !column_orders || !Array.isArray(column_orders)) {
            return res.status(400).json({ error: 'project_id and column_orders array are required' });
        }

        await db.transaction(async (db) => {
            for (const { id, order_index } of column_orders) {
                await db.query(
                    'UPDATE kanban_columns SET order_index = ? WHERE id = ? AND project_id = ?',
                    [order_index, id, project_id]
                );
            }
        });

        res.json({ message: 'Columns reordered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reorder columns', details: error.message });
    }
});

module.exports = router;
