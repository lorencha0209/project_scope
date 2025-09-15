const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/risks - Get all risks for a project
router.get('/', async (req, res) => {
    try {
        const { project_id } = req.query;
        
        if (!project_id) {
            return res.status(400).json({ error: 'project_id parameter is required' });
        }

        const risks = await db.query(`
            SELECT * FROM risks 
            WHERE project_id = ? 
            ORDER BY risk_factor DESC, created_at DESC
        `, [project_id]);

        res.json(risks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch risks', details: error.message });
    }
});

// GET /api/risks/:id - Get risk by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const risks = await db.query('SELECT * FROM risks WHERE id = ?', [id]);
        
        if (risks.length === 0) {
            return res.status(404).json({ error: 'Risk not found' });
        }
        
        res.json(risks[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch risk', details: error.message });
    }
});

// POST /api/risks - Create new risk
router.post('/', async (req, res) => {
    try {
        const { 
            id, 
            project_id, 
            name, 
            description, 
            impact, 
            probability, 
            mitigation_plan, 
            strategy = 'mitigate', 
            status = 'open' 
        } = req.body;
        
        if (!id || !project_id || !name || !impact || !probability) {
            return res.status(400).json({ error: 'Risk ID, project ID, name, impact and probability are required' });
        }

        if (impact < 1 || impact > 4 || probability < 1 || probability > 4) {
            return res.status(400).json({ error: 'Impact and probability must be between 1 and 4' });
        }

        await db.query(
            `INSERT INTO risks (id, project_id, name, description, impact, probability, mitigation_plan, strategy, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, project_id, name, description, impact, probability, mitigation_plan, strategy, status]
        );

        res.status(201).json({ message: 'Risk created successfully', id });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Risk with this ID already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create risk', details: error.message });
        }
    }
});

// PUT /api/risks/:id - Update risk
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, 
            description, 
            impact, 
            probability, 
            mitigation_plan, 
            strategy, 
            status 
        } = req.body;
        
        if (impact && (impact < 1 || impact > 4)) {
            return res.status(400).json({ error: 'Impact must be between 1 and 4' });
        }
        
        if (probability && (probability < 1 || probability > 4)) {
            return res.status(400).json({ error: 'Probability must be between 1 and 4' });
        }

        const result = await db.query(
            `UPDATE risks SET name = ?, description = ?, impact = ?, probability = ?, 
             mitigation_plan = ?, strategy = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [name, description, impact, probability, mitigation_plan, strategy, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Risk not found' });
        }

        res.json({ message: 'Risk updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update risk', details: error.message });
    }
});

// DELETE /api/risks/:id - Delete risk
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.query('DELETE FROM risks WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Risk not found' });
        }

        res.json({ message: 'Risk deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete risk', details: error.message });
    }
});

// GET /api/risks/stats/:project_id - Get risk statistics for a project
router.get('/stats/:project_id', async (req, res) => {
    try {
        const { project_id } = req.params;
        
        const stats = await db.query(`
            SELECT 
                COUNT(*) as total_risks,
                COUNT(CASE WHEN status = 'open' THEN 1 END) as open_risks,
                COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_risks,
                COUNT(CASE WHEN status = 'monitoring' THEN 1 END) as monitoring_risks,
                COUNT(CASE WHEN appetite = 'low' THEN 1 END) as low_risks,
                COUNT(CASE WHEN appetite = 'moderate' THEN 1 END) as moderate_risks,
                COUNT(CASE WHEN appetite = 'high' THEN 1 END) as high_risks,
                COUNT(CASE WHEN appetite = 'extreme' THEN 1 END) as extreme_risks,
                COUNT(CASE WHEN strategy = 'avoid' THEN 1 END) as avoid_strategy,
                COUNT(CASE WHEN strategy = 'mitigate' THEN 1 END) as mitigate_strategy,
                COUNT(CASE WHEN strategy = 'transfer' THEN 1 END) as transfer_strategy,
                COUNT(CASE WHEN strategy = 'accept' THEN 1 END) as accept_strategy
            FROM risks 
            WHERE project_id = ?
        `, [project_id]);

        res.json(stats[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch risk statistics', details: error.message });
    }
});

module.exports = router;
